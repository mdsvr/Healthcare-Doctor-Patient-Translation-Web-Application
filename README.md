# 🏥 MediTranslate - Healthcare Translation Platform

> Real-time translation system for doctor-patient communication

[Live Demo](https://healthcare-doctor-patient-translati-pearl.vercel.app) • [GitHub Repository](https://github.com/mdsvr/Healthcare-Doctor-Patient-Translation-Web-Application)

---

## 📋 Project Overview

MediTranslate is a web application designed to enable real-time communication between doctors and patients who speak different languages. It demonstrates core translation functionality with AI-powered features for medical contexts.

**Key Challenge**: Build a production-ready translation interface with audio support, conversation logging, and AI summarization.

---

## ✨ Features Implemented

### ✅ Core Features (Fully Working)

1. **Real-Time Translation Chat**
   - Dual role system (Doctor/Patient views)
   - Translation via DeepL API (tested with 10+ languages)
   - Message history with timestamps
   - Clean, responsive UI

2. **Audio Recording**
   - Browser-based recording using WebRTC
   - Audio playback in conversation thread
   - Cloud storage integration (Supabase)

3. **Conversation Persistence**
   - Messages stored in PostgreSQL database
   - Conversation history accessible across sessions
   - Separate storage of original and translated text

4. **Search Functionality**
   - Keyword search across all conversations
   - Full-text search with PostgreSQL
   - Basic result highlighting

### ⚠️ Partially Implemented

5. **AI-Powered Summarization**
   - Basic Mistral AI integration works
   - Generates conversation summaries
   - Medical entity extraction needs refinement
   - Summary panel functional but styling incomplete

### 🚧 Known Issues

- Audio files persist indefinitely (no auto-cleanup implemented)
- Search highlighting could be more robust
- No pagination for conversation history
- Limited mobile testing (works but not optimized)
- Error messages could be more user-friendly

---

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** + Express
- **Supabase** (PostgreSQL database + file storage)
- **Multer** for file uploads

### APIs
- **DeepL API** - Text translation
- **Mistral AI** - Conversation summarization

---

## 🤖 AI Integration

### APIs Used

1. **DeepL Translation API**
   - Used for message translation between languages
   - Supports 30+ languages (tested with 10)
   - Handles medical terminology well

2. **Mistral AI (`mistral-large-latest`)**
   - Generates conversation summaries
   - Attempts to extract medical entities (symptoms, diagnoses, medications)
   - Works but could be more accurate with better prompting

### Development Tools Leveraged

- **GitHub Copilot** - Code completion and boilerplate
- **ChatGPT** - Debugging DeepL API integration issues
- Online documentation for Supabase setup

---

## 🏗️ Architecture

Simple full-stack setup:

```
┌──────────────┐
│  React SPA   │  (Vite dev server)
│  Port 5173   │
└──────┬───────┘
       │ REST API
       ↓
┌──────────────┐
│  Express API │  (Node.js)
│  Port 3000   │
└──────┬───────┘
       │
  ┌────┴────┬─────────┬──────────┐
  ↓         ↓         ↓          ↓
┌─────┐  ┌─────┐  ┌──────┐  ┌────────┐
│ DB  │  │DeepL│  │Mistral│ │Storage │
└─────┘  └─────┘  └──────┘  └────────┘
  Supabase         AI APIs    Supabase
```

### Database Schema

**Conversations:**
- `id`, `doctor_language`, `patient_language`, timestamps

**Messages:**
- `id`, `conversation_id`, `sender_role`, `original_text`, `translated_text`, `audio_url`, timestamp

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- DeepL API key (free tier)
- Mistral AI API key

### Setup

1. **Clone and install**
```bash
git clone https://github.com/yourusername/meditranslate.git
cd meditranslate
npm install
cd server && npm install && cd ..
```

2. **Configure environment**

Create `.env` in root:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_key
```

Create `server/.env`:
```env
DEEPL_API_KEY=your_key
MISTRAL_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
PORT=3000
```

3. **Setup database**

Run SQL from `URGENT-SETUP.md` in Supabase SQL Editor.
Create public storage bucket: `audio-recordings`

4. **Run locally**
```bash
# Terminal 1
npm run dev

# Terminal 2
cd server && npm start
```

Visit `http://localhost:5173`

---

## 📦 Deployment

### Production Setup

- **Frontend**: Vercel - [https://healthcare-doctor-patient-translati-pearl.vercel.app](https://healthcare-doctor-patient-translati-pearl.vercel.app)
- **Backend**: Render - [https://healthcare-doctor-patient-translation-ivad.onrender.com](https://healthcare-doctor-patient-translation-ivad.onrender.com)
- **Database**: Supabase Cloud
- **GitHub**: [https://github.com/mdsvr/Healthcare-Doctor-Patient-Translation-Web-Application](https://github.com/mdsvr/Healthcare-Doctor-Patient-Translation-Web-Application)

### Deployment Steps

1. Push to GitHub
2. Connect Vercel to repo → Deploy frontend
3. Connect Railway to repo → Deploy backend
4. Update environment variables with production URLs

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Manual Testing Performed

Due to time constraints, no automated tests. Manual testing:

✅ Message sending/receiving (English ↔ Spanish, Chinese, French)  
✅ Audio recording and playback  
✅ Conversation persistence  
✅ Search functionality  
✅ AI summary generation  
✅ Role switching  
⚠️ Mobile view (basic check only)  
⚠️ Error handling (happy path tested)

**Browsers tested:** Chrome, Firefox

---

## 📸 Screenshots

*To be added after final deployment*

---

## 🐛 Known Issues

1. **Search highlighting** - Only exact matches highlighted
2. **Audio cleanup** - No automatic deletion of old audio files
3. **Error messages** - Some backend errors not user-friendly
4. **Summary accuracy** - Medical entity extraction needs improvement
5. **Loading states** - Some operations lack loading indicators
6. **Network errors** - Limited retry logic on failures

---

## 🔮 Future Improvements

If continuing development:

1. Add user authentication and multi-tenancy
2. Implement WebSocket for real-time sync
3. Add audio transcription using Whisper API
4. Build admin panel for managing conversations
5. Add comprehensive test suite
6. Implement proper error boundaries
7. Add rate limiting and security headers
8. Optimize database queries with indexes
9. Add conversation export (PDF/JSON)
10. Implement offline mode with service workers

---

## 📄 License

MIT License - See [LICENSE](./LICENSE)

---

## 📞 Project Details

**Project**: Healthcare Doctor-Patient Translation Web Application  
**Submitted By**: [Your Name]  
**Date**: February 2026  
**GitHub**: [https://github.com/mdsvr/Healthcare-Doctor-Patient-Translation-Web-Application](https://github.com/mdsvr/Healthcare-Doctor-Patient-Translation-Web-Application)  
**Live Demo**: [https://healthcare-doctor-patient-translati-pearl.vercel.app](https://healthcare-doctor-patient-translati-pearl.vercel.app)

---

## 🙏 Acknowledgments

- **DeepL** for translation API
- **Mistral AI** for summarization capabilities
- **Supabase** for backend infrastructure
- **Vercel** and **Railway** for hosting

---

**Built with ❤️ for better healthcare communication**
