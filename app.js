require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const connectDB = require('./utils/db');

var indexRouter = require('./routes/index');
var customersRouter = require('./routes/customers');
var ordersRouter = require('./routes/orders');
var segmentsRouter = require('./routes/segments');
var campaignsRouter = require('./routes/campaigns');
var logsRouter = require('./routes/logs');
var authRouter = require('./routes/auth');

var app = express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/segments', segmentsRouter);
app.use('/campaigns', campaignsRouter);
app.use('/logs', logsRouter);

module.exports = app;
