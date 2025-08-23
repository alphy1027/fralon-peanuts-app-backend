const ErrorResponse = require("../middleware/errorResponse");
const Order = require("../models/order");
const Client = require("../models/client");
const notificationService = require("./notificationService");
const mongoose = require("mongoose");
const clientService = require("./clientService");
const Product = require("../models/product");

class OrderService {
  constructor(orderModel) {
    this.Order = orderModel;
  }

  async createOrder(orderDetails) {
    const session = await mongoose.startSession();
    let newOrder;
    try {
      await session.withTransaction(async () => {
        const productIds = orderDetails.items.map((item) => item.product);
        const products = await Product.find({
          _id: {
            $in: productIds,
          },
        }).session(session);
        const orderItems = orderDetails.items.map((item) => {
          const product = products.find((prod) => prod?._id?.toString() === item?.product?.toString());
          let productPrice;
          if (!product) throw new ErrorResponse("Product not found", 404);
          if (item.priceType === "retail" || !item.priceType) {
            if (item.price !== product.unitPrice) {
              throw new ErrorResponse(
                `Price mismatch for ${item.product}, Expected ${product.unitPrice} but got ${item.price}`,
                400
              );
            }
            productPrice = product.unitPrice;
          } else {
            if (item.price !== product.wholesaleUnitPrice) {
              throw new ErrorResponse(
                `Price mismatch for ${item.product}, Expected ${product.wholesaleUnitPrice} but got ${item.price}`,
                400
              );
            }
            productPrice = product.wholesaleUnitPrice;
          }
          const productSubTotal = productPrice * item.quantity;

          if (item.subTotal !== productSubTotal) {
            throw new ErrorResponse(
              `Subtotal mismatch for ${item.product}, Expected ${productSubTotal} but got ${item.subTotal}`,
              400
            );
          }

          return {
            product: product._id,
            quantity: item.quantity,
            price: productPrice,
            subTotal: productSubTotal,
            priceType: item.priceType || "retail",
          };
        });

        const grandTotal = orderItems.reduce((acc, item) => acc + item.subTotal, 0);
        console.log("ORDER ITEMS ::", orderItems);

        console.log("Order service Products ::", products);
        const order = await this.Order.create(
          [
            {
              client: orderDetails.clientId,
              items: orderItems,
              deliveryMethod: orderDetails.deliveryMethod,
              address: orderDetails.address,
              totalPrice: grandTotal,
              paymentMethod: orderDetails.paymentMethod,
              notes: orderDetails.notes,
            },
          ],
          { session }
        );

        newOrder = order[0];
        await newOrder.populate({ path: "items.product", options: { session } });
        if (!newOrder) throw new ErrorResponse("Failed to create order", 400);
        const clientOrders = await this.addOrderToClient(newOrder.client, newOrder._id, session);
        if (!clientOrders) throw new ErrorResponse("Failed to add order to client document", 400);
        await notificationService.sendOrderNotification(newOrder.client, newOrder._id, session);
      });
      console.log("Transaction State : ", session.transaction.state);
      return newOrder;
    } catch (err) {
      throw new ErrorResponse(err.message, 500);
    } finally {
      session.endSession();
    }
  }

  async getOrdersByClient(clientId) {
    return await clientService.getClientOrders(clientId);
  }

  async getOrderById(orderId) {
    return await this.Order.findById(orderId).populate({ path: "client", select: "username email" }).exec();
  }

