import * as deepl from 'deepl-node';
import dotenv from 'dotenv';

dotenv.config();

const authKey = process.env.DEEPL_API_KEY;

if (!authKey) {
    console.warn('DeepL API key not found in environment variables');
}

const translator = authKey ? new deepl.Translator(authKey) : null;

/**
 * Translate text using DeepL API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'ES', 'FR')
 * @param {string} sourceLang - Source language code (optional, 'auto' for detection)
 * @returns {Promise<object>} Translation result
 */
export const translateText = async (text, targetLang, sourceLang = null) => {
    if (!translator) {
        throw new Error('DeepL translator not initialized. Check API key.');
    }

    if (!text || !text.trim()) {
        return { translated_text: '', detected_language: sourceLang };
    }

    try {
        const result = await translator.translateText(
            text,
            sourceLang,
            targetLang,
            {
                formality: 'default',
                preserveFormatting: true,
            }
        );

        return {
            translated_text: result.text,
            detected_language: result.detectedSourceLang,
        };
    } catch (error) {
        console.error('DeepL translation error:', error);
        throw new Error(`Translation failed: ${error.message}`);
    }
};

/**
 * Get available languages from DeepL
 * @returns {Promise<Array>} List of available languages
 */
export const getAvailableLanguages = async () => {
    if (!translator) {
        throw new Error('DeepL translator not initialized');
    }

    try {
        const targetLanguages = await translator.getTargetLanguages();
        return targetLanguages.map(lang => ({
            code: lang.code,
            name: lang.name,
        }));
    } catch (error) {
        console.error('Error fetching languages:', error);
        throw error;
    }
};

export default { translateText, getAvailableLanguages };
