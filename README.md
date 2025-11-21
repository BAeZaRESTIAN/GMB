# GMB Optimization Platform
**LocalAI – Automated Google Business Profile Optimization Platform**

A comprehensive, full-stack, multi-tenant SaaS platform that automates Google Business Profile (GMB) optimization using AI.

## 🚀 Features

### Core Features
- **Multi-Tenant Architecture**: Isolated data and settings per tenant
- **Authentication & Authorization**: JWT-based auth with role management (Admin, Tenant Admin, User)
- **Google Business Profile Integration**: Full GMB API integration with OAuth2
- **AI Content Generation**: Powered by Google Gemini Pro
  - Post content generation
  - Business description optimization
  - Automated review responses
  - Blog post creation
- **Payment Gateways**: 
  - Razorpay
  - Stripe
  - PayPal
- **Review Management**: Automated review collection and response
- **QR Code Generator**: Generate review collection QR codes
- **Scheduled Posts**: Automated post scheduling and publishing
- **Geo-Rank Tracking**: Monitor local search rankings
- **Competitor Analysis**: Track and analyze competitors
- **Blogger Integration**: Automated blog content publishing

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **AI**: Google Gemini Pro
- **Cloud**: Google Cloud Platform

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Type Safety**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional)
- Google Cloud Project with GMB API enabled
- Gemini API key
- Payment gateway accounts (Razorpay, Stripe, PayPal)

## 🔧 Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/BAeZaRESTIAN/GMB.git
cd GMB
```

2. Configure environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

3. Start services:
```bash
docker-compose up -d
```

4. Initialize database:
```bash
docker-compose exec postgres psql -U postgres -d gmb_platform -f /docker-entrypoint-initdb.d/001_initial_schema.sql
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

### Manual Installation

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Run database migrations:
```bash
psql -U postgres -d gmb_platform -f migrations/001_initial_schema.sql
```

5. Start development server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. Start development server:
```bash
npm run dev
```

## 🔐 Configuration

### Required Environment Variables

#### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gmb_platform
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Google Cloud
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### GMB Endpoints
- `GET /api/gmb/auth-url` - Get OAuth URL
- `GET /api/gmb/callback` - OAuth callback
- `GET /api/gmb/locations` - List locations
- `GET /api/gmb/locations/:id` - Get location details
- `PUT /api/gmb/locations/:id` - Update location

### AI Content Endpoints
- `POST /api/ai/generate-post` - Generate post content
- `POST /api/ai/generate-description` - Generate business description
- `POST /api/ai/generate-review-response` - Generate review response
- `POST /api/ai/generate-blog-post` - Generate blog post
- `POST /api/ai/analyze-seo` - Analyze SEO

### Payment Endpoints
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/stripe/create-payment-intent` - Create Stripe payment
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `GET /api/payments/transactions` - Get transaction history

## 🗄️ Database Schema

The platform uses PostgreSQL with the following main tables:
- `tenants` - Multi-tenant isolation
- `users` - User accounts with RBAC
- `subscription_plans` - Subscription tiers
- `subscriptions` - Active subscriptions
- `payment_transactions` - Payment history
- `gmb_locations` - Connected GMB locations
- `posts` - Scheduled and published posts
- `reviews` - Customer reviews
- `qr_codes` - Generated QR codes
- `competitors` - Competitor tracking
- `geo_rankings` - Ranking data
- `blogger_posts` - Blog content
- `audit_logs` - Activity logging

## 🔄 Scheduled Jobs

The platform includes automated cron jobs:
- **Every minute**: Process scheduled posts
- **Every hour**: Process scheduled blog posts
- **Daily (2 AM)**: Sync reviews from GMB

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Multi-tenant data isolation
- SQL injection prevention
- CORS protection
- Environment variable encryption

## 📦 Deployment

### Production Build

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

### Environment Variables for Production
Ensure all environment variables are properly configured for production with:
- Strong JWT secrets
- Production database credentials
- Production API keys
- HTTPS URLs

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## 📈 Monitoring

The platform includes:
- Winston logging for all operations
- Audit logs for user actions
- Error tracking and reporting
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced AI insights
- [ ] White-label solutions
- [ ] API rate limiting tiers
- [ ] Advanced reporting
- [ ] Integration marketplace

## 🙏 Acknowledgments

- Google Cloud Platform
- Google Gemini Pro AI
- Stripe, Razorpay, and PayPal
- Open source community
