import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, Copy, Check, AlertCircle } from 'lucide-react';
import { generateSummary } from '../utils/api';

const SummaryPanel = ({ conversationId }) => {
    const [summary, setSummary] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGenerateSummary = async () => {
        if (!conversationId) return;

        setIsGenerating(true);
        setError(null);

        try {
            const data = await generateSummary(conversationId);
            setSummary(data.summary);
        } catch (err) {
            console.error('Error generating summary:', err);
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (summary) {
            const textToCopy = `
MEDICAL CONSULTATION SUMMARY

SYMPTOMS:
${summary.symptoms?.join(', ') || 'None mentioned'}

DIAGNOSES:
${summary.diagnoses?.join(', ') || 'None mentioned'}

MEDICATIONS:
${summary.medications?.join(', ') || 'None mentioned'}

FOLLOW-UP ACTIONS:
${summary.followup_actions?.join('\n') || 'None mentioned'}

FULL SUMMARY:
${summary.full_text || ''}
      `.trim();

            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Summary
                </h2>
                {summary && (
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        title="Copy summary"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-green-600" />
                        ) : (
                            <Copy className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                )}
            </div>

            {!summary && !isGenerating && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-gray-600 mb-4">
                            Generate an AI-powered medical summary
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGenerateSummary}
                            className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        >
                            Generate Summary
                        </motion.button>
                    </div>
                </div>
            )}

            {isGenerating && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
                        <p className="text-gray-600">Analyzing conversation...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {summary && !isGenerating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 overflow-y-auto space-y-4"
                >
                    {summary.symptoms && summary.symptoms.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                🩺 Symptoms
                            </h3>
                            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                                {summary.symptoms.map((symptom, idx) => (
                                    <li key={idx}>{symptom}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {summary.diagnoses && summary.diagnoses.length > 0 && (
                        <div className="bg-purple-50 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                🔬 Diagnoses
                            </h3>
                            <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                                {summary.diagnoses.map((diagnosis, idx) => (
                                    <li key={idx}>{diagnosis}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {summary.medications && summary.medications.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                💊 Medications
                            </h3>
                            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                                {summary.medications.map((medication, idx) => (
                                    <li key={idx}>{medication}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {summary.followup_actions && summary.followup_actions.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-4">
                            <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                                📋 Follow-up Actions
                            </h3>
                            <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                                {summary.followup_actions.map((action, idx) => (
                                    <li key={idx}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {summary.full_text && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Full Summary</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {summary.full_text}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleGenerateSummary}
                        className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                        Regenerate Summary
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SummaryPanel;
