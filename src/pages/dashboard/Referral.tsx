import {
    Users,
    Gift,
    Copy,
    Trophy,
    BarChart3,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Referral = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const stats = [
        { label: 'Total Referrals', value: referrals.length.toString(), icon: Users, color: 'text-blue-500' },
        { label: 'Active Referrals', value: referrals.filter(r => r.accountStatus === 'Active').length.toString(), icon: Zap, color: 'text-yellow-500' },
        { label: 'Bonus Earned', value: '$0.00', icon: Gift, color: 'text-accent' }, // Bonus tracking can be added later
        { label: 'Current Level', value: referrals.length > 50 ? 'Platinum' : referrals.length > 10 ? 'Gold' : 'Silver', icon: Trophy, color: 'text-orange-500' },
    ];

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const { data } = await api.get('/referrals');
                setReferrals(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReferrals();
    }, []);

    const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || ''}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 pb-10">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black">Referral Program</h1>
                <p className="text-text-muted mt-2">Earn passive income by growing the TopTexProTrades community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="card-gradient p-8 rounded-[32px] space-y-4"
                    >
                        <div className={`w-12 h-12 bg-white/5 ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-gradient p-10 rounded-[40px] space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-all" />
                        <div className="space-y-4 max-w-lg relative">
                            <h3 className="text-2xl font-black italic">Passive Income While You Trade</h3>
                            <p className="text-text-muted text-sm leading-relaxed">Share your unique link with your network. When they join and start trading, you receive <span className="text-white font-bold">10% commission</span> on every deposit they make, paid instantly to your wallet.</p>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase text-text-muted ml-1">Your Unique Referral Link</label>
                            <div className="flex space-x-4">
                                <div className="flex-grow bg-background border border-border px-6 py-4 rounded-2xl font-mono text-xs flex items-center overflow-hidden">
                                    {referralLink}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="bg-accent hover:bg-blue-600 text-white px-8 rounded-2xl font-black uppercase text-xs flex items-center space-x-2 transition-all shadow-xl shadow-blue-500/20"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                            <h4 className="font-bold flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5 text-accent" />
                                <span>Progression Rewards</span>
                            </h4>
                            <ul className="text-xs text-text-muted space-y-3">
                                <li className="flex items-center justify-between"><span>Silver (0-10 refs)</span> <span className="font-bold text-white">5%</span></li>
                                <li className="flex items-center justify-between"><span>Gold (11-50 refs)</span> <span className="font-bold text-accent">10%</span></li>
                                <li className="flex items-center justify-between"><span>Platinum (50+ refs)</span> <span className="font-bold text-white">15%</span></li>
                            </ul>
                        </div>
                        <div className="p-8 bg-surface border border-border rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Top referrer this week</p>
                                <p className="text-xl font-black">$5,240 bonus</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="font-black uppercase tracking-widest text-xs ml-1">Recent Referrals</h4>
                    <div className="space-y-3">
                        {isLoading ? (
                            <p className="text-xs text-text-muted p-4">Loading referrals...</p>
                        ) : referrals.length === 0 ? (
                            <p className="text-xs text-text-muted p-4">No referrals yet.</p>
                        ) : referrals.map((ref, i) => (
                            <div key={i} className="card-gradient p-5 rounded-2xl flex items-center justify-between group hover:border-accent/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{ref.name[0]}</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{ref.name}</span>
                                        <span className="text-[10px] text-text-muted">{ref.accountStatus}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-accent uppercase tracking-tighter">{new Date(ref.registrationDate).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 border border-border rounded-2xl text-xs font-black uppercase text-text-muted hover:text-white transition-colors">
                        View All Referrals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Referral;
