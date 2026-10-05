# ShriShubh Platform

A clean starting point for a customer-facing website development marketplace.

## Included

- Next.js + TypeScript
- Responsive Tailwind-based UI
- Supabase authentication and PostgreSQL schema
- Customer registration/login
- Service selection and requirement form
- Fixed starting pricing
- Digital contract workflow
- Payment-ready checkout page
- Customer dashboard
- Customer messages with admin replies
- AI chat support for customer questions
- Private admin dashboard
- Admin orders/customers/contact messages
- Server-side admin role checks
- Zod validation for contact and chat APIs

## Features

### Customer Portal
- Secure login and account access
- Dashboard with project/order overview
- Message center to contact support
- View admin replies with timestamps
- AI support assistant at `/chat`

### Admin Portal
- Dashboard overview
- Orders management
- Customers management
- Message inbox and reply flow
- Settings page

## Setup

1. Install Node.js 20.9+.
2. Create a Supabase project.
3. Open `supabase/schema.sql` in Supabase SQL Editor and run it.
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase URL, anon key, and OpenAI API key.
6. Run `npm install`.
7. Run `npm run dev`.
8. Open `http://localhost:3000`.
9. Register your owner account, then promote that user's UUID to `admin` using the SQL comment in `supabase/schema.sql`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_api_key
```

## Important security note

The admin area is intentionally not included in the public navbar. The `/admin` routes also check the user's role server-side, and Supabase RLS policies protect database access.

## Payment

The included payment page is a provider-ready placeholder. Before accepting real money, connect a payment provider with server-side secrets and verified webhooks. Do not put secret payment keys in the repository.

## Branding

Business: ShriShubh
Founders: Shubham Sandeep Salvi and Shriom Suresh Chinkate
Email: shrishubh521@gmail.com
Location: Maharashtra, India

## Key Routes

- `/` — Home
- `/dashboard` — Customer dashboard
- `/messages` — Customer messaging center
- `/chat` — AI support assistant
- `/admin` — Admin dashboard
- `/admin/messages` — Admin message inbox
- `/admin/settings` — Admin settings
