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
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the customer',
            },
            name: {
              type: 'string',
              description: 'Customer name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email address',
            },
            phone: {
              type: 'string',
              description: 'Customer phone number',
            },
            totalSpending: {
              type: 'number',
              description: 'Total amount spent by customer',
            },
            lastVisit: {
              type: 'string',
              format: 'date-time',
              description: 'Last visit date',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Customer creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Customer last update date',
            },
          },
        },
        Order: {
          type: 'object',
          required: ['customerId', 'amount'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the order',
            },
            customerId: {
              type: 'string',
              description: 'ID of the customer who placed the order',
            },
            amount: {
              type: 'number',
              description: 'Order amount',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'cancelled'],
              description: 'Order status',
            },
            orderDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when order was placed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order last update date',
            },
          },
        },
        Segment: {
          type: 'object',
          required: ['name', 'criteria'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the segment',
            },
            name: {
              type: 'string',
              description: 'Segment name',
            },
            criteria: {
              type: 'object',
              description: 'Criteria for customer segmentation',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Segment creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Segment last update date',
            },
          },
        },
        Campaign: {
          type: 'object',
          required: ['name', 'message', 'segmentId'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the campaign',
            },
            name: {
              type: 'string',
              description: 'Campaign name',
            },
            message: {
              type: 'string',
              description: 'Campaign message content',
            },
            segmentId: {
              type: 'string',
              description: 'ID of the target segment',
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'completed', 'cancelled'],
              description: 'Campaign status',
            },
            sentCount: {
              type: 'number',
              description: 'Number of messages sent',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Campaign last update date',
            },
          },
        },
        CommunicationLog: {
          type: 'object',
          required: ['customerId', 'campaignId', 'message'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the communication log',
            },
            customerId: {
              type: 'string',
              description: 'ID of the customer',
            },
            campaignId: {
              type: 'string',
              description: 'ID of the campaign',
            },
            message: {
              type: 'string',
              description: 'Message content sent',
            },
            status: {
              type: 'string',
              enum: ['sent', 'delivered', 'failed'],
              description: 'Delivery status',
            },
            sentAt: {
              type: 'string',
              format: 'date-time',
              description: 'Time when message was sent',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Log creation date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            error: {
              type: 'string',
              description: 'Error details',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
