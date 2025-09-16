const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM Backend API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://crm-backend-1k8z.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            googleId: { type: 'string' },
            provider: { type: 'string', enum: ['google', 'local'] },
            avatar: { type: 'string' },
          },
        },
        Customer: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            totalSpending: { type: 'number' },
            lastVisit: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          required: ['customerId', 'orderAmount'],
          properties: {
            _id: { type: 'string' },
            customerId: { type: 'string' },
            orderAmount: { type: 'number' },
            orderDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Condition: {
          type: 'object',
          required: ['field', 'operator', 'value'],
          properties: {
            field: {
              type: 'string',
              enum: ['totalSpending', 'lastVisit', 'orderCount'],
            },
            operator: {
              type: 'string',
              enum: ['>', '<', '=', '>=', '<=', 'contains'],
            },
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
          },
        },
        Segment: {
          type: 'object',
          required: ['name', 'conditions'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            conditions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  operator: { type: 'string' },
                  value: {},
                },
              },
            },
            logic: { type: 'string', enum: ['AND', 'OR'] },
            audienceSize: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Campaign: {
          type: 'object',
          required: ['name', 'segmentId', 'message'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            segmentId: { type: 'string' },
            message: { type: 'string' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CommunicationLog: {
          type: 'object',
          required: ['customerId', 'campaignId'],
          properties: {
            _id: { type: 'string' },
            customerId: { type: 'string' },
            campaignId: { type: 'string' },
            deliveryStatus: {
              type: 'string',
              enum: ['PENDING', 'SENT', 'FAILED'],
            },
            vendorResponse: {
              type: 'object',
              properties: {
                messageId: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                errorMessage: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
