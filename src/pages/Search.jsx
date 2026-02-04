import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search as SearchIcon, Loader, MessageSquare } from 'lucide-react';
import { searchConversations } from '../utils/api';

const Search = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        try {
            const data = await searchConversations(query);
            setResults(data);
        } catch (error) {
            console.error('Error searching:', error);
            alert('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const highlightMatch = (text, query) => {
        if (!text || !query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        );
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
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Search Conversations</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Find keywords and phrases across all conversations
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for symptoms, medications, diagnoses..."
                                className="input-field pl-12 w-full"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className={`btn-primary px-8 ${isSearching || !query.trim()
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                }`}
                        >
                            {isSearching ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                'Search'
                            )}
                        </motion.button>
                    </form>
                </div>

                {isSearching && (
                    <div className="glass-panel p-12 flex items-center justify-center">
                        <div className="text-center">
                            <Loader className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
                            <p className="text-gray-600">Searching conversations...</p>
                        </div>
                    </div>
                )}

                {!isSearching && hasSearched && results.length === 0 && (
                    <div className="glass-panel p-12 text-center">
                        <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                        <p className="text-gray-600 text-lg">No results found for "{query}"</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Try different keywords or check your spelling
                        </p>
                    </div>
                )}

                {!isSearching && results.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-sm text-white/80 mb-4">
                            Found {results.length} result{results.length !== 1 ? 's' : ''}
                        </p>
                        {results.map((result, index) => (
                            <motion.div
                                key={`${result.conversation_id}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="glass-panel p-6 card-hover cursor-pointer"
                                onClick={() => navigate(`/chat/${result.conversation_id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">
                                                Conversation #{result.conversation_id?.slice(0, 8)}
                                            </h3>
                                            <span className="text-xs text-gray-600">
                                                {formatDate(result.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {highlightMatch(result.text || result.original_text, query)}
                                        </p>
                                        {result.context && (
                                            <p className="text-sm text-gray-500 mt-2 italic">
                                                ...{result.context}...
                                            </p>
                                        )}
                                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                {result.sender_role}
                                            </span>
                                            {result.rank && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                                    Relevance: {Math.round((1 - result.rank) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!hasSearched && !isSearching && (
                    <div className="glass-panel p-12 text-center">
                        <SearchIcon className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-gray-600 text-lg">Start searching</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Enter keywords to find specific conversations
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
