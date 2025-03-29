import { HttpError } from '../../errors/HttpError';
import { TProduct } from './product.interface';
import { Product } from './product.model';


const createProduct = async (payload: TProduct) => {
  const createdProduct = await Product.create(payload);

  return createdProduct;
};

const getAllProducts = async () => {
  const products = await Product.find();

  if (products.length === 0) {
    throw new HttpError(404, 'No product were found in the database');
  }

  return products;
};

const getProductsByCategory = async (category: string) => {
  const products = await Product.find({ category });
  if (products.length === 0) {
    throw new HttpError(
      404,
      'No product record were found this category in the database',
    );
  }
  return products;
};

const getProductsNoDefaultPagination = async () => {
  const products = await Product.find();

  if (products.length === 0) {
    throw new HttpError(404, 'No product were found in the database');
  }

  return products;
};

const getProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new HttpError(404, 'No product found with ID');
  }
  return product;
};

const updateProductById = async (id: string, payload: Partial<TProduct>) => {
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    throw new HttpError(404, 'No product found with ID');
  }

  return updatedProduct;
};

const deleteProductById = async (id: string) => {
  const deletedProduct = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
  if (!deletedProduct) {
    throw new HttpError(404, 'No product found with ID');
  }

  return deletedProduct;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsNoDefaultPagination,
  getProductById,
  updateProductById,
  deleteProductById,
};
