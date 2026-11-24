import { asyncHandler } from '../../utils/global/asyncHandler';

const paymentSuccessController = asyncHandler(async (req, res) => {
  res.redirect(`https://borno-bihar-frontend-umber.vercel.app/success`);
});

const paymentFailController = asyncHandler(async (req, res) => {
  res.redirect(`https://borno-bihar-frontend-umber.vercel.app/fail`);
});
const paymentCancelController = asyncHandler(async (req, res) => {
  res.redirect(`https://borno-bihar-frontend-umber.vercel.app/cancelled`);
});

export const PaymentControllers = {
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
};
