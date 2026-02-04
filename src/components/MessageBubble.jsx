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
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => {
                console.error('Audio playback failed:', err);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const senderBg = isDoctor ? 'var(--color-indigo)' : 'var(--color-sage)';
    const avatarBg = isDoctor ? 'var(--color-indigo)' : 'var(--color-sage)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 mb-6 ${isSender ? 'justify-end' : 'justify-start'}`}
        >
            {!isSender && (
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: avatarBg, boxShadow: 'var(--shadow-sm)' }}
                >
                    {isDoctor ? (
                        <Stethoscope className="w-5 h-5 text-white" />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-md`}>
                <div
                    className="message-bubble"
                    style={{
                        background: isSender ? senderBg : 'white',
                        color: isSender ? 'white' : 'var(--color-charcoal)',
                        border: isSender ? 'none' : '1px solid var(--color-warm-beige)',
                    }}
                >
                    {!isSender && message.translated_text ? (
                        <div>
                            <p className="font-normal leading-relaxed">{message.translated_text}</p>
                            {message.original_text && message.original_text !== message.translated_text && (
                                <p className="text-sm mt-2 opacity-60 italic font-light">
                                    Original: {message.original_text}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="leading-relaxed">{message.original_text || message.text || '(No text)'}</p>
                    )}

                    {message.audio_url && (
                        <div
                            className="mt-3 pt-3"
                            style={{ borderTop: `1px solid ${isSender ? 'rgba(255,255,255,0.2)' : 'var(--color-warm-beige)'}` }}
                        >
                            <audio
                                ref={audioRef}
                                src={message.audio_url}
                                onEnded={() => setIsPlaying(false)}
                                onError={() => {
                                    console.error('Audio loading failed');
                                    setIsPlaying(false);
                                }}
                                className="hidden"
                                preload="metadata"
                            />
                            <button
                                onClick={toggleAudio}
                                className="flex items-center gap-2 text-sm transition-opacity"
                                style={{ opacity: 0.8 }}
                                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                <span className="font-light">{isPlaying ? 'Pause' : 'Play'} Audio</span>
                            </button>
                        </div>
                    )}
                </div>

                <span className="text-xs font-light mt-1" style={{ color: 'var(--color-stone)' }}>
                    {formatTime(message.created_at)}
                </span>
            </div>

            {isSender && (
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: avatarBg, boxShadow: 'var(--shadow-sm)' }}
                >
                    {isDoctor ? (
                        <Stethoscope className="w-5 h-5 text-white" />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default MessageBubble;
