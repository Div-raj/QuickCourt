
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage, User } from '../types';
import { MOCK_CHAT_MESSAGES, SPORTS } from '../constants';
import { SparklesIcon } from '../components/icons';
import { GoogleGenAI } from '@google/genai';

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

const ChatMessageBubble: React.FC<{ message: ChatMessage; currentUser: User | null }> = ({ message, currentUser }) => {
    const isMe = message.user.fullName === currentUser?.fullName;
    const bubbleClasses = isMe ? 'bg-accent text-white' : 'bg-surface text-secondary border border-border';
    const containerClasses = isMe ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex items-end gap-3 ${containerClasses}`}>
            {!isMe && <img src={message.user.avatar} alt={message.user.fullName} className="w-8 h-8 rounded-full" />}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <p className="text-xs text-secondary/70 mb-1 ml-3">{message.user.fullName}</p>}
                <div className={`p-3 rounded-2xl max-w-sm md:max-w-md ${bubbleClasses} ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                    <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-secondary/60 mt-1">{message.timestamp}</p>
            </div>
             {isMe && <img src={message.user.avatar} alt={message.user.fullName} className="w-8 h-8 rounded-full" />}
        </div>
    );
};


const PlayerConnect: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // AI Assistant state
    const [aiDetails, setAiDetails] = useState({ sport: '', location: '', date: '', time: '' });
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent, messageText?: string) => {
        e.preventDefault();
        const textToSend = messageText || newMessage;
        if (!textToSend.trim() || !user) return;

        const message: ChatMessage = {
            id: `cm${Date.now()}`,
            user: { fullName: user.fullName, avatar: user.avatar },
            text: textToSend,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        setGeneratedMessage('');
    };

    const handleGenerateMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!API_KEY) {
            setError("API Key is not configured. Please contact support.");
            return;
        }
        setIsGenerating(true);
        setError('');
        setGeneratedMessage('');

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const prompt = `You are a helpful AI assistant for QuickCourt, a sports booking app. Your goal is to help users find other players by writing a friendly and clear message for a public chat room. A user wants to play a game. Generate a short, enthusiastic, and inviting message (around 20-40 words) based on these details. Don't use markdown or special formatting.
            - Sport: ${aiDetails.sport || 'any sport'}
            - Location/Venue: ${aiDetails.location || 'around the area'}
            - Date: ${aiDetails.date || 'soon'}
            - Time: ${aiDetails.time || 'anytime'}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setGeneratedMessage(response.text.trim());
        } catch (err) {
            console.error("Gemini API error:", err);
            setError("Sorry, I couldn't generate a message right now. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const commonInputClass = "w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent bg-surface text-secondary";

    return (
        <div className="bg-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-secondary">Player Connect</h1>
                    <p className="text-secondary/80 mt-2 max-w-2xl mx-auto">Find fellow players for a game! Post a message or use our AI assistant to help you write one.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Section */}
                    <div className="lg:col-span-2 bg-surface rounded-2xl shadow-xl-soft flex flex-col h-[75vh] border border-border">
                        <div className="p-4 border-b border-border font-bold text-lg text-secondary">Community Chat</div>
                        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                            {messages.map(msg => (
                                <ChatMessageBubble key={msg.id} message={msg} currentUser={user} />
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-4 border-t border-border bg-surface rounded-b-2xl">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full p-3 border border-border rounded-full focus:ring-2 focus:ring-accent focus:border-accent transition bg-primary/40 text-secondary"
                                />
                                <button type="submit" className="bg-accent text-white font-semibold rounded-full p-3 hover:bg-accent-dark transition-transform transform hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.534h6.056a.75.75 0 0 1 0 1.5H4.644a.75.75 0 0 0-.95.534l-1.414 4.949a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* AI Assistant Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface rounded-2xl shadow-xl-soft sticky top-24 border border-border">
                            <div className="p-4 border-b border-border flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-accent"/>
                                <h3 className="font-bold text-lg text-secondary">AI Message Assistant</h3>
                            </div>
                            <form onSubmit={handleGenerateMessage} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-1">Sport</label>
                                    <select value={aiDetails.sport} onChange={e => setAiDetails({...aiDetails, sport: e.target.value})} className={commonInputClass}>
                                        <option value="">Any Sport</option>
                                        {SPORTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-sm font-bold text-secondary mb-1">Location / Venue</label>
                                    <input type="text" placeholder="e.g., Urban Sports Hub" value={aiDetails.location} onChange={e => setAiDetails({...aiDetails, location: e.target.value})} className={commonInputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-secondary mb-1">Date</label>
                                        <input type="date" value={aiDetails.date} onChange={e => setAiDetails({...aiDetails, date: e.target.value})} className={commonInputClass} min={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-secondary mb-1">Time</label>
                                        <input type="time" value={aiDetails.time} onChange={e => setAiDetails({...aiDetails, time: e.target.value})} className={commonInputClass} />
                                    </div>
                                </div>
                                <button type="submit" disabled={isGenerating} className="w-full flex justify-center items-center gap-2 bg-accent text-white font-bold py-2.5 rounded-lg hover:bg-accent-dark transition disabled:bg-opacity-50">
                                    {isGenerating ? 'Generating...' : 'Generate Message'}
                                </button>
                            </form>
                            {(generatedMessage || error) && (
                                <div className="px-6 pb-6">
                                    <label className="block text-sm font-medium text-secondary/80 mb-1">Generated Message</label>
                                     <textarea
                                        readOnly
                                        value={generatedMessage || error}
                                        className={`w-full p-2 border rounded-md text-sm ${error ? 'border-red-300 bg-red-50 text-red-700' : 'border-border bg-primary/40'}`}
                                        rows={4}
                                    />
                                    {generatedMessage && !error && (
                                         <button onClick={(e) => handleSendMessage(e, generatedMessage)} className="w-full mt-2 bg-accent text-white font-semibold py-2 rounded-lg hover:bg-accent-dark transition">
                                            Post to Chat
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerConnect;
