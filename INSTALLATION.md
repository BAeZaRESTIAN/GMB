# GMB Platform - Installation Guide

## Quick Start with Docker

The fastest way to get started is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/BAeZaRESTIAN/GMB.git
cd GMB

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys and credentials

# 3. Start all services
docker-compose up -d

# 4. Initialize the database
docker-compose exec postgres psql -U postgres -d gmb_platform -f /docker-entrypoint-initdb.d/001_initial_schema.sql

# 5. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Manual Installation

### Prerequisites

Install the following on your system:
- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher

### Step 1: Database Setup

```bash
# Create database
createdb gmb_platform

# Run migrations
psql -U postgres -d gmb_platform -f backend/migrations/001_initial_schema.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

## Configuration

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Business Profile API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:5000/api/gmb/callback (development)
   - https://yourdomain.com/api/gmb/callback (production)

### Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add the key to your `.env` file

### Payment Gateway Setup

#### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payments/webhooks/razorpay`

#### Stripe
1. Sign up at [Stripe](https://stripe.com/)
2. Get API keys from Dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payments/webhooks/stripe`

#### PayPal
1. Sign up at [PayPal Developer](https://developer.paypal.com/)
2. Create an app in Dashboard
3. Get Client ID and Secret

## Running in Production

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start dist/server.js --name gmb-backend

# Start frontend (if serving with node)
cd frontend
pm2 serve dist 3000 --name gmb-frontend
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -c "SELECT version();"
```

### Redis Connection Issues
```bash
# Check Redis is running
sudo systemctl status redis

# Test connection
redis-cli ping
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## Next Steps

After installation:
1. Create an account at http://localhost:3000/register
2. Connect your Google Business Profile
3. Configure your subscription plan
4. Start generating AI content!

For more information, see the main README.md
