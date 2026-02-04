import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, History, Search, Languages, User, Stethoscope } from 'lucide-react';

const Home = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const handleStartConversation = () => {
        if (selectedRole) {
            navigate(`/chat/new?role=${selectedRole}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
            <div className="w-full max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-light mb-3" style={{ color: 'var(--color-charcoal)' }}>
                        MediTranslate
                    </h1>
                    <p className="text-base font-light tracking-wide" style={{ color: 'var(--color-stone)' }}>
                        MEDICAL TRANSLATION
                    </p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <p className="text-sm font-light tracking-widest text-center mb-8" style={{ color: 'var(--color-stone)' }}>
                        SELECT YOUR ROLE
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Doctor Card */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedRole('doctor')}
                            className="glass-panel text-left transition-all duration-200"
                            style={{
                                border: selectedRole === 'doctor' ? '2px solid var(--color-indigo)' : '1px solid var(--color-warm-beige)',
                                background: selectedRole === 'doctor' ? 'white' : 'var(--color-sand)',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--color-indigo)' }}
                                >
                                    <Stethoscope className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                                        Doctor
                                    </h3>
                                    <p className="text-sm font-light" style={{ color: 'var(--color-stone)' }}>
                                        Providing medical care
                                    </p>
                                </div>
                            </div>
                        </motion.button>

                        {/* Patient Card */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedRole('patient')}
                            className="glass-panel text-left transition-all duration-200"
                            style={{
                                border: selectedRole === 'patient' ? '2px solid var(--color-sage)' : '1px solid var(--color-warm-beige)',
                                background: selectedRole === 'patient' ? 'white' : 'var(--color-sand)',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--color-sage)' }}
                                >
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                                        Patient
                                    </h3>
                                    <p className="text-sm font-light" style={{ color: 'var(--color-stone)' }}>
                                        Seeking medical care
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    {/* Start Button */}
                    <div className="text-center mt-8">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartConversation}
                            disabled={!selectedRole}
                            className="btn-primary px-12 py-4"
                            style={{
                                opacity: selectedRole ? 1 : 0.4,
                                cursor: selectedRole ? 'pointer' : 'not-allowed',
                            }}
                        >
                            Start New Conversation
                        </motion.button>
                    </div>
                </motion.div>

                {/* Zen Divider */}
                <div className="zen-divider"></div>

                {/* Navigation Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-3 gap-6 mb-12"
                >
                    {/* History */}
                    <button
                        onClick={() => navigate('/history')}
                        className="glass-panel card-hover text-center"
                    >
                        <History className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-stone)' }} />
                        <h3 className="font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                            Conversation History
                        </h3>
                        <p className="text-sm font-light" style={{ color: 'var(--color-stone)' }}>
                            View past conversations
                        </p>
                    </button>

                    {/* Search */}
                    <button
                        onClick={() => navigate('/search')}
                        className="glass-panel card-hover text-center"
                    >
                        <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-stone)' }} />
                        <h3 className="font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                            Search
                        </h3>
                        <p className="text-sm font-light" style={{ color: 'var(--color-stone)' }}>
                            Find specific conversations
                        </p>
                    </button>

                    {/* Languages */}
                    <div className="glass-panel text-center">
                        <Languages className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-stone)' }} />
                        <h3 className="font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                            30+ Languages
                        </h3>
                        <p className="text-sm font-light" style={{ color: 'var(--color-stone)' }}>
                            Powered by DeepL
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs font-light" style={{ color: 'var(--color-stone)', letterSpacing: '0.1em' }}>
                        Breaking language barriers in healthcare
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
