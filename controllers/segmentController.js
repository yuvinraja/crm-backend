const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

const segmentController = {
  // Helper function to build MongoDB query from segment conditions
  buildSegmentQuery(conditions, logic) {
    const queries = conditions.map((condition) => {
      const { field, operator, value } = condition;
      let query = {};

      switch (operator) {
        case '>':
          query[field] = { $gt: value };
          break;
        case '<':
          query[field] = { $lt: value };
          break;
        case '>=':
          query[field] = { $gte: value };
          break;
        case '<=':
          query[field] = { $lte: value };
          break;
        case '=':
          query[field] = value;
          break;
        case '!=':
          query[field] = { $ne: value };
          break;
      }

      return query;
    });

    return logic === 'OR' ? { $or: queries } : { $and: queries };
  },

  // Create segment
  async createSegment(req, res) {
    try {
      const segmentData = {
        ...req.body,
        createdBy: req.user._id,
      };

      // Calculate audience size
      const query = segmentController.buildSegmentQuery(
        req.body.conditions,
        req.body.logic
      );
      const audienceSize = await Customer.countDocuments(query);
      segmentData.audienceSize = audienceSize;

      const segment = await Segment.create(segmentData);

      res.status(201).json({
        success: true,
        message: 'Segment created successfully',
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create segment',
        error: error.message,
      });
    }
  },

  // Get all segments for user
  async getAllSegments(req, res) {
    try {
      const segments = await Segment.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: segments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch segments',
        error: error.message,
      });
    }
  },

  // Get segment by ID
  async getSegmentById(req, res) {
    try {
      const segment = await Segment.findById(req.params.id).populate(
        'createdBy',
        'name email'
      );

      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch segment',
        error: error.message,
      });
    }
  },

  // Update segment
  async updateSegment(req, res) {
    try {
      // Recalculate audience size if conditions changed
      if (req.body.conditions || req.body.logic) {
        const segment = await Segment.findById(req.params.id);
        if (!segment) {
          return res.status(404).json({
            success: false,
            message: 'Segment not found',
          });
        }

        const conditions = req.body.conditions || segment.conditions;
        const logic = req.body.logic || segment.logic;
        const query = segmentController.buildSegmentQuery(conditions, logic);
        req.body.audienceSize = await Customer.countDocuments(query);
      }

      const segment = await Segment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('createdBy', 'name email');

      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        message: 'Segment updated successfully',
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update segment',
        error: error.message,
      });
    }
  },

  // Delete segment
  async deleteSegment(req, res) {
    try {
      const segment = await Segment.findByIdAndDelete(req.params.id);
      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        message: 'Segment deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete segment',
        error: error.message,
      });
    }
  },

  // Preview segment audience
  async previewSegment(req, res) {
    try {
      const { conditions, logic } = req.body;
      const query = segmentController.buildSegmentQuery(conditions, logic);

      const audienceSize = await Customer.countDocuments(query);
      const sampleCustomers = await Customer.find(query)
        .limit(10)
        .select('name email totalSpending lastVisit');

      res.json({
        success: true,
        data: {
          audienceSize,
          sampleCustomers,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to preview segment',
        error: error.message,
      });
    }
  },

  // Get segment customers
  async getSegmentCustomers(req, res) {
    try {
      const segment = await Segment.findById(req.params.id);
      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      const query = segmentController.buildSegmentQuery(
        segment.conditions,
        segment.logic
      );
      const customers = await Customer.find(query);

      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch segment customers',
        error: error.message,
      });
    }
  },
};

module.exports = segmentController;
