# Deployment Guide

## Environment Setup

### Required Environment Variables

**For Vercel, Netlify, or similar:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### For Vercel Deployment

1. Push code to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables in Settings > Environment Variables
4. Deploy

```bash
# Or use Vercel CLI
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### For Self-Hosted (VPS/Docker)

```bash
# Install Node.js 20+
nvm install 20

# Clone and setup
git clone https://github.com/shrishubh521-oss/ShriShub-Organisation.git
cd ShriShub-Organisation

# Install dependencies
npm install

# Create .env.local
echo "OPENAI_API_KEY=sk-..." > .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=..." >> .env.local
echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=..." >> .env.local

# Build and start
npm run build
npm start
```

## Security Considerations

1. **Never commit .env.local** - Add to .gitignore
2. **API Keys** - Use platform-specific secret management
3. **Supabase RLS** - Enable row-level security on all tables
4. **Admin Routes** - Verify role before allowing access
5. **Rate Limiting** - Consider adding rate limits to API routes

## Database Setup

Run SQL migrations in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id OR 
         (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Testing

```bash
# Run development mode
npm run dev

# Test in browser
# 1. Register at http://localhost:3000/register
# 2. Login at http://localhost:3000/login
# 3. Test customer portal features
# 4. Create admin account and test admin panel
```

## Monitoring

- Check API logs in Vercel/hosting dashboard
- Monitor Supabase database usage
- Track OpenAI API costs in OpenAI dashboard
- Set up error tracking (Sentry, LogRocket, etc.)

## Cost Estimates

### OpenAI API
- GPT-3.5-turbo: ~$0.001 per 1K tokens
- Estimate: ~$0.01-0.05 per chat conversation

### Supabase
- Free tier: up to 1GB database, 100K auth users
- Pro: $25/month + usage

### Hosting (Vercel/Netlify)
- Free tier: includes deployment
- Pro: $20-50/month for additional features
