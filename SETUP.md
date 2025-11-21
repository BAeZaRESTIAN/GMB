# LocalAI Platform - Setup Guide

## Overview

LocalAI is a comprehensive multi-tenant SaaS platform for automating Google Business Profile optimization using AI. This guide will help you set up and run the application.

## Architecture

The platform is built with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: Google Gemini Pro for text generation
- **Payments**: Razorpay, Stripe, and PayPal integration
- **APIs**: Google Business Profile API, Google Places API, Blogger API

## Prerequisites

- Node.js 18+ and npm
- Supabase account (already configured)
- Google Cloud Project with GMB and Places API enabled
- Gemini API key
- Payment gateway accounts (Razorpay/Stripe/PayPal)

## Database Setup

The database schema includes 20+ tables for complete functionality:

### Core Tables
- `profiles` - User profiles and roles
- `plans` - Subscription plans
- `subscriptions` - User subscriptions
- `invoices` - Billing records
- `coupons` - Discount codes

### Business Management
- `businesses` - GMB business accounts
- `gmb_snapshots` - Historical GMB data
- `posts` - Scheduled and published posts
- `products` - Product listings
- `images` - Generated images

### Reviews & Engagement
- `reviews` - Google reviews
- `review_replies` - AI-generated replies

### Intelligence
- `competitors` - Tracked competitors
- `competitor_snapshots` - Competitor history
- `rank_snapshots` - Geo-rank tracking

### Automation
- `scheduled_jobs` - Cron-like scheduler
- `usage_logs` - API usage tracking
- `prompt_templates` - AI prompts
- `blog_posts` - Blogger integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

4. The database is already configured via Supabase

## Running the Application

### Development
```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features

### Authentication
- Email/password signup and login
- Email verification (optional)
- Password reset
- Role-based access (admin, user, agent)

### Business Management
- Add multiple business locations
- Connect to Google Business Profile
- AI-powered profile optimization
- Automation modes: manual, semi-auto, full-auto

### Content Generation
- AI-generated business descriptions
- Automated post creation
- Product description generation
- Blog post drafting

### Review Management
- Fetch and display Google reviews
- AI-generated review replies
- Sentiment analysis
- Auto-reply scheduling

### Competitor Intelligence
- Find nearby competitors
- Track competitor metrics
- Compare categories and keywords
- Monitor posting frequency

### Geo-Rank Tracking
- 7x7 or 9x9 grid tracking
- Heatmap visualization
- Daily rank checks
- Historical data

### QR Code Generation
- Generate QR codes for review collection
- PNG and SVG formats
- Printable PDF posters

### Blog Automation
- Auto-publish to Blogger
- SEO-optimized content
- Image integration
- Keyword targeting

### Admin Panel
- User management
- Subscription overview
- Usage monitoring
- System logs

## API Integration

### Google Business Profile
Configure OAuth credentials in Google Cloud Console and add to environment variables.

### Google Places API
Enable Places API in Google Cloud Console and add API key to environment.

### Gemini Pro
Get API key from Google AI Studio and configure in environment variables.

### Payment Gateways
Configure webhooks for each payment provider:
- Razorpay: `/api/webhooks/razorpay`
- Stripe: `/api/webhooks/stripe`
- PayPal: `/api/webhooks/paypal`

## Subscription Plans

Default plans (customizable via database):

- **Starter**: $29/mo - 1 business, 100K AI tokens
- **Pro**: $79/mo - 5 businesses, 500K AI tokens
- **Agency**: $199/mo - 25 businesses, 2M AI tokens
- **Enterprise**: Custom pricing

All plans include 7-day free trial.

## Edge Functions

The following Edge Functions need to be deployed:

- `ai-orchestrator` - AI text generation
- `ai-image` - Image generation
- `gmb-sync` - GMB data synchronization
- `competitor-search` - Competitor discovery
- `qr-generator` - QR code generation
- `rank-tracker` - Geo-rank checking
- `review-auto-reply` - Review automation
- `scheduler` - Job scheduling
- `billing-webhook` - Payment webhooks

Deploy functions using the Supabase CLI or dashboard.

## Security

- All tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Admins have full access via role-based policies
- API keys are stored securely in Supabase environment
- Webhook signatures are verified

## Development Notes

### Project Structure
```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth)
├── lib/
│   ├── adapters/   # External service adapters
│   └── utils/      # Utility functions
├── pages/          # Route pages
│   ├── auth/       # Authentication pages
│   ├── business/   # Business management
│   └── admin/      # Admin panel
└── styles/         # Global styles
```

### Adapters
All external services use adapter pattern for easy swapping:
- `gemini.ts` - AI text generation
- `imageProvider.ts` - Image generation
- `googleGMB.ts` - GMB API
- `googlePlaces.ts` - Places API
- `blogger.ts` - Blogger API
- `razorpay.ts`, `stripe.ts`, `paypal.ts` - Payment gateways

## Support

For issues or questions, contact support or refer to the documentation.

## License

Proprietary - All rights reserved
