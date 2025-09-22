# CRM Backend API

**A comprehensive Customer Relationship Management backend built with Node.js, featuring advanced customer segmentation and marketing automation.**

## Key Features

### Enterprise Authentication

- Google OAuth 2.0 integration with Passport.js
- Secure session management with MongoDB store
- Production-ready security with Helmet & CORS

### Customer Management

- Complete CRUD operations with search & pagination
- Customer analytics (total spending, visit tracking)
- Automated data validation with Zod schemas

### Advanced Segmentation

- Dynamic customer segmentation with configurable conditions
- Support for complex queries (>, <, >=, <=, =, !=)
- Boolean logic (AND/OR) for multi-criteria segments
- Real-time audience size calculation

### Marketing Automation

- Campaign creation with automated delivery simulation
- Communication logging with delivery status tracking
- Campaign analytics (sent, failed, audience metrics)
- Webhook simulation for vendor API integration

### Order Management

- Order tracking with customer relationship linking
- Automatic spending calculations and analytics

## Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 20.x |
| **Framework** | Express.js 4.x |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | Passport.js + Google OAuth 2.0 |
| **Validation** | Zod Schema Validation |
| **Security** | Helmet, CORS, Rate Limiting |
| **Documentation** | Swagger/OpenAPI 3.0 |
| **Deployment** | Render.com |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yuvinraja/crm-backend.git
cd crm-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env with your MongoDB URI and Google OAuth credentials

# Start development server
npm run dev
```

**The API will be available at `http://localhost:3000`**

## Core API Endpoints

### Authentication

- `GET /auth/google` - Google OAuth login
- `GET /auth/status` - Check auth status
- `POST /auth/logout` - Logout

### Business Logic

- `GET|POST /customers` - Customer management
- `GET|POST /orders` - Order tracking
- `GET|POST /segments` - Customer segmentation
- `GET|POST /campaigns` - Marketing campaigns
- `GET /communications` - Delivery logs

## Documentation

**Interactive API Documentation**: [/api-docs](http://localhost:3000/api-docs) (Swagger UI)

## Project Architecture

```
├── models/          # MongoDB schemas (User, Customer, Order, Segment, Campaign)
├── controllers/     # Business logic and API handlers  
├── routes/          # Express route definitions
├── middlewares/     # Auth & validation middleware
├── validators/      # Zod schema validation
├── config/          # Passport & Swagger configuration
└── utils/           # Database connection utilities
```

## Environment Setup

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✅ |
| `SESSION_SECRET` | Session encryption key | ✅ |

## Key Technical Highlights

- **Scalable Architecture**: Modular design with clear separation of concerns
- **Production Security**: Rate limiting, CORS, Helmet security headers
- **Data Integrity**: Comprehensive validation with Zod schemas
- **Real-time Analytics**: Dynamic audience calculations for segments
- **API-First Design**: Comprehensive Swagger documentation
- **Cloud Ready**: Deployed on Render.com with MongoDB Atlas
