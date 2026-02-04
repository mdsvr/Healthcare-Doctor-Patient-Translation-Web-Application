import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Sparkles, Languages, Loader } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import AudioRecorder from '../components/AudioRecorder';
import SummaryPanel from '../components/SummaryPanel';
import { translateText, saveMessage, getConversation, uploadAudio } from '../utils/api';
import { supabase } from '../config/supabase';

const LANGUAGES = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Spanish' },
    { code: 'FR', name: 'French' },
    { code: 'DE', name: 'German' },
    { code: 'IT', name: 'Italian' },
    { code: 'PT', name: 'Portuguese' },
    { code: 'ZH', name: 'Chinese' },
    { code: 'JA', name: 'Japanese' },
    { code: 'KO', name: 'Korean' },
    { code: 'AR', name: 'Arabic' },
    { code: 'HI', name: 'Hindi' },
    { code: 'RU', name: 'Russian' },
];

const Chat = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [role, setRole] = useState(searchParams.get('role') || 'doctor');
    const [myLanguage, setMyLanguage] = useState('EN');
    const [theirLanguage, setTheirLanguage] = useState('ES');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [conversationId, setConversationId] = useState(id === 'new' ? null : id);
    const [audioBlob, setAudioBlob] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (conversationId && conversationId !== 'new') {
            loadConversation();
        } else if (!conversationId || conversationId === 'new') {
            createNewConversation();
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const createNewConversation = async () => {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .insert([{
                    doctor_language: role === 'doctor' ? myLanguage : theirLanguage,
                    patient_language: role === 'patient' ? myLanguage : theirLanguage,
                    created_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;
            setConversationId(data.id);
            navigate(`/chat/${data.id}?role=${role}`, { replace: true });
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const loadConversation = async () => {
        try {
            const data = await getConversation(conversationId);
            if (data && data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() && !audioBlob) return;

        setIsTranslating(true);

        try {
            const targetLang = role === 'doctor' ? theirLanguage : theirLanguage;
            let translatedText = '';

            if (inputText.trim()) {
                const translation = await translateText(inputText, targetLang, myLanguage);
                translatedText = translation.translated_text || translation.text;
            }

            let audioUrl = null;
            if (audioBlob) {
                const audioData = await uploadAudio(audioBlob, conversationId);
                audioUrl = audioData.url;
            }

            const messageData = {
                conversation_id: conversationId,
                sender_role: role,
                original_text: inputText,
                translated_text: translatedText,
                audio_url: audioUrl,
                created_at: new Date().toISOString(),
            };

            const savedMessage = await saveMessage(messageData);
            setMessages(prev => [...prev, savedMessage]);
            setInputText('');
            setAudioBlob(null);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleAudioRecording = (blob) => {
        setAudioBlob(blob);
    };

    const accentColor = role === 'doctor' ? 'var(--color-indigo)' : 'var(--color-sage)';

    return (
        <div className="min-h-screen p-6" style={{ background: 'var(--color-cream)' }}>
            {/* Header */}
            <div className="glass-panel mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-lg transition-colors hover:bg-white"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-medium" style={{ color: 'var(--color-charcoal)' }}>
                            {role === 'doctor' ? 'Doctor' : 'Patient'} View
                        </h1>
                        <p className="text-xs font-light" style={{ color: 'var(--color-stone)' }}>
                            Conversation {conversationId ? `#${conversationId.slice(0, 8)}` : '(New)'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" style={{ color: 'var(--color-stone)' }} />
                        <select
                            value={myLanguage}
                            onChange={(e) => setMyLanguage(e.target.value)}
                            className="input-field py-2 text-sm"
                            style={{ minWidth: '120px' }}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowSummary(!showSummary)}
                        className="btn-primary text-sm"
                        style={{ background: 'var(--color-terracotta)', padding: '0.5rem 1.25rem' }}
                    >
                        <Sparkles className="inline-block w-4 h-4 mr-2" />
                        {showSummary ? 'Hide' : 'Show'} Summary
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Messages Area */}
                <div className="flex-1 glass-panel flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
                    <div className="flex-1 overflow-y-auto mb-6 pr-2">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center" style={{ color: 'var(--color-stone)' }}>
                                <div className="text-center">
                                    <Languages className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                    <p className="text-base font-light">No messages yet</p>
                                    <p className="text-sm mt-2 font-light opacity-70">Start the conversation below</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <MessageBubble key={index} message={message} role={role} />
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{ borderTop: '1px solid var(--color-warm-beige)', paddingTop: '1.5rem' }}>
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="input-field resize-none"
                                    rows="3"
                                    disabled={isTranslating}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <AudioRecorder
                                    onRecordingComplete={handleAudioRecording}
                                    disabled={isTranslating}
                                />

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSendMessage}
                                    disabled={isTranslating || (!inputText.trim() && !audioBlob)}
                                    className="p-3 rounded-full text-white transition-all"
                                    style={{
                                        background: isTranslating || (!inputText.trim() && !audioBlob)
                                            ? 'var(--color-warm-beige)'
                                            : accentColor,
                                        cursor: isTranslating || (!inputText.trim() && !audioBlob) ? 'not-allowed' : 'pointer',
                                        opacity: isTranslating || (!inputText.trim() && !audioBlob) ? 0.5 : 1,
                                    }}
                                >
                                    {isTranslating ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Panel */}
                {showSummary && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{ width: '24rem' }}
                    >
                        <SummaryPanel conversationId={conversationId} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Chat;
