# CRM Backend API

A Node.js REST API for Customer Relationship Management with Google OAuth 2.0 authentication.

## Features

- 🔐 **Google OAuth 2.0 Authentication**
- 👥 **Customer Management** - CRUD operations for customers
- 📦 **Order Management** - Track customer orders
- 🎯 **Customer Segmentation** - Create and manage customer segments
- 📧 **Marketing Campaigns** - Campaign management and tracking
- 📊 **Communication Logs** - Track customer interactions
- 📖 **API Documentation** - Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with Google OAuth 2.0
- **Validation**: Zod
- **Documentation**: Swagger UI
- **Development**: Nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google OAuth 2.0 credentials

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yuvinraja/crm-backend.git
   cd crm-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   SESSION_SECRET=your_secure_session_secret
   ```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The API will be available at `http://localhost:3000`

## Authentication

All API endpoints (except health check and auth routes) require authentication via Google OAuth 2.0.

### OAuth Flow

1. Visit `/auth/google` to initiate login
2. Complete Google OAuth flow
3. Use session cookie for subsequent API calls
4. Logout via `/auth/logout`

## API Endpoints

### Auth Routes

- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/status` - Check authentication status
- `GET /auth/profile` - Get user profile (requires auth)
- `POST /auth/logout` - Logout user

### Customers

- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Orders

- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order by ID

### Segments

- `GET /segments` - Get all segments
- `POST /segments` - Create new segment
- `GET /segments/:id` - Get segment by ID
- `PUT /segments/:id` - Update segment
- `DELETE /segments/:id` - Delete segment

### Campaigns

- `GET /campaigns` - Get all campaigns
- `POST /campaigns` - Create new campaign
- `GET /campaigns/:id` - Get campaign by ID
- `PUT /campaigns/:id` - Update campaign
- `DELETE /campaigns/:id` - Delete campaign

## Documentation

Access the interactive API documentation at:

```url
http://localhost:3000/api-docs
```

## Testing API Protection

Run the included test script to verify authentication:

```bash
node test-api-protection.js
```

## Project Structure

```text
├── bin/
│   └── www                 # Server startup script
├── config/
│   ├── passport.js         # Passport OAuth configuration
│   └── swagger.js          # Swagger documentation config
├── middlewares/
│   ├── auth.js            # Authentication middleware
│   └── validate.js        # Request validation middleware
├── models/
│   ├── User.js            # User model
│   ├── Customer.js        # Customer model
│   ├── Order.js           # Order model
│   ├── Segment.js         # Segment model
│   ├── Campaign.js        # Campaign model
│   └── CommunicationLog.js # Communication log model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── customers.js       # Customer routes
│   ├── orders.js          # Order routes
│   ├── segments.js        # Segment routes
│   ├── campaigns.js       # Campaign routes
│   └── logs.js            # Communication log routes
├── utils/
│   └── db.js              # Database connection
├── validators/
│   └── *.js               # Request validation schemas
├── app.js                 # Express app configuration
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
