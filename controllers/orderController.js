const Order = require('../models/Order');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

const orderController = {
  // Create order
  async createOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.create([req.body], { session });

      // Update customer's total spending and last visit
      await Customer.findByIdAndUpdate(
        req.body.customerId,
        {
          $inc: { totalSpending: req.body.orderAmount },
          lastVisit: new Date(),
        },
        { session }
      );

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order[0],
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message,
      });
    } finally {
      session.endSession();
    }
  },

  // Get all orders
  async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const orders = await Order.find()
        .populate('customerId', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ orderDate: -1 });

      const total = await Order.countDocuments();

      res.json({
        success: true,
        data: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + orders.length < total,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      });
    }
  },

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate(
        'customerId',
        'name email'
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error.message,
      });
    }
  },

  // Update order
  async updateOrder(req, res) {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('customerId', 'name email');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update order',
        error: error.message,
      });
    }
  },

  // Delete order
  async deleteOrder(req, res) {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete order',
        error: error.message,
      });
    }
  },

  // Get orders by customer
  async getOrdersByCustomer(req, res) {
    try {
      const orders = await Order.find({
        customerId: req.params.customerId,
      }).sort({ orderDate: -1 });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer orders',
        error: error.message,
      });
    }
  },

  // Bulk create orders
  async bulkCreateOrders(req, res) {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid orders data',
        });
      }

      const results = await Order.insertMany(orders, { ordered: false });

      // Update customer spending for each order
      const customerUpdates = {};
      orders.forEach((order) => {
        if (customerUpdates[order.customerId]) {
          customerUpdates[order.customerId] += order.orderAmount;
        } else {
          customerUpdates[order.customerId] = order.orderAmount;
        }
      });

      const updatePromises = Object.entries(customerUpdates).map(
        ([customerId, amount]) =>
          Customer.findByIdAndUpdate(customerId, {
            $inc: { totalSpending: amount },
            lastVisit: new Date(),
          })
      );

      await Promise.all(updatePromises);

      res.status(201).json({
        success: true,
        message: `${results.length} orders created successfully`,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create orders',
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
