const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { customerValidator } = require('../validators');

// Apply authentication to all routes
router.use(ensureAuth);

// @desc    Create customer
// @route   POST /api/customers
router.post(
  '/',
  validate({ body: customerValidator.customerCreateSchema }),
  customerController.createCustomer
);

// @desc    Get all customers
// @route   GET /api/customers
router.get('/', customerController.getAllCustomers);

// @desc    Get customer by ID
// @route   GET /api/customers/:id
router.get(
  '/:id',
  validate({ params: customerValidator.customerIdSchema }),
  customerController.getCustomerById
);

// @desc    Update customer
// @route   PUT /api/customers/:id
router.put(
  '/:id',
  validate({
    params: customerValidator.customerIdSchema,
    body: customerValidator.customerUpdateSchema,
  }),
  customerController.updateCustomer
);

// @desc    Delete customer
// @route   DELETE /api/customers/:id
router.delete(
  '/:id',
  validate({ params: customerValidator.customerIdSchema }),
  customerController.deleteCustomer
);

// @desc    Bulk create customers
// @route   POST /api/customers/bulk
router.post('/bulk', customerController.bulkCreateCustomers);

module.exports = router;
