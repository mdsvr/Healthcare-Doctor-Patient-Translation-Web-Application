import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './db.js';
import { translateText } from './services/translation.js';
import { generateSummary } from './services/summarization.js';
import { searchConversations } from './services/search.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for audio uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    },
});

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MediTranslate API is running' });
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLang, sourceLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Missing required fields: text, targetLang' });
        }

        const result = await translateText(text, targetLang, sourceLang || null);
        res.json(result);
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: error.message || 'Translation failed' });
    }
});

// Get all conversations
app.get('/api/conversations', async (req, res) => {
    try {
        const { data: conversations, error } = await supabase
            .from('conversations')
            .select(`
        *,
        messages:messages(count)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Format response with message count
        const formattedConversations = conversations.map(conv => ({
            ...conv,
            message_count: conv.messages[0]?.count || 0,
        }));

        res.json(formattedConversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch conversations' });
    }
});

// Get single conversation with messages
app.get('/api/conversations/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get conversation
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', id)
            .single();

        if (convError) throw convError;

        // Get messages
        const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', id)
            .order('created_at', { ascending: true });

        if (msgError) throw msgError;

        res.json({
            ...conversation,
            messages: messages || [],
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch conversation' });
    }
});

// Create/Save message
app.post('/api/messages', async (req, res) => {
    try {
        const { conversation_id, sender_role, original_text, translated_text, audio_url } = req.body;

        if (!conversation_id || !sender_role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    conversation_id,
                    sender_role,
                    original_text,
                    translated_text,
                    audio_url,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('Save message error:', error);
        res.status(500).json({ error: error.message || 'Failed to save message' });
    }
});

// Upload audio
app.post('/api/audio', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const { conversationId } = req.body;
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID required' });
        }

        // Upload to Supabase Storage
        const fileName = `${conversationId}/${Date.now()}.webm`;
        const { data, error } = await supabase.storage
            .from('audio-recordings')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('audio-recordings')
            .getPublicUrl(fileName);

        res.status(201).json({
            url: urlData.publicUrl,
            path: fileName,
        });
    } catch (error) {
        console.error('Audio upload error:', error);
        res.status(500).json({ error: error.message || 'Audio upload failed' });
    }
});

// Generate summary
app.post('/api/summarize', async (req, res) => {
    try {
        const { conversationId } = req.body;

        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID required' });
        }

        const summary = await generateSummary(conversationId);
        res.json({ summary });
    } catch (error) {
        console.error('Summarization error:', error);
        res.status(500).json({ error: error.message || 'Summary generation failed' });
    }
});

// Search conversations
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        const results = await searchConversations(q);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message || 'Search failed' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MediTranslate API server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
