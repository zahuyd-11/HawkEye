# HawkEye Investment Decision Support Platform

A comprehensive investment decision-support platform for retail investors in Vietnam, built with Next.js 14, React, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## Features

### Core Modules

1. **DealDigest** - Standardized 1-page company analysis reports
   - Business overview
   - Financial health summary
   - Growth catalysts
   - Risk factors with scoring
   - If-Then action checklists
   - PDF export

2. **TradePlan Builder** - Structured trading tools
   - Trading journal
   - Entry/exit planning
   - Risk-Reward calculator
   - Position sizing tool
   - Performance analytics

3. **Micro Research** - Short company research notes
   - Published 3-4 times per week
   - Filterable by industry and market cap
   - Search functionality

4. **Subscription System**
   - Free, Plus (249k VND/month), Pro (499k VND/month)
   - Stripe payment integration
   - Auto-renewal and cancellation

5. **Admin Panel**
   - DealDigest management
   - Micro Research management
   - User and subscription management
   - Blog CMS
   - Analytics dashboard

6. **Additional Features**
   - Real-time market data ticker
   - Customer support chat widget
   - Industry and market cap filters
   - Watchlist functionality
   - Risk alerts system

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
cd Web/hawkeye-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (e.g., http://localhost:3000)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe keys

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hawkeye-platform/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin panel
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── pricing/      # Pricing page
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── layout/       # Layout components
│   │   └── providers/   # Context providers
│   └── lib/              # Utility functions
│       ├── auth.ts       # NextAuth configuration
│       ├── db.ts         # Prisma client
│       └── constants.ts  # App constants
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

The platform uses Prisma with PostgreSQL. Key models include:

- `User` - User accounts and authentication
- `Subscription` - User subscription tiers and billing
- `DealDigest` - Company analysis reports
- `TradePlan` - User trading plans
- `MicroResearch` - Research articles
- `WatchlistItem` - User watchlists
- `RiskAlert` - Risk alerts
- `BlogPost` - Blog content

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Railway
- Render
- AWS
- DigitalOcean

Make sure to:
- Set up PostgreSQL database
- Configure all environment variables
- Run database migrations

## Environment Variables

See `.env.example` for all required environment variables.

## License

Proprietary - All rights reserved

## Support

For support, contact:
- Email: hawkeye.contact@gmail.com
- Hotline: 0913428077

## Disclaimer

HawkEye does not provide personalized investment advice. All information is for educational and informational purposes only.
