import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ChevronRight, Landmark, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
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
            await register(name, email, password, referralCode);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full glass p-10 md:p-12 rounded-[40px] shadow-2xl border border-white/5 space-y-10"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                            <Landmark className="w-8 h-8 text-accent" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black">Join TopTexPro</h2>
                    <p className="text-text-muted max-w-xs mx-auto text-sm">Start your journey into the world of elite digital asset trading today.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-text-muted uppercase ml-1 mb-2 block">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-background border border-border px-10 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-text-muted uppercase ml-1 mb-2 block">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full bg-background border border-border px-10 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-text-muted uppercase ml-1 mb-2 block">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-background border border-border px-10 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-text-muted uppercase ml-1 mb-2 block">Referral ID (Optional)</label>
                                <div className="relative group">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                        placeholder="REF-123456"
                                        className="w-full bg-background border border-border px-10 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-accent mt-0.5" />
                        <p className="text-[10px] text-text-muted leading-relaxed">By clicking register, you agree to our <span className="text-accent cursor-pointer hover:underline">Terms of Service</span> and acknowledge you understand the risks involved in trading cryptocurrencies.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-500/30 group"
                    >
                        <span>{isLoading ? 'Creating Account...' : 'Create Free Account'}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-text-muted">
                        Already have an account? <Link to="/login" className="text-accent hover:underline font-bold ml-1">Sign in here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
