import { motion } from 'framer-motion';
import { User, Stethoscope, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MessageBubble = ({ message, role }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const isSender = message.sender_role === role;
    const isDoctor = message.sender_role === 'doctor';

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const toggleAudio = () => {

        audio.play();
    };

    const handleTranslateToLanguage = async (targetLang) => {
        setIsTranslating(true);
        try {
            const textToTranslate = message.original_text || message.translated_text;
            const result = await translateText(textToTranslate, targetLang);
            setCustomTranslation({
                text: result.translatedText,
                language: LANGUAGES.find(l => l.code === targetLang)?.name || targetLang
            });
            setShowOriginal(false);
            setShowTranslateMenu(false);
        } catch (error) {
            console.error('Translation error:', error);
            alert('Failed to translate message');
        } finally {
            setIsTranslating(false);
        }
    };

    const isOwnMessage = isDoctor
        ? message.sender_role === 'doctor'
        : message.sender_role === 'patient';

    const accentColor = message.sender_role === 'doctor'
        ? 'var(--color-indigo)'
        : 'var(--color-sage)';

    const displayText = customTranslation
        ? customTranslation.text
        : (showOriginal ? message.original_text : message.translated_text);

    return (
        <div className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: accentColor }}
            >
                {message.sender_role === 'doctor' ? (
                    <Stethoscope className="w-5 h-5 text-white" />
                ) : (
                    <User className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-md ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Message Bubble */}
                <div
                    className="glass-panel relative"
                    style={{
                        background: isOwnMessage ? 'white' : 'var(--color-sand)',
                        borderLeft: `3px solid ${accentColor}`,
                    }}
                >
                    {/* Text Content */}
                    <div className="space-y-2">
                        {/* Display Text */}
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                            {displayText}
                        </p>

                        {/* Custom Translation Label */}
                        {customTranslation && (
                            <span className="text-xs font-light italic" style={{ color: 'var(--color-stone)' }}>
                                Translated to {customTranslation.language}
                            </span>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Show Original/Translation Toggle */}
                            {message.original_text && message.translated_text && !customTranslation && (
                                <button
                                    onClick={() => setShowOriginal(!showOriginal)}
                                    className="text-xs font-light hover:underline transition-all"
                                    style={{ color: 'var(--color-stone)' }}
                                >
                                    {showOriginal ? 'Show translation' : 'Show original'}
                                </button>
                            )}

                            {/* Translate Button */}
                            <button
                                onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                                className="flex items-center gap-1 text-xs font-light hover:underline transition-all"
                                style={{ color: accentColor }}
                                disabled={isTranslating}
                            >
                                {isTranslating ? (
                                    <>
                                        <Loader className="w-3 h-3 animate-spin" />
                                        <span>Translating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Languages className="w-3 h-3" />
                                        <span>Translate to...</span>
                                    </>
                                )}
                            </button>

                            {/* Reset Translation */}
                            {customTranslation && (
                                <button
                                    onClick={() => setCustomTranslation(null)}
                                    className="text-xs font-light hover:underline transition-all"
                                    style={{ color: 'var(--color-stone)' }}
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Translation Menu */}
                        {showTranslateMenu && (
                            <div
                                className="mt-2 p-2 rounded-lg border grid grid-cols-2 gap-1"
                                style={{
                                    background: 'white',
                                    borderColor: 'var(--color-warm-beige)',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}
                            >
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleTranslateToLanguage(lang.code)}
                                        className="text-xs p-2 rounded hover:bg-opacity-50 transition-all text-left"
                                        style={{
                                            background: 'var(--color-sand)',
                                            color: 'var(--color-charcoal)'
                                        }}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Audio Player */}
                    {message.audio_url && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-warm-beige)' }}>
                            <button
                                onClick={handlePlayAudio}
                                disabled={isPlaying}
                                className="flex items-center gap-2 text-sm transition-colors"
                                style={{
                                    color: isPlaying ? 'var(--color-stone)' : accentColor,
                                }}
                            >
                                {isPlaying ? (
                                    <>
                                        <VolumeX className="w-4 h-4" />
                                        <span className="font-light">Playing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-4 h-4" />
                                        <span className="font-light">Play audio</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <span className="text-xs font-light mt-1 px-1" style={{ color: 'var(--color-stone)' }}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
                    )}
        </div>
    )
}
        </motion.div >
    );
};

export default MessageBubble;
