const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');
const {
  customerCreateSchema,
  customerUpdateSchema,
  customerIdSchema,
} = require('../validators/customerValidator');

// Mock data for now
let customers = [];
let orders = []; // Mock orders data
let nextId = 1;

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new customer with the provided information
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *               totalSpending:
 *                 type: number
 *                 description: Total amount spent by customer
 *               lastVisit:
 *                 type: string
 *                 format: date-time
 *                 description: Last visit date
 *           example:
 *             name: "John Doe"
 *             email: "john.doe@example.com"
 *             phone: "+1234567890"
 *             totalSpending: 150.50
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  isAuthenticated,
  validate({ body: customerCreateSchema }),
  (req, res) => {
    try {
      const customer = {
        id: nextId++,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      customers.push(customer);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     description: Retrieves a list of all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 count:
 *                   type: number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', isAuthenticated, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
      count: customers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     description: Retrieves a single customer by their ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  isAuthenticated,
  validate({ params: customerIdSchema }),
  (req, res) => {
    try {
      const customer = customers.find((c) => c.id === parseInt(req.params.id));

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      res.json({
        success: true,
        message: 'Customer retrieved successfully',
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer
 *     description: Updates an existing customer's information
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *               totalSpending:
 *                 type: number
 *                 description: Total amount spent by customer
 *               lastVisit:
 *                 type: string
 *                 format: date-time
 *                 description: Last visit date
 *           example:
 *             name: "John Doe Updated"
 *             email: "john.updated@example.com"
 *             phone: "+1234567890"
 *             totalSpending: 250.75
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  isAuthenticated,
  validate({
    params: customerIdSchema,
    body: customerUpdateSchema,
  }),
  (req, res) => {
    try {
      const customerIndex = customers.findIndex(
        (c) => c.id === parseInt(req.params.id)
      );

      if (customerIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      customers[customerIndex] = {
        ...customers[customerIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: customers[customerIndex],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update customer',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Deletes an existing customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  isAuthenticated,
  validate({ params: customerIdSchema }),
  (req, res) => {
    try {
      const customerIndex = customers.findIndex(
        (c) => c.id === parseInt(req.params.id)
      );

      if (customerIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      const deletedCustomer = customers.splice(customerIndex, 1)[0];

      res.json({
        success: true,
        message: 'Customer deleted successfully',
        data: deletedCustomer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete customer',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /customers/{id}/orders:
 *   get:
 *     summary: Get customer's orders
 *     description: Retrieves all orders for a specific customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 count:
 *                   type: number
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id/orders',
  isAuthenticated,
  validate({ params: customerIdSchema }),
  (req, res) => {
    try {
      const customerId = parseInt(req.params.id);

      // Check if customer exists
      const customer = customers.find((c) => c.id === customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      // Filter orders for this customer
      const customerOrders = orders.filter(
        (o) => o.customerId === customerId.toString()
      );

      res.json({
        success: true,
        message: 'Customer orders retrieved successfully',
        data: customerOrders,
        count: customerOrders.length,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer orders',
        error: error.message,
      });
    }
  }
);

module.exports = router;
