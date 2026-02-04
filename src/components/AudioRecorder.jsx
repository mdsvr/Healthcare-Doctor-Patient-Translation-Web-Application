import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioRecorder = ({ onRecordingComplete, disabled = false }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);

                if (onRecordingComplete) {
                    onRecordingComplete(audioBlob);
                }

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3">
            {!isRecording && !audioURL && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startRecording}
                    disabled={disabled}
                    className={`p-3 rounded-full transition-all duration-300 ${disabled
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg text-white'
                        }`}
                    title="Start recording"
                >
                    <Mic className="w-5 h-5" />
                </motion.button>
            )}

            {isRecording && (
                <div className="flex items-center gap-3 animate-fade-in">
                    <div className="flex items-center bg-red-100 px-4 py-2 rounded-full">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                        <span className="text-sm font-medium text-red-700">
                            {formatTime(recordingTime)}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={stopRecording}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300"
                        title="Stop recording"
                    >
                        <Square className="w-5 h-5" />
                    </motion.button>
                </div>
            )}

            {audioURL && !isRecording && (
                <div className="flex items-center gap-3 animate-fade-in">
                    <audio
                        ref={audioRef}
                        src={audioURL}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlayback}
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </motion.button>
                    <div className="text-sm text-gray-600">
                        Recording ready
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
