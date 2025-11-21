# Project Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  React 18 + TypeScript + TailwindCSS + Zustand              │
│  - Login/Register Pages                                      │
│  - Dashboard                                                 │
│  - API Client with Axios                                     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│           Node.js + Express + TypeScript                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Authentication Layer (JWT + RBAC)                  │   │
│  │  - User Registration/Login                          │   │
│  │  - Multi-tenant Isolation                           │   │
│  │  - Role-based Access Control                        │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Core Services                                      │   │
│  │  - GMB Service (Google Business Profile)           │   │
│  │  - AI Service (Gemini Pro)                          │   │
│  │  - Payment Service (Razorpay/Stripe/PayPal)        │   │
│  │  - QR Code Service                                  │   │
│  │  - Scheduler Service (Cron Jobs)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────┬───────────────────────────────┬───────────────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌──────────────────┐
│   PostgreSQL    │            │      Redis       │
│   Database      │            │      Cache       │
│  - Multi-tenant │            │  - Sessions      │
│  - Relational   │            │  - Queue Data    │
│    Data         │            │                  │
└─────────────────┘            └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│         External Services                        │
│  - Google Business Profile API                  │
│  - Google Gemini Pro AI                         │
│  - Razorpay Payment Gateway                     │
│  - Stripe Payment Gateway                       │
│  - PayPal Payment Gateway                       │
│  - Google Cloud Storage                         │
└─────────────────────────────────────────────────┘
```

## Technology Stack

### Backend Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Logging**: Winston
- **Scheduling**: node-cron
- **Testing**: Jest

### Frontend Technologies
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6

### AI & ML
- **AI Provider**: Google Gemini Pro
- **Use Cases**:
  - Post content generation
  - Business descriptions
  - Review response automation
  - Blog post creation
  - SEO analysis

### Payment Gateways
- **Razorpay**: Indian market
- **Stripe**: Global market
- **PayPal**: Alternative global option

## Database Schema

### Core Tables
1. **tenants** - Multi-tenant isolation
2. **users** - User accounts with RBAC
3. **subscription_plans** - Pricing tiers
4. **subscriptions** - Active subscriptions
5. **payment_transactions** - Payment history
6. **gmb_locations** - Connected GMB locations
7. **posts** - Scheduled and published posts
8. **reviews** - Customer reviews
9. **qr_codes** - Generated QR codes
10. **competitors** - Competitor tracking
11. **geo_rankings** - SEO ranking data
12. **blogger_posts** - Blog automation
13. **api_keys** - API access management
14. **audit_logs** - Activity logging

### Key Features
- **UUID Primary Keys**: Better security and distribution
- **Soft Deletes**: Data retention with is_active flags
- **Timestamps**: created_at and updated_at on all tables
- **Indexes**: Optimized for common queries
- **JSONB Fields**: Flexible metadata storage
- **Foreign Keys**: Referential integrity
- **Triggers**: Automatic timestamp updates

## API Structure

### Authentication (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- GET `/profile` - Get user profile
- PUT `/password` - Update password

### GMB Integration (`/api/gmb`)
- GET `/auth-url` - Get OAuth URL
- GET `/callback` - OAuth callback
- GET `/locations` - List locations
- GET `/locations/:id` - Get location
- PUT `/locations/:id` - Update location

### AI Services (`/api/ai`)
- POST `/generate-post` - Generate post content
- POST `/generate-description` - Generate description
- POST `/generate-review-response` - Generate review response
- POST `/generate-blog-post` - Generate blog post
- POST `/analyze-seo` - Analyze SEO

### Payments (`/api/payments`)
- POST `/razorpay/create-order` - Create Razorpay order
- POST `/razorpay/verify` - Verify payment
- POST `/stripe/create-payment-intent` - Create Stripe payment
- POST `/paypal/create-order` - Create PayPal order
- GET `/transactions` - Get transaction history
- POST `/webhooks/stripe` - Stripe webhook
- POST `/webhooks/razorpay` - Razorpay webhook

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Long-lived sessions
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Admin, Tenant Admin, User roles
- **Multi-Tenant Isolation**: Automatic data segregation

### API Security
- **Rate Limiting**: Prevent abuse
  - General: 100 req/15min
  - Auth: 5 req/15min
  - API: 60 req/min
- **CORS**: Configured for frontend origin
- **Input Validation**: express-validator
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

### Data Security
- **Environment Variables**: Sensitive data not in code
- **Encrypted Tokens**: Secure token storage
- **Audit Logging**: Track all actions
- **Webhook Verification**: Validate payment webhooks

## Scheduled Jobs

### Cron Jobs
1. **Post Publishing** (Every minute)
   - Check scheduled posts
   - Refresh expired tokens
   - Publish to GMB
   - Update status

2. **Blog Publishing** (Every hour)
   - Process scheduled blog posts
   - Publish to Blogger
   - Track status

3. **Review Sync** (Daily at 2 AM)
   - Fetch new reviews
   - Update database
   - Trigger notifications

## Multi-Tenant Architecture

### Tenant Isolation
- **Database Level**: tenant_id column on all tables
- **Query Level**: Automatic filtering by tenant
- **API Level**: Middleware enforces isolation
- **Storage Level**: Separate folders per tenant

### Tenant Features
- **Custom Settings**: Per-tenant configuration (JSONB)
- **Separate Subscriptions**: Independent billing
- **Isolated Data**: No cross-tenant data access
- **Custom Branding**: Support for white-label (future)

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Can run multiple instances
- **Load Balancing**: Ready for load balancer
- **Database Connection Pooling**: Efficient connections
- **Redis Caching**: Reduce database load

### Performance Optimizations
- **Database Indexes**: Optimized queries
- **Redis Caching**: Frequent data cached
- **Lazy Loading**: Frontend pagination
- **Background Jobs**: Async processing

## Deployment Architecture

### Development
```
Docker Compose:
- PostgreSQL container
- Redis container
- Backend container (hot reload)
- Frontend container (Vite dev server)
```

### Production (Recommended)
```
Infrastructure:
- Application: PM2 or Docker Swarm/Kubernetes
- Database: Managed PostgreSQL (RDS, Cloud SQL)
- Cache: Managed Redis (ElastiCache, MemoryStore)
- Load Balancer: Nginx or Cloud Load Balancer
- Storage: Google Cloud Storage or S3
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack or Cloud Logging
```

## Code Organization

### Backend Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models (future)
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── server.ts       # Entry point
├── migrations/         # Database migrations
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API clients
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript types
│   ├── context/        # React contexts
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
└── package.json
```

