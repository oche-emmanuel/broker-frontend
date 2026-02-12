import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Search, Send, MessageSquare, Headphones, Hash } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { motion } from 'framer-motion';

interface Message {
    userId: string;
    text: string;
    sender: 'user' | 'admin';
    time: string;
}

interface Conversation {
    _id: string;
    lastMessage: string;
    lastTime: string;
    user: {
        name: string;
        email: string;
    };
}

const AdminChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user) return;

        // Connect to socket
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://broker-backend-vm3w.onrender.com';
        socketRef.current = io(socketUrl, {
            query: { userId: user._id }
        });

        socketRef.current.on('connect', () => {
            if (selectedUserId) {
                socketRef.current?.emit('join', selectedUserId);
            }
        });

        // Listen for all messages (admins need to know when ANY user messages)
        socketRef.current.on('message', (msg: Message) => {
            // Update conversation list if it's a new message
            setConversations(prev => {
                const index = prev.findIndex(c => c._id === msg.userId);
                const updated = [...prev];
                if (index !== -1) {
                    updated[index].lastMessage = msg.text;
                    updated[index].lastTime = msg.time;
                    // Move to top
                    const item = updated.splice(index, 1)[0];
                    updated.unshift(item);
                } else {
                    // This is a bit tricky since we don't have the user object here easily
                    // But fetchConversations will catch it eventually or we can refetch
                    fetchConversations();
                }
                return updated;
            });

            // If this message belongs to the currently selected user, add it to chat
            if (msg.userId === selectedUserId) {
                setMessages(prev => [...prev, msg]);
            }
        });

        fetchConversations();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user, selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/admin/chat/conversations');
            setConversations(data);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
        }
    };

    const fetchUserMessages = async (userId: string) => {
        try {
            const { data } = await api.get(`/admin/chat/${userId}`);
            setMessages(data);
            setSelectedUserId(userId);
            // Join this user's specific room
            socketRef.current?.emit('join', userId);
        } catch (err) {
            console.error('Failed to fetch user messages', err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId) return;

        const text = newMessage;
        setNewMessage('');

        try {
            // Emit via socket
            socketRef.current?.emit('sendMessage', {
                userId: selectedUserId,
                text,
                sender: 'admin'
            });
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-12rem)] flex bg-secondary border border-border rounded-[40px] overflow-hidden">
            {/* Sidebar: Conversations */}
            <div className="w-80 border-r border-border flex flex-col bg-background/30">
                <div className="p-6 border-b border-border space-y-4">
                    <h3 className="font-black italic flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-accent" />
                        <span>Support Inbox</span>
                    </h3>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Find character..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary border border-border pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-accent"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto scrollbar-hide">
                    {filteredConversations.length === 0 ? (
                        <div className="p-10 text-center opacity-30 space-y-2">
                            <Headphones className="w-8 h-8 mx-auto" />
                            <p className="text-[10px] uppercase font-black tracking-widest">No active chats</p>
                        </div>
                    ) : filteredConversations.map((conv) => (
                        <button
                            key={conv._id}
                            onClick={() => fetchUserMessages(conv._id)}
                            className={`w-full p-6 text-left border-b border-border flex items-start space-x-4 transition-all hover:bg-white/5 ${selectedUserId === conv._id ? 'bg-accent/5 border-l-4 border-l-accent' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-black uppercase shadow-inner">
                                {conv.user.name[0]}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm truncate">{conv.user.name}</span>
                                    <span className="text-[8px] text-text-muted uppercase">{new Date(conv.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-text-muted truncate italic">"{conv.lastMessage}"</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main: Chat Area */}
            <div className="flex-grow flex flex-col bg-background/10">
                {selectedUserId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between bg-white/5 backdrop-blur-sm">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-black">
                                    {conversations.find(c => c._id === selectedUserId)?.user.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-sm">{conversations.find(c => c._id === selectedUserId)?.user.name}</h4>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Customer Support Session</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-500/20">Active</div>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted"><Hash className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.sender === 'admin' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.sender === 'admin'
                                            ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-blue-500/20'
                                            : 'bg-secondary border border-border rounded-tl-none shadow-xl'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[8px] uppercase font-black tracking-widest text-text-muted ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                            {msg.sender} • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 bg-secondary/30 border-t border-border">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your response to the character..."
                                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm pr-16"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-accent text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30 p-10 text-center">
                        <div className="w-24 h-24 bg-accent/10 rounded-[32px] flex items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-accent" />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="text-xl font-black italic">Select a Conversation</h3>
                            <p className="text-sm">Choose a user from the left panel to begin replying to their support requests.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
