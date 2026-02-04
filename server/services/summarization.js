import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import { supabase } from '../db.js';

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
    console.warn('Mistral API key not found in environment variables');
}

const client = apiKey ? new Mistral({ apiKey }) : null;

/**
 * Generate AI-powered medical summary of a conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<object>} Structured summary with medical entities
 */
export const generateSummary = async (conversationId) => {
    if (!client) {
        throw new Error('Mistral client not initialized. Check API key.');
    }

    try {
        // Fetch all messages from the conversation
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (!messages || messages.length === 0) {
            return {
                symptoms: [],
                diagnoses: [],
                medications: [],
                followup_actions: [],
                full_text: 'No messages in conversation yet.',
            };
        }

        // Build conversation text
        const conversationText = messages
            .map(msg => {
                const role = msg.sender_role === 'doctor' ? 'Doctor' : 'Patient';
                return `${role}: ${msg.original_text || ''}`;
            })
            .join('\n\n');

        // Create prompt for Mistral
        const prompt = `You are a medical AI assistant. Analyze the following doctor-patient conversation and extract key medical information.

Conversation:
${conversationText}

Please provide a structured summary in JSON format with the following fields:
- symptoms: Array of mentioned symptoms
- diagnoses: Array of mentioned diagnoses or suspected conditions
- medications: Array of mentioned medications or treatments
- followup_actions: Array of recommended follow-up actions
- full_text: Brief narrative summary of the consultation

Return ONLY valid JSON, no additional text.`;

        // Call Mistral API
        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            maxTokens: 1000,
        });

        const responseText = chatResponse.choices[0].message.content;

        // Parse JSON response
        let summary;
        try {
            // Extract JSON from potential markdown code blocks
            const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
            const jsonText = jsonMatch ? jsonMatch[1] : responseText;
            summary = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Error parsing Mistral response:', parseError);
            // Fallback structure
            summary = {
                symptoms: [],
                diagnoses: [],
                medications: [],
                followup_actions: [],
                full_text: responseText,
            };
        }

        return summary;
    } catch (error) {
        console.error('Mistral summarization error:', error);
        throw new Error(`Summary generation failed: ${error.message}`);
    }
};

export default { generateSummary };