  async getAllOrders(query) {
    const { match, type, sort, order = -1, page = 0, limit, period = "month", value = 1 } = query;
    const currentPage = parseInt(page);
    const ordersPerPage = parseInt(limit) || 5;
    const now = new Date();
    let startDate;

    switch (period) {
      case "day":
        startDate = new Date(now.setDate(now.getDate() - value));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - value));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - value));
        break;
      default:
        throw new ErrorResponse("Invalid period, Use days, month or years", 400);
    }

    let pipeline = [];

    if (match) {
      pipeline.push({ $match: { [match]: { $gte: startDate } } });
    }

    if (sort) {
      pipeline.push({ $sort: { [sort]: parseInt(order) } });
    }
    if (limit) {
      pipeline.push({ $limit: ordersPerPage });
    }

    if (type) {
      switch (type) {
        case "topCustomers":
          pipeline = [
            ...pipeline,
            {
              $group: {
                _id: "$client",
                totalOrderCount: { $sum: 1 },
                totalOrdersAmt: { $sum: "$totalPrice" },
                averageOrderCost: { $avg: "$totalPrice" },
              },
            },
            {
              $sort: { totalOrdersAmt: -1 },
            },
            {
              $limit: ordersPerPage,
            },
          ];
          break;
        case "totalOrders":
          pipeline.push(
            {
              $match: {
                createdAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalOrdersCost: { $sum: "$totalPrice" },
                averageCostPerOrder: { $avg: "$totalPrice" },
              },
            },
            {
              $project: {
                _id: 1,
                totalOrders: 1,
                totalOrdersCost: 1,
                averageCostPerOrder: 1,
                duration: `${value} ${period}${value > 1 ? "s" : ""}`,
              },
            }
          );
          break;
        case "pendingOrders":
          pipeline.push(
            {
              $match: { status: "pending" },
            },
            {
              $group: {
                _id: null,
                pendingOrderCount: { $sum: 1 },
                totalPendingOrdersAmt: { $sum: "$totalPrice" },
                averagePendingAmt: { $avg: "$totalPrice" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            }
          );
          break;
        case "topSellingProducts":
          pipeline = [
            ...pipeline,
            { $unwind: { path: "$items" } },
            {
              $group: {
                _id: "$items.product",
                productCount: { $sum: 1 },
                averageCost: { $avg: "$totalPrice" },
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo",
                pipeline: [
                  {
                    $project: {
                      productName: 1,
                      packageSize: 1,
                      unitPrice: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                productInfo: { $arrayElemAt: ["$productInfo", 0] },
              },
            },
            { $sort: { productCount: -1 } },
            { $limit: 100 },
          ];
          break;
        default:
          throw new ErrorResponse("Invalid type", 400);
      }
    }

    if (pipeline.length === 0) {
      pipeline.push({ $match: {} });
    }

    const result = await this.Order.aggregate(pipeline);
    return result.length > 1 ? result : result[0];
  }

  async updateOrder(orderId, orderDetails) {
    if (orderDetails.status) {
      throw new ErrorResponse("Status can not be updated", 400);
    }
    return await this.Order.findByIdAndUpdate(
      orderId,
      { $set: { ...orderDetails } },
      { new: true, runValidators: true }
    ).exec();
  }

  async updateOrderStatus(orderId, orderStatus) {
    if (orderStatus !== "completed" && orderStatus !== "pending") {
      throw new ErrorResponse("Invalid Order status", 400);
    }
    const order = await this.Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse("No order matches the ID", 404);
    }
    if (order.status === orderStatus) {
      throw new ErrorResponse("Order status is already " + orderStatus, 400);
    }
    order.status = orderStatus;
    await order.save();
    return order.status;
  }

  async cancelOrder(orderId, clientId) {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new ErrorResponse("No order matches the ID", 404);
    }
    if (order.client._id.toString() !== clientId.toString()) {
      throw new ErrorResponse("You are not authorized to cancel this order", 403);
    }
    if (order.status === "cancelled") {
      throw new ErrorResponse("Order has already been cancelled", 409);
    }
    if (order.status === "completed") {
      throw new ErrorResponse("Order already completed, cannot cancel order at this point", 501);
    }
    order.status = "cancelled";
    await order.save();
    return order;
  }

  async addOrderToClient(clientId, orderId, session = null) {
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { orders: orderId } },
      session ? { new: true, session } : { new: true }
    ).exec();
    if (!client) {
      throw new ErrorResponse("No client matches the ID", 404);
    }
    return client;
  }

  async getRevenueTrends(query) {
    const { period = "monthly", value = 1 } = query;
    const now = new Date();
    let startDate;

    switch (period) {
      case "daily":
        startDate = new Date(now.setDate(now.getDate() - value));
        break;
      case "monthly":
        startDate = new Date(now.setMonth(now.getMonth() - value));
        break;
      case "yearly":
        startDate = new Date(now.setFullYear(now.getFullYear() - value));
        break;
      default:
        throw new ErrorResponse("Invalid period, Use days, month or years", 400);
    }

    let groupBy;
    switch (period) {
      case "daily":
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case "monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        break;
      case "yearly":
        groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
        break;
      default:
        throw new ErrorResponse("Invalid period, Use daily, monthly or yearly", 400);
    }
    const result = await this.Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupBy,
          ordersCount: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
          averageOrderRevenue: { $avg: "$totalPrice" },
        },
      },
      {
        $addFields: {
          period: `${period} revenue report`,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return result;
    /* result.length > 1 ? result : result[0] */
  }
}

module.exports = new OrderService(Order);
