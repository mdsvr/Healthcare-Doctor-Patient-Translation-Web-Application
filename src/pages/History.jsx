import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Calendar, Trash2, Loader } from 'lucide-react';
import { getConversations } from '../utils/api';
import { supabase } from '../config/supabase';

const History = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConversation = async (id) => {
        if (!confirm('Are you sure you want to delete this conversation?')) return;

        try {
            await supabase.from('conversations').delete().eq('id', id);
            setConversations(prev => prev.filter(conv => conv.id !== id));
        } catch (error) {
            console.error('Error deleting conversation:', error);
            alert('Failed to delete conversation');
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <div className="glass-panel p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Conversation History</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage past conversations
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="glass-panel p-12 flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="glass-panel p-12 text-center">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                        <p className="text-gray-600 text-lg">No conversations yet</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 btn-primary bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        >
                            Start Your First Conversation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {conversations.map((conv, index) => (
                            <motion.div
                                key={conv.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="glass-panel p-6 card-hover cursor-pointer group"
                                onClick={() => navigate(`/chat/${conv.id}`)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MessageSquare className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-semibold text-lg">
                                                Conversation #{conv.id.slice(0, 8)}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(conv.created_at)}
                                            </span>
                                            <span>
                                                🩺 {conv.doctor_language} ↔️ 🧑 {conv.patient_language}
                                            </span>
                                            <span>
                                                {conv.message_count || 0} message{conv.message_count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConversation(conv.id);
                                        }}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
