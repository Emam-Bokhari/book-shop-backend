import { Order } from '../Order/order.model';
import { Product } from '../Product/product.model';
import { User } from '../User/user.model';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];


const getStats = async () => {
  const totalOrders = await Order.countDocuments();

  const totalSales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalProducts = await Product.countDocuments({ isDeleted: false });

  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const lowStockProducts = await Product.countDocuments({
    isDeleted: false,
    quantity: { $lte: 5 },
  });

  return {
    totalOrders,
    totalSales: totalSales[0]?.total || 0,
    totalUsers,
    totalProducts,
    pendingOrders,
    deliveredOrders,
    lowStockProducts,
  };
};


const getOrderStatusDistribution = async () => {
  const totalOrders = await Order.countDocuments();

  const statusData = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
        totalAmount: { $round: ['$totalAmount', 2] },
        percentage: {
          $cond: [
            { $eq: [totalOrders, 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ['$count', totalOrders] }, 100] },
                1,
              ],
            },
          ],
        },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return statusData;
};


const getSalesByCategory = async () => {
  const categorySales = await Order.aggregate([
    { $unwind: '$products' },
    {
      $lookup: {
        from: 'products',
        localField: 'products.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $group: {
        _id: '$productDetails.category',
        totalQuantitySold: { $sum: '$products.quantity' },
        totalRevenue: {
          $sum: {
            $multiply: ['$products.quantity', '$productDetails.price'],
          },
        },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalQuantitySold: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        orderCount: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return categorySales;
};


const getMonthlySalesTrend = async () => {
  const trend = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: { $ifNull: ['$orderDate', '$createdAt'] } },
          month: { $month: { $ifNull: ['$orderDate', '$createdAt'] } },
        },
        totalSales: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalSales: { $round: ['$totalSales', 2] },
        orderCount: 1,
      },
    },
  ]);

  const formattedTrend = trend.map((item) => ({
    year: item.year,
    month: monthNames[item.month - 1] || `${item.month}`,
    monthKey: `${item.year}-${String(item.month).padStart(2, '0')}`,
    label: `${monthNames[item.month - 1]} ${item.year}`,
    totalSales: item.totalSales,
    orderCount: item.orderCount,
  }));

  return formattedTrend;
};


const getPaymentStatusDistribution = async () => {
  const totalOrders = await Order.countDocuments();

  const paymentData = await Order.aggregate([
    {
      $group: {
        _id: '$paymentStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        paymentStatus: '$_id',
        count: 1,
        totalAmount: { $round: ['$totalAmount', 2] },
        percentage: {
          $cond: [
            { $eq: [totalOrders, 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ['$count', totalOrders] }, 100] },
                1,
              ],
            },
          ],
        },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return paymentData;
};


const getTopSellingBooks = async (limit = 10) => {
  const topBooks = await Order.aggregate([
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.productId',
        totalSold: { $sum: '$products.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'book',
      },
    },
    { $unwind: '$book' },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        title: '$book.title',
        author: '$book.author',
        category: '$book.category',
        price: '$book.price',
        image: { $arrayElemAt: ['$book.images', 0] },
        currentStock: '$book.quantity',
        totalSold: 1,
        totalRevenue: {
          $round: [{ $multiply: ['$totalSold', '$book.price'] }, 2],
        },
      },
    },
  ]);

  return topBooks;
};


const getRecentOrders = async (limit = 10) => {
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .lean();

  const formattedOrders = recentOrders.map((order) => {
    const user = order.userId as unknown as {
      name?: string;
      email?: string;
    } | null;
    const totalItems =
      order.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0;

    return {
      orderId: order._id,
      transactionId: order.transactionId || 'N/A',
      customerName:
        user?.name || order.shippingAddressDetails?.name || 'Customer',
      customerEmail: user?.email || 'N/A',
      city: order.shippingAddressDetails?.city || 'N/A',
      totalItems,
      totalAmount: order.totalAmount || 0,
      paymentMethod: order.paymentMethod || 'SSLCommerz',
      paymentStatus: order.paymentStatus || 'pending',
      orderStatus: order.status || 'pending',
      createdAt: (order as any).createdAt || order.orderDate,
    };
  });

  return formattedOrders;
};

const getInventoryAlerts = async (threshold = 10) => {
  const lowStockProducts = await Product.find({
    isDeleted: false,
    quantity: { $lte: threshold },
  })
    .select('title author category price quantity images')
    .sort({ quantity: 1 })
    .limit(10)
    .lean();

  const formattedAlerts = lowStockProducts.map((product) => ({
    productId: product._id,
    title: product.title,
    author: product.author,
    category: product.category,
    price: product.price,
    currentStock: product.quantity,
    image: product.images?.[0] || null,
    stockStatus: product.quantity === 0 ? 'Out of Stock' : 'Low Stock',
  }));

  return formattedAlerts;
};

const getDashboardOverview = async () => {
  const [
    stats,
    orderStatusDistribution,
    salesByCategory,
    monthlySalesTrend,
    paymentStatusDistribution,
    topSellingBooks,
    recentOrders,
    inventoryAlerts,
  ] = await Promise.all([
    getStats(),
    getOrderStatusDistribution(),
    getSalesByCategory(),
    getMonthlySalesTrend(),
    getPaymentStatusDistribution(),
    getTopSellingBooks(5),
    getRecentOrders(5),
    getInventoryAlerts(5),
  ]);

  return {
    stats,
    charts: {
      orderStatusDistribution,
      salesByCategory,
      monthlySalesTrend,
      paymentStatusDistribution,
    },
    tables: {
      topSellingBooks,
      recentOrders,
      inventoryAlerts,
    },
  };
};

export const AnalyticsServices = {
  getStats,
  getOrderStatusDistribution,
  getSalesByCategory,
  getMonthlySalesTrend,
  getPaymentStatusDistribution,
  getTopSellingBooks,
  getRecentOrders,
  getInventoryAlerts,
  getDashboardOverview,
};
