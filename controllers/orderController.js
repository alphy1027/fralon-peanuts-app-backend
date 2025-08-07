const orderService = require("../services/orderService");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/errorResponse");
const successResponse = require("../middleware/successResponse");
const validateId = require("../utils/validateId");
const orderRequestSchema = require("../schemas/orderSchema");

const getAllOrders_get = asyncHandler(async (req, res, next) => {
  const orders = await orderService.getAllOrders(req.query);
  if (orders?.length === 0 || !orders) return next(new ErrorResponse("No orders found", 404));
  return successResponse(res, "Orders successfully retrieved", { orders });
});

const getUserOrders_get = asyncHandler(async (req, res, next) => {
  const clientId = req.user.userId;
  console.log("User ID ::", clientId);
  validateId(clientId, next);
  const userOrders = await orderService.getOrdersByClient(clientId);
  if (!userOrders) return next(new ErrorResponse("Could not find orders for this user"));
  return successResponse(res, "User Orders successfully retrieved", { userOrders });
});

const getRevenueTrends_get = asyncHandler(async (req, res, next) => {
  const revenueTrends = await orderService.getRevenueTrends(req.query);
  if (!revenueTrends) return next(new ErrorResponse("Could not find the specified revenue trends", 404));
  return successResponse(res, "Revenue trends successfully retrieved", { revenueTrends });
});

const getSingleOrder_get = asyncHandler(async (req, res, next) => {
  const orderId = req.params.orderId;
  const { user } = req;
  validateId(orderId, next);
  const order = await orderService.getOrderById(orderId);
  if (!order) return next(new ErrorResponse("Order not found", 404));
  if (!user.role.includes("admin") && user.userId.toString() !== order.client._id.toString()) {
    return next(new ErrorResponse("You are not authorized to view this order", 403));
  }
  return successResponse(res, "Order retrieved successfully", { order });
});

const updateOrderStatus_patch = asyncHandler(async (req, res, next) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  const updatedOrder = await orderService.updateOrderStatus(orderId, status);
  if (!updatedOrder) return next(new ErrorResponse("Order status could not be updated", 404));
  return successResponse(res, "Order status updated successfully", { updatedOrder });
});

const updateSingleOrder_put = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  validateId(orderId, next);
  const updatedOrder = await orderService.updateOrder(orderId, req.body);
  if (!updatedOrder) return next(new ErrorResponse("Order not found", 404));
  return successResponse(res, "Order updated successfully", { updatedOrder });
});

const placeOrder_post = asyncHandler(async (req, res, next) => {
  const clientId = req.user.userId;
  validateId(clientId, next);
  const result = orderRequestSchema.safeParse(req.body);
  console.log(req.body);
  if (!result.success) {
    return next(new ErrorResponse(`Validation Error :: ${result.error.issues[0].message}`, 400));
  }
  const validatedOrder = result.data;
  const newOrder = await orderService.createOrder({ ...validatedOrder, clientId });
  console.log("newOrder:", newOrder);
  if (!newOrder) return next(new ErrorResponse("New order not found", 404));
  return successResponse(res, "Order successfully created", { newOrder }, 201);
});

const cancelOrder_patch = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const clientId = req.user.userId;
  validateId(orderId, next);
  const cancelledOrder = await orderService.cancelOrder(orderId, clientId);
  if (!cancelledOrder) return next(new ErrorResponse("No order matches that ID", 404));
  return successResponse(res, "Order cancelled successfully", { cancelledOrder });
});

module.exports = {
  placeOrder_post,
  getAllOrders_get,
  getSingleOrder_get,
  updateSingleOrder_put,
  cancelOrder_patch,
  getRevenueTrends_get,
  updateOrderStatus_patch,
  getUserOrders_get,
};
