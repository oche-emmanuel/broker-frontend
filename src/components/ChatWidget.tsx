import {
    MessageSquare,
    Send,
    X,
    User,
    Bot,
    Sparkles,
    Headphones
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!user) return;

        // Connect to socket
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://broker-backend-vm3w.onrender.com';
        socketRef.current = io(socketUrl, {
            query: { userId: user._id }
        });

        // Join room on connect
        socketRef.current.on('connect', () => {
            socketRef.current?.emit('join', user._id);
            console.log('Connected and joined room:', user._id);
        });

        // Listen for messages
        socketRef.current.on('message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        // Fetch history
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/chat');
                setMessages(data);
            } catch (err) {
                console.error('Failed to fetch chat history', err);
            }
        };
        fetchHistory();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-support-chat', handleOpenChat);
        return () => window.removeEventListener('open-support-chat', handleOpenChat);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        const text = message;
        setMessage('');

        try {
            socketRef.current?.emit('sendMessage', {
                userId: user._id,
                text,
                sender: 'user'
            });
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[90vw] md:w-96 h-[500px] mb-6 glass rounded-[32px] overflow-hidden flex flex-col shadow-2xl border border-white/10 ring-1 ring-white/5"
                    >
                        {/* Header */}
                        <div className="p-6 bg-accent flex items-center justify-between text-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                                    <Headphones className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Customer Support</h4>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.length === 0 && (
                                <div className="text-center py-10 opacity-50 space-y-2">
                                    <Bot className="w-8 h-8 mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Support is online</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-end space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary' : 'bg-surface border border-border'}`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-accent" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-blue-500/10' : 'bg-surface border border-border text-text rounded-tl-none'}`}>
                                            {msg.text}
                                            <div className={`text-[8px] mt-1.5 opacity-50 font-black uppercase ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-secondary border-t border-border">
                            <div className="relative group">
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-accent transition-all pr-12"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-white transition-colors">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 ${isOpen ? 'bg-secondary border border-border' : 'bg-accent shadow-blue-500/40'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : (
                    <div className="relative">
                        <MessageSquare className="w-7 h-7" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-accent" />
                    </div>
                )}
            </button>

            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mr-24 mb-4 fixed bottom-9 right-8 hidden md:flex items-center space-x-3 bg-secondary border border-border p-3 rounded-2xl shadow-xl pointer-events-none"
                >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <p className="text-[10px] font-black uppercase text-text-muted tracking-widest whitespace-nowrap">Need help? We're online</p>
                </motion.div>
            )}
        </div>
    );
};

export default ChatWidget;