## Error Handling

### Backend
- **Try-Catch Blocks**: All async operations
- **Centralized Error Handler**: Express middleware
- **Structured Logging**: Winston logger
- **Error Responses**: Consistent JSON format

### Frontend
- **Axios Interceptors**: Global error handling
- **Error States**: UI feedback
- **Token Refresh**: Automatic retry on 401

## Testing Strategy

### Backend Tests (Jest)
- Unit tests for services
- Integration tests for APIs
- Database tests with test DB
- Mock external services

### Frontend Tests (Future)
- Component tests
- Integration tests
- E2E tests with Playwright

## Monitoring & Logging

### Application Logging
- **Winston**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Log Files**: error.log, combined.log
- **Console**: Development mode

### Metrics (Future)
- Response times
- Error rates
- Database query performance
- Cache hit rates
- User activity

## Future Enhancements

### Features
- Advanced analytics dashboard
- Mobile application (React Native)
- Multi-language support
- Advanced AI insights
- White-label solutions
- Marketplace integrations

### Technical
- GraphQL API option
- WebSocket for real-time updates
- Message queue (RabbitMQ/SQS)
- Microservices architecture
- Kubernetes deployment
- CI/CD pipeline

## Maintenance

### Regular Tasks
- Database backups (daily)
- Log rotation
- Security updates
- Dependency updates
- Performance monitoring
- Cost optimization

### Database Maintenance
- Vacuum/analyze (weekly)
- Index optimization
- Query performance review
- Partition old data

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups
- **Files**: Cloud storage with versioning
- **Configuration**: Version controlled
- **Secrets**: Encrypted backup

### Recovery Plan
- **RTO**: Recovery Time Objective < 4 hours
- **RPO**: Recovery Point Objective < 1 hour
- **Backup Testing**: Monthly verification
- **Failover**: Automated where possible

## Compliance & Privacy

### Data Protection
- **GDPR Ready**: User data export/delete
- **Data Encryption**: At rest and in transit
- **Access Control**: Role-based permissions
- **Audit Trail**: All actions logged

### Best Practices
- Regular security audits
- Penetration testing
- Dependency vulnerability scanning
- Code review process
- Documentation updates
