# SETUP-GUIDE.md

## Quick Setup Guide for MediTranslate

### Step 1: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Step 2: Get API Keys

1. **DeepL API** (Free Tier - 500k chars/month)
   - Sign up: https://www.deepl.com/pro-api
   - Get API key from dashboard

2. **Mistral AI** (Free credits available)
   - Sign up: https://console.mistral.ai
   - Create API key

3. **Supabase** (Free Tier)
   - Create project: https://supabase.com
   - Get credentials from Settings → API

### Step 3: Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and paste:

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_language VARCHAR(10) NOT NULL,
  patient_language VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('doctor', 'patient')),
  original_text TEXT,
  translated_text TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_original_text ON messages USING gin(to_tsvector('english', original_text));
CREATE INDEX idx_messages_translated_text ON messages USING gin(to_tsvector('english', translated_text));
```

3. Go to Storage → Create bucket named `audio-recordings` → Make it public

### Step 4: Configure Environment Variables

**Frontend** - Create `.env`:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Backend** - Create `server/.env`:
```bash
DEEPL_API_KEY=your_deepl_api_key
MISTRAL_API_KEY=your_mistral_api_key
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 5: Run Locally

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Step 6: Test the Application

1. Open http://localhost:5173
2. Select Doctor or Patient role
3. Choose languages
4. Send messages (will translate if API keys configured)
5. Try audio recording
6. Test search functionality
7. Generate AI summary

### Deployment

**Vercel** (Frontend):
```bash
npm i -g vercel
vercel
# Add environment variables in Vercel dashboard
```

**Railway/Render** (Backend):
1. Connect GitHub repository
2. Add all environment variables
3. Deploy

**Important**: Update `VITE_API_URL` in frontend to your deployed backend URL!

## Troubleshooting

### Translation not working
- Check `DEEPL_API_KEY` is correct
- Verify DeepL account has credits
- Check console for errors

### Summary not generating
- Check `MISTRAL_API_KEY` is valid
- Ensure conversation has messages
- Check backend logs

### Database errors
- Verify Supabase credentials  
- Confirm SQL schema ran successfully
- Check table permissions

### Audio upload failing
- Confirm `audio-recordings` bucket exists
- Make sure bucket is public
- Check file size (< 10MB)

## Support

For issues, check:
- Backend logs in terminal
- Browser console (F12)
- Network tab for API errors
- Supabase dashboard logs
