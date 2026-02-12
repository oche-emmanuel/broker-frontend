import {
    TrendingUp,
    Wallet,
    Plus,
    ArrowUpRight,
    Copy,
    AlertCircle,
    Calendar,
    User as UserIcon,
    Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import TradingViewWidget from '../../components/TradingViewWidget';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DashboardHome = () => {
    const { user } = useAuth();
    const [account, setAccount] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/user/profile');
                setAccount(data.account);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    const stats = [
        { title: 'Active Deposits', value: account ? `$${account.activeDeposit.toLocaleString()}` : '$0.00', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Available Balance', value: account ? `$${account.balance.toLocaleString()}` : '$0.00', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Added Bonus', value: account ? `$${account.bonus.toLocaleString()}` : '$0.00', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'Account Manager', value: (account?.manager && account.manager !== 'Unassigned') ? account.manager : 'Sarah Jenkins', icon: UserIcon, color: 'text-orange-500', bg: 'bg-orange-500/10', hideForAdmin: true },
        { title: 'Registration Date', value: user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : '...', icon: Calendar, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    ].filter(s => !(s.hideForAdmin && user?.role === 'admin'));

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black">Welcome back, {user?.name}!</h1>
                    <p className="text-text-muted mt-1">Here's what's happening with your portfolio today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link to="/dashboard/deposit" className="bg-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20">
                        <Plus className="w-5 h-5" />
                        <span>Make a Deposit</span>
                    </Link>
                    <Link to="/dashboard/withdraw" className="bg-secondary hover:bg-white/5 text-white border border-border px-6 py-3 rounded-xl font-bold transition-all">
                        Withdraw Funds
                    </Link>
                </div>
            </div>

            {/* Alert Banner */}
            {user?.accountStatus === 'upgrade_required' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-red-500">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold">Withdrawal Status: <span className="uppercase tracking-widest ml-2">Upgrade Required</span></p>
                    </div>
                    <button className="text-xs font-black uppercase text-red-500 hover:underline">Why this?</button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="card-gradient p-6 rounded-3xl space-y-4"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-xl font-black mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content: Chart & Referral */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trading Chart */}
                <div className="lg:col-span-2 bg-secondary border border-border rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold flex items-center space-x-2">
                            <span>Market Overview</span>
                            <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded uppercase font-black">BTC/USD</span>
                        </h3>
                        <div className="flex space-x-2 text-[10px] font-black uppercase text-text-muted">
                            <button className="px-2 py-1 hover:text-accent">1m</button>
                            <button className="px-2 py-1 text-accent border border-accent/20 rounded bg-accent/5">5m</button>
                            <button className="px-2 py-1 hover:text-accent">1h</button>
                        </div>
                    </div>
                    <div className="flex-grow bg-[#131722]">
                        <TradingViewWidget />
                    </div>
                </div>

                {/* Affiliate Section */}
                <div className="space-y-8">
                    <div className="bg-accent rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                        <Plus className="absolute -top-10 -right-10 w-40 h-40 opacity-10" />
                        <h3 className="text-2xl font-black mb-4">Affiliate Program</h3>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">Earn up to 10% commission by referring other traders to TopTexProTrades.</p>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-blue-200 ml-1">Your Referral Link</label>
                            <div className="flex space-x-2">
                                <input
                                    readOnly
                                    value={`https://toptex.pro/register?ref=${user?.referralCode || ''}`}
                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs flex-grow focus:outline-none"
                                />
                                <button className="p-2 bg-white text-accent rounded-xl hover:bg-blue-50 transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-gradient rounded-[32px] p-8 space-y-6">
                        <h4 className="font-bold border-b border-border pb-4">Top Assets Performance</h4>
                        {[
                            { coin: 'Bitcoin', symbol: 'BTC', change: '+2.41%' },
                            { coin: 'Ethereum', symbol: 'ETH', change: '+1.85%' },
                            { coin: 'Solana', symbol: 'SOL', change: '-3.12%' },
                        ].map((coin, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-xs font-bold">{coin.symbol[0]}</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{coin.coin}</span>
                                        <span className="text-[10px] text-text-muted">{coin.symbol}</span>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold ${coin.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{coin.change}</span>
                            </div>
                        ))}
                        <hr className="border-border" />
                        <Link to="/dashboard/market" className="w-full text-xs font-black uppercase text-accent hover:underline flex items-center justify-center space-x-1">
                            <span>View All Markets</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
