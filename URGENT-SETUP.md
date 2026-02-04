# CRITICAL SETUP STEPS - DO THESE NOW!

## ⚠️ YOU MUST DO THESE TWO THINGS FOR THE APP TO WORK:

### 1. Create Database Tables in Supabase

1. Go to: https://supabase.com/dashboard/project/wrgfphiimznqlelsofym
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**
4. Paste this SQL and click **"Run"**:

```sql
-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_language VARCHAR(10) NOT NULL,
  patient_language VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('doctor', 'patient')),
  original_text TEXT,
  translated_text TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_original_text ON messages USING gin(to_tsvector('english', original_text));
CREATE INDEX IF NOT EXISTS idx_messages_translated_text ON messages USING gin(to_tsvector('english', translated_text));
```

### 2. Create Storage Bucket in Supabase

1. Go to: https://supabase.com/dashboard/project/wrgfphiimznqlelsofym/storage/buckets
2. Click **"New bucket"** button
3. Name: `audio-recordings`
4. Toggle **"Public bucket"** to **ON** ✅
5. Click **"Create bucket"**

---

## After completing both steps above:

**Refresh your browser** and try sending a message again!

The app will work perfectly once these are done! 🚀
