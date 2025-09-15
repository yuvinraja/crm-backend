const Customer = require('../models/Customer');
const Order = require('../models/Order');
const mongoose = require('mongoose');

const customerController = {
  // Create customer
  async createCustomer(req, res) {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Customer with this email already exists',
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message,
      });
    }
  },

  // Get all customers
  async getAllCustomers(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const skip = (page - 1) * limit;

      const searchFilter = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const customers = await Customer.find(searchFilter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Customer.countDocuments(searchFilter);

      res.json({
        success: true,
        data: customers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + customers.length < total,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customers',
        error: error.message,
      });
    }
  },

  // Get customer by ID
  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      // Get customer's order history
      const orders = await Order.find({ customerId: customer._id }).sort({
        orderDate: -1,
      });

      res.json({
        success: true,
        data: {
          ...customer.toObject(),
          orders,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer',
        error: error.message,
      });
    }
  },

  // Update customer
  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message,
      });
    }
  },

  // Delete customer
  async deleteCustomer(req, res) {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      // Delete related orders
      await Order.deleteMany({ customerId: req.params.id });

      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message,
      });
    }
  },

  // Bulk create customers
  async bulkCreateCustomers(req, res) {
    try {
      const { customers } = req.body;
      if (!Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customers data',
        });
      }

      const results = await Customer.insertMany(customers, { ordered: false });
      res.status(201).json({
        success: true,
        message: `${results.length} customers created successfully`,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create customers',
        error: error.message,
      });
    }
  },
};

module.exports = customerController;
