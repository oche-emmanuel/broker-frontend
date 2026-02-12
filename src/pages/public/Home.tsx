import { ArrowRight, Bitcoin, Cpu, Globe, Lock, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const assets = [
        { name: 'Bitcoin', symbol: 'BTC', price: '$48,230.15', change: '+2.4%' },
        { name: 'Ethereum', symbol: 'ETH', price: '$2,450.80', change: '+1.8%' },
        { name: 'Tether', symbol: 'USDT', price: '$1.00', change: '0.0%' },
        { name: 'Litecoin', symbol: 'LTC', price: '$72.45', change: '-0.5%' },
        { name: 'Ripple', symbol: 'XRP', price: '$0.54', change: '+3.2%' },
    ];

    const plans = [
        { name: 'Starter', min: '$500', max: '$5,000', profit: '1.5%', duration: '24 Hours' },
        { name: 'Professional', min: '$5,000', max: '$20,000', profit: '2.5%', duration: '48 Hours' },
        { name: 'Enterprise', min: '$20,000', max: 'Unlimited', profit: '5.0%', duration: '7 Days' },
    ];

    return (
        <div className="space-y-32 pb-32">
            {/* Hero Section */}
            <section className="relative pt-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:w-1/2 space-y-8"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3" />
                            <span>Next-Gen Trading Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                            Trade Crypto with <span className="text-accent underline decoration-blue-500/30">Zero Limits</span>
                        </h1>
                        <p className="text-xl text-text-muted leading-relaxed max-w-lg">
                            Unlock the power of digital assets. Our professional-grade platform offers lightning-fast execution and institutional security.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            {user ? (
                                <Link to="/dashboard" className="w-full sm:w-auto bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2">
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <Link to="/register" className="w-full sm:w-auto bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/30">
                                    Join Now Free
                                </Link>
                            )}
                            <Link to="/about" className="w-full sm:w-auto flex items-center justify-center space-x-2 text-text hover:text-accent font-semibold transition-colors">
                                <span>Learn More</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="md:w-1/2 mt-20 md:mt-0 relative"
                    >
                        <div className="relative z-10 p-4 bg-surface/50 backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2000&auto=format&fit=crop"
                                alt="Trading Dashboard"
                                className="rounded-2xl"
                            />
                            <div className="absolute -bottom-10 -left-10 p-6 glass rounded-2xl hidden lg:block">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-green-500/20 rounded-full"><TrendingUp className="text-green-500" /></div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase">Daily Volume</p>
                                        <p className="text-xl font-bold">$12.4B+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 blur-[150px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-900/10 blur-[100px] -z-10 rounded-full" />
            </section>

            {/* Assets Ticker */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto py-12 border-y border-border overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[800px] px-4">
                        {assets.map((asset) => (
                            <div key={asset.symbol} className="flex items-center space-x-6 group">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/20 transition-colors">
                                    <Bitcoin className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold opacity-70">{asset.symbol}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${asset.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {asset.change}
                                        </span>
                                    </div>
                                    <p className="font-mono text-lg">{asset.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-6 max-w-7xl mx-auto scroll-mt-24">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold">Why Trade with Us?</h2>
                    <p className="text-text-muted max-w-2xl mx-auto">Experience the future of finance with institutional-grade tools and unwavering security.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Lock, title: 'Safe & Secure', desc: 'Industry-leading encryption and cold storage for all digital assets.' },
                        { icon: Globe, title: 'Global Access', desc: 'Trade from anywhere in the world with our optimized global network.' },
                        { icon: Cpu, title: 'Advanced Engine', desc: 'Lightning-fast matching engine with minimal latency and slippage.' },
                    ].map((benefit, i) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={i}
                            className="p-8 rounded-3xl bg-surface border border-border hover:border-accent transition-all group"
                        >
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                                <benefit.icon className="w-7 h-7 text-accent group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                            <p className="text-text-muted leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Investment Plans */}
            <section className="px-6 py-32 bg-secondary/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold">Investment Plans</h2>
                        <p className="text-text-muted">Choose a plan that fits your financial goals.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[40px] border flex flex-col items-center text-center space-y-8 transition-all hover:scale-105 ${i === 1 ? 'bg-accent text-white border-transparent shadow-2xl shadow-blue-500/40 relative' : 'bg-surface border-border'}`}>
                                {i === 1 && <span className="absolute -top-4 bg-white text-accent px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Recommended</span>}
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    <div className="text-4xl font-black">{plan.profit} <span className="text-sm font-medium opacity-70">Daily</span></div>
                                </div>
                                <ul className="space-y-4 text-sm font-medium w-full">
                                    <li className="flex justify-between border-b border-white/10 pb-2"><span>Min Deposit</span> <span>{plan.min}</span></li>
                                    <li className="flex justify-between border-b border-white/10 pb-2"><span>Max Deposit</span> <span>{plan.max}</span></li>
                                    <li className="flex justify-between pb-2"><span>Duration</span> <span>{plan.duration}</span></li>
                                </ul>
                                <Link to="/register" className={`w-full py-4 rounded-2xl font-bold transition-colors ${i === 1 ? 'bg-white text-accent hover:bg-gray-100' : 'bg-accent text-white hover:bg-blue-600'}`}>
                                    Select Plan
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Referral */}
            <section className="px-6 max-w-7xl mx-auto">
                <div className="card-gradient rounded-[48px] p-8 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold">Refer & Earn <br /><span className="text-accent underline">10% Commission</span></h2>
                        <p className="text-text-muted text-lg">Invite your friends to TopTexProTrades and receive a bonus for every successful trade they make. Growing the community pays off!</p>
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(n => <div key={n} className="w-12 h-12 rounded-full border-4 border-surface bg-primary" />)}
                            </div>
                            <p className="text-sm font-bold">Join 50,000+ happy traders</p>
                        </div>
                        <Link to="/register" className="inline-block bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20">
                            Start Referring
                        </Link>
                    </div>
                    <div className="md:w-1/3 perspective-1000">
                        <div className="transform rotate-y-12 rotate-x-12 p-8 glass rounded-3xl border border-accent/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-accent">Affiliate Bonus</span>
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div className="text-4xl font-mono font-black mb-2">$5,240.00</div>
                            <p className="text-xs text-text-muted">Total referral bonus earned this month</p>
                            <div className="mt-8 flex justify-between items-end">
                                <div className="h-12 w-2 rounded-full bg-accent/20" />
                                <div className="h-20 w-2 rounded-full bg-accent/20" />
                                <div className="h-16 w-2 rounded-full bg-accent/20" />
                                <div className="h-32 w-2 rounded-full bg-accent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
