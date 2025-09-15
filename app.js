require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const connectDB = require('./utils/db');
const indexRouter = require('./routes/index');

const app = express();

// DB connection
connectDB();

// Trust reverse proxy (Render/other PaaS) for secure cookies & rate limits
app.set('trust proxy', 1);

// Logging & parsing
app.use(logger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());

// Security headers
app.use(helmet());

// // CORS configuration
// // ALLOWED_ORIGINS can be a comma-separated list. If not set, defaults to '*'.
// const allowedOrigins = ('*')
//   .split(',')
//   .map((o) => o.trim())
//   .filter(Boolean);

const corsOptions = {
  // origin: allowedOrigins.includes('*')
  //   ? '*'
  //   : function (origin, callback) {
  //       if (!origin || allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error('Not allowed by CORS'));
  //       }
  //     },
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting (per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/auth', limiter); // tighten on auth endpoints
app.use('/api', limiter);

// Session configuration with Mongo store
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'insecure-default-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: 'native',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CRM Backend API Documentation',
  })
);

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});


// Routes
app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the CRM Backend API');
});

// Basic error handler (ensure no helmet header override)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err); // Could integrate a logger here
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
