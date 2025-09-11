var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/segments', segmentsRouter);
app.use('/campaigns', campaignsRouter);
app.use('/logs', logsRouter);

module.exports = app;
