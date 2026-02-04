# MediTranslate Server

Backend API for the Healthcare Doctor-Patient Translation Web Application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
- `DEEPL_API_KEY`: Your DeepL API key
- `MISTRAL_API_KEY`: Your Mistral AI API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_KEY`: Supabase service role key

4. Set up Supabase database:
   - Go to your Supabase project's SQL Editor
   - Run the SQL from `db.js` file (the `setupSQL` constant)
   - Create a storage bucket named `audio-recordings` (make it public)

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Translation
- `POST /api/translate` - Translate text
  - Body: `{ text, targetLang, sourceLang? }`

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get specific conversation with messages

### Messages
- `POST /api/messages` - Save a message
  - Body: `{ conversation_id, sender_role, original_text, translated_text?, audio_url? }`

### Audio
- `POST /api/audio` - Upload audio recording
  - FormData: `audio` (file), `conversationId`

### AI Features
- `POST /api/summarize` - Generate medical summary
  - Body: `{ conversationId }`
- `GET /api/search?q=query` - Search conversations

## Tech Stack
- Express.js - Web framework
- Supabase - Database & Storage
- DeepL - Translation API
- Mistral AI - Summarization
- Multer - File uploads
