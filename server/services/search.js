import { supabase } from '../db.js';

/**
 * Search conversations using full-text search
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching messages with context
 */
export const searchConversations = async (query) => {
    if (!query || !query.trim()) {
        return [];
    }

    try {
        // Use PostgreSQL full-text search
        const { data, error } = await supabase
            .from('messages')
            .select('id, conversation_id, sender_role, original_text, translated_text, created_at')
            .or(`original_text.ilike.%${query}%,translated_text.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Enhance results with context
        const enhancedResults = data.map(result => {
            const text = result.original_text || result.translated_text || '';
            const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());

            // Extract context around the match
            let context = '';
            if (queryIndex !== -1) {
                const start = Math.max(0, queryIndex - 50);
                const end = Math.min(text.length, queryIndex + query.length + 50);
                context = text.substring(start, end);
            }

            return {
                ...result,
                text: result.original_text,
                context,
            };
        });

        return enhancedResults;
    } catch (error) {
        console.error('Search error:', error);
        throw new Error(`Search failed: ${error.message}`);
    }
};

export default { searchConversations };
