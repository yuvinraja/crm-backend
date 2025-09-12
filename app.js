var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const connectDB = require('./utils/db');

var indexRouter = require('./routes/index');
var customersRouter = require('./routes/customers');
var ordersRouter = require('./routes/orders');
var segmentsRouter = require('./routes/segments');
var campaignsRouter = require('./routes/campaigns');
var logsRouter = require('./routes/logs');

var app = express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CRM Backend API Documentation',
  })
);

app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/segments', segmentsRouter);
app.use('/campaigns', campaignsRouter);
app.use('/logs', logsRouter);

module.exports = app;
