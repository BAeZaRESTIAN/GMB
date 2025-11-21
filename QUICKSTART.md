# Quick Start Guide

Get the GMB Optimization Platform running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- OR Node.js 18+, PostgreSQL 15+, and Redis 7+

## Option 1: Docker Quick Start (Recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/BAeZaRESTIAN/GMB.git
cd GMB
```

### Step 2: Configure Environment
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys:
```env
JWT_SECRET=your_random_secret_here
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 3: Start Services
```bash
docker-compose up -d
```

### Step 4: Initialize Database
```bash
docker-compose exec postgres psql -U postgres -d gmb_platform -f /docker-entrypoint-initdb.d/001_initial_schema.sql
```

### Step 5: Access the Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Step 6: Create Your Account
1. Go to http://localhost:3000/register
2. Fill in your details
3. Add a business name to create a tenant
4. Start using the platform!

## Option 2: Manual Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
psql -U postgres -d gmb_platform -f migrations/001_initial_schema.sql
npm run dev
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

## First Steps After Setup

### 1. Register Your Account
- Create a new account with your email
- Provide a business name (this creates your tenant)

### 2. Connect Google Business Profile
- Click "Connect GMB Location" in the dashboard
- Authorize with your Google account
- Select your business location

### 3. Generate Your First Content
- Use the "Generate AI Content" button
- Fill in your business details
- Get AI-generated post content

### 4. Create a QR Code
- Click "Generate QR Code"
- Get a scannable code for review collection
- Share with your customers

### 5. Schedule a Post
- Click "Schedule Post"
- Write or generate content
- Set the publishing time
- Let the system auto-publish

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "tenantName": "My Coffee Shop"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Generate AI Content (requires token)
```bash
curl -X POST http://localhost:5000/api/ai/generate-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "businessName": "My Coffee Shop",
    "businessType": "Coffee Shop",
    "tone": "friendly",
    "keywords": ["coffee", "artisan", "local"]
  }'
```

## Common Issues

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

### Redis Connection Failed
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping
```

### Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la backend/.env

# Check if variables are set
docker-compose exec backend env | grep JWT_SECRET
```

## Configuration Quick Reference

### Required Environment Variables
```env
# Minimum required for testing
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_here
DB_HOST=localhost
DB_NAME=gmb_platform
DB_USER=postgres
DB_PASSWORD=postgres
```

### Optional for Full Features
```env
# Google Services
GEMINI_API_KEY=your_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# Payment Gateways
RAZORPAY_KEY_ID=your_key
STRIPE_SECRET_KEY=your_key
PAYPAL_CLIENT_ID=your_id
```

## Next Steps

After basic setup:

1. **Read the Documentation**
   - [README.md](README.md) - Overview
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design

2. **Configure External Services**
   - Set up Google Cloud Project
   - Enable GMB API
   - Configure payment gateways

3. **Customize Settings**
   - Adjust rate limits
   - Configure email notifications
   - Set up monitoring

4. **Deploy to Production**
   - Use production environment variables
   - Set up SSL certificates
   - Configure backups

## Getting Help

- Check the [FAQ](README.md#faq) section
- Review [API Documentation](API_DOCUMENTATION.md)
- Examine logs: `docker-compose logs -f`
- Check issues on GitHub

## Development Tips

### Hot Reload
Both frontend and backend have hot reload enabled:
- Backend: Uses nodemon
- Frontend: Uses Vite HMR

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d gmb_platform

# Run queries
\dt  # List tables
SELECT * FROM users LIMIT 5;
```

### Redis Access
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# View keys
KEYS *
GET your_key
```

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up error tracking
- [ ] Review security settings
- [ ] Test payment webhooks
- [ ] Configure email service
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up CI/CD pipeline
- [ ] Create disaster recovery plan

## Shutdown

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes (WARNING: deletes data):
```bash
docker-compose down -v
```

## Support

Need help? 
- Create an issue on GitHub
- Check the documentation
- Review the logs for errors

Happy optimizing! 🚀
