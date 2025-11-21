# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "tenantName": "My Business" // Optional, creates tenant if provided
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "tenant_admin",
    "tenantId": "uuid"
  },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "tenant_admin",
  "tenantId": "uuid"
}
```

### Update Password
```http
PUT /auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}

Response: 200 OK
{
  "message": "Password updated successfully"
}
```

## Google Business Profile (GMB)

### Get OAuth URL
```http
GET /gmb/auth-url
Authorization: Bearer <token>

Response: 200 OK
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### List Locations
```http
GET /gmb/locations
Authorization: Bearer <token>

Response: 200 OK
{
  "locations": [
    {
      "id": "uuid",
      "tenant_id": "uuid",
      "google_location_id": "...",
      "name": "My Business",
      "address": "123 Main St",
      "phone": "+1234567890",
      "website": "https://example.com",
      "is_active": true
    }
  ]
}
```

### Get Location Details
```http
GET /gmb/locations/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "location": { ... }
}
```

### Update Location
```http
PUT /gmb/locations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "phone": "+1234567890",
  "website": "https://example.com"
}

Response: 200 OK
{
  "message": "Location updated successfully"
}
```

## AI Content Generation

### Generate Post Content
```http
POST /ai/generate-post
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "My Coffee Shop",
  "businessType": "Coffee Shop",
  "targetAudience": "Coffee lovers",
  "tone": "friendly",
  "keywords": ["coffee", "artisan", "local"]
}

Response: 200 OK
{
  "content": "Generated post content..."
}
```

### Generate Business Description
```http
POST /ai/generate-description
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "My Coffee Shop",
  "businessType": "Coffee Shop",
  "keywords": ["coffee", "artisan", "local"]
}

Response: 200 OK
{
  "description": "Generated business description..."
}
```

### Generate Review Response
```http
POST /ai/generate-review-response
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewText": "Great service!",
  "rating": 5
}

Response: 200 OK
{
  "response": "Thank you so much for your kind words!..."
}
```

### Generate Blog Post
```http
POST /ai/generate-blog-post
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "My Coffee Shop",
  "businessType": "Coffee Shop",
  "topic": "The Art of Coffee Brewing",
  "keywords": ["brewing", "coffee", "techniques"]
}

Response: 200 OK
{
  "title": "The Art of Coffee Brewing",
  "content": "<h2>Introduction</h2><p>...</p>"
}
```

### Analyze SEO
```http
POST /ai/analyze-seo
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Your content here...",
  "keywords": ["keyword1", "keyword2"]
}

Response: 200 OK
{
  "keywordDensity": { ... },
  "readabilityScore": 85,
  "contentQuality": "good",
  "suggestions": [...]
}
```

## Payments

### Create Razorpay Order
```http
POST /payments/razorpay/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscriptionId": "uuid",
  "amount": 999.00,
  "currency": "INR"
}

Response: 200 OK
{
  "id": "order_id",
  "amount": 99900,
  "currency": "INR",
  ...
}
```

### Verify Razorpay Payment
```http
POST /payments/razorpay/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id",
  "paymentId": "payment_id",
  "signature": "signature_hash"
}

Response: 200 OK
{
  "message": "Payment verified successfully"
}
```

### Create Stripe Payment Intent
```http
POST /payments/stripe/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscriptionId": "uuid",
  "amount": 49.99,
  "currency": "usd"
}

Response: 200 OK
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### Create PayPal Order
```http
POST /payments/paypal/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscriptionId": "uuid",
  "amount": 49.99,
  "currency": "USD"
}

Response: 200 OK
{
  "orderId": "PAYPAL_xxx",
  "approvalUrl": "https://www.sandbox.paypal.com/..."
}
```

### Get Transaction History
```http
GET /payments/transactions
Authorization: Bearer <token>

Response: 200 OK
{
  "transactions": [
    {
      "id": "uuid",
      "payment_gateway": "stripe",
      "amount": 49.99,
      "currency": "USD",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limits

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- AI Generation: 60 requests per minute

## Webhooks

### Stripe Webhook
```http
POST /payments/webhooks/stripe
Content-Type: application/json

# Stripe sends webhook events
```

### Razorpay Webhook
```http
POST /payments/webhooks/razorpay
Content-Type: application/json

# Razorpay sends webhook events
```

## Pagination

For endpoints that support pagination, use these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Example:
```http
GET /gmb/locations?page=2&limit=50
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```
