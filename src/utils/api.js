import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Retry logic for failed requests
const retryRequest = async (fn, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries) throw error;
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
};

// Helper to extract user-friendly error messages
const getErrorMessage = (error) => {
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Translation service
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
    if (!text?.trim()) {
        throw new Error('Text cannot be empty');
    }

    try {
        const response = await retryRequest(() =>
            api.post('/translate', {
                text: text.trim(),
                targetLang,
                sourceLang,
            })
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Translation failed: ${message}`);
    }
};

// Message service
export const saveMessage = async (messageData) => {
    if (!messageData.conversation_id || !messageData.sender_role) {
        throw new Error('Invalid message data');
    }

    try {
        const response = await retryRequest(() => api.post('/messages', messageData));
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Failed to save message: ${message}`);
    }
};

// Conversation service
export const getConversations = async () => {
    try {
        const response = await api.get('/conversations');
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Failed to load conversations: ${message}`);
    }
};

export const getConversation = async (id) => {
    if (!id) {
        throw new Error('Conversation ID is required');
    }

    try {
        const response = await api.get(`/conversations/${id}`);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Failed to load conversation: ${message}`);
    }
};

// Audio service
export const uploadAudio = async (audioBlob, conversationId) => {
    if (!audioBlob) {
        throw new Error('No audio data provided');
    }
    if (!conversationId) {
        throw new Error('Conversation ID is required');
    }

    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('conversationId', conversationId);

        const response = await retryRequest(() =>
            api.post('/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 seconds for file upload
            })
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Audio upload failed: ${message}`);
    }
};

// Summary service
export const generateSummary = async (conversationId) => {
    if (!conversationId) {
        throw new Error('Conversation ID is required');
    }

    try {
        const response = await api.post('/summarize', { conversationId }, {
            timeout: 60000, // AI summary can take time
        });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Summary generation failed: ${message}`);
    }
};

// Search service
export const searchConversations = async (query) => {
    if (!query?.trim()) {
        return []; // Return empty array for empty search
    }

    try {
        const response = await api.get('/search', {
            params: { q: query.trim() }
        });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(`Search failed: ${message}`);
    }
};

export default api;
