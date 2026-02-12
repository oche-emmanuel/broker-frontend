import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass p-10 rounded-[32px] shadow-2xl border border-white/5 space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                            <Landmark className="w-8 h-8 text-accent" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold">Welcome Back</h2>
                    <p className="text-text-muted">Sign in to manage your portfolio</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-text-muted uppercase ml-1 mb-2 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-background border border-border px-12 py-4 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center ml-1 mb-2">
                                <label className="text-xs font-bold text-text-muted uppercase block">Password</label>
                                <button type="button" className="text-xs text-accent hover:underline font-semibold">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border px-12 py-4 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-500/20 group"
                    >
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-text-muted">
                        Don't have an account? <Link to="/register" className="text-accent hover:underline font-bold ml-1">Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
