# ShriShub Platform - Features Overview

## Customer Portal Features

### 1. Dashboard
- View all your projects/orders
- Track project status
- See quoted pricing and timeline

### 2. Messages
- Send messages to the ShriShubh team
- View conversation history
- See admin replies with timestamps
- Track message status (Pending/Replied)

### 3. AI Chat Support
- 24/7 instant support via AI assistant
- Answers about pricing, timeline, process, and support
- Powered by OpenAI GPT-3.5-turbo
- Access: `/chat` route when logged in

## Admin Portal Features

### 1. Dashboard
- Overview of platform metrics
- Quick access to orders and customers

### 2. Orders
- View all customer orders
- Track order status

### 3. Customers
- Manage customer accounts
- View customer information

### 4. Messages
- View all customer messages grouped by user
- Send detailed replies to customers
- Track which messages have been replied to
- Expandable message threads

### 5. Settings
- Platform configuration
- General settings overview
- Operational guidelines

## Database Requirements

Ensure your Supabase database has these tables:

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### orders (if needed)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_type TEXT,
  status TEXT DEFAULT 'pending',
  quoted_price DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### contact_messages (for public contact form)
```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key

# OpenAI
OPENAI_API_KEY=your_openai_key
```

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Access:
- Customer Portal: http://localhost:3000/dashboard
- Admin Portal: http://localhost:3000/admin
- AI Chat: http://localhost:3000/chat (when logged in)

## API Routes

### Customer APIs
- `POST /api/messages` - Send a new message
- `POST /api/chat` - AI chat endpoint

### Admin APIs
- `POST /api/admin/messages/reply` - Send reply to customer message

### Public APIs
- `POST /api/contact` - Public contact form

## Routes

### Public Routes
- `/` - Home
- `/contact` - Contact form
- `/pricing` - Pricing page
- `/services` - Services
- `/how-it-works` - Process
- `/about` - About
- `/login` - Login
- `/register` - Register

### Customer Routes (Protected)
- `/dashboard` - Customer dashboard
- `/messages` - Message center
- `/chat` - AI chat support

### Admin Routes (Protected)
- `/admin` - Admin dashboard
- `/admin/orders` - Orders management
- `/admin/customers` - Customers management
- `/admin/messages` - Message management
- `/admin/settings` - Platform settings

## Styling

The project uses Tailwind CSS v4 with:
- Custom utility classes in `app/globals.css`
- `.btn-primary`, `.btn-secondary` for buttons
- `.card` for card components
- `.input` for form inputs
- `.container-page` for page containers

## Support

For issues or questions:
1. Check the Messages section in your customer portal
2. Use the AI Chat for quick answers
3. Contact: support@shrishubh.com
