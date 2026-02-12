import { TrendingUp, PieChart, Users, ShieldCheck, Zap, BarChart, HardDrive, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services = () => {
    const handleSupportClick = () => {
        window.dispatchEvent(new CustomEvent('open-support-chat'));
    };
    const mainServices = [
        { icon: TrendingUp, title: 'Crypto Spot Trading', desc: 'Trade major cryptocurrencies with tight spreads and deep liquidity on our advanced matching engine.' },
        { icon: PieChart, title: 'Portfolio Management', desc: 'Automated tools and institutional-grade analytics to help you manage and grow your digital assets portfolio.' },
        { icon: Users, title: 'Elite Affiliate Program', desc: 'One of the industry\'s highest-paying referral programs with instant payouts and tiered bonuses.' },
        { icon: ShieldCheck, title: 'Asset Security', desc: 'Multi-signature cold storage and advanced encryption protocols to ensure your funds represent maximum safety.' },
    ];

    const features = [
        { title: 'Lightning Fast Execution', icon: Zap },
        { title: 'In-Depth Market Analysis', icon: BarChart },
        { title: 'API Integration Access', icon: HardDrive },
        { title: 'Mobile Trading App', icon: Smartphone },
    ];

    return (
        <div className="space-y-32 pb-32 pt-20 px-6">
            <section className="max-w-7xl mx-auto text-center space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase">Institutional <br /><span className="text-accent">Solutions</span></h1>
                    <p className="text-text-muted text-xl max-w-2xl mx-auto">Discover the suite of professional tools and services designed to give you the competitive edge in digital asset markets.</p>
                </motion.div>
            </section>

            <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mainServices.map((service, i) => (
                    <motion.div
                        whileHover={{ y: -10 }}
                        key={i}
                        className="card-gradient p-10 rounded-[40px] space-y-6 flex flex-col items-center text-center border-border group"
                    >
                        <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/10">
                            <service.icon className="w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">{service.title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{service.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </section>

            <section className="bg-accent rounded-[48px] max-w-7xl mx-auto p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-blue-500/20">
                <div className="absolute top-0 left-0 w-full h-full bg-black/5 pointer-events-none" />
                <div className="lg:w-1/2 space-y-8 relative">
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Trade Anywhere, <br />At Any Time.</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">Our infrastructure is built for maximum uptime and reliability, ensuring you never miss a market opportunity. Whether on desktop or mobile, the experience is seamless.</p>
                    <div className="grid grid-cols-2 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center space-x-3 text-white">
                                <div className="p-2 bg-white/10 rounded-lg"><f.icon className="w-5 h-5" /></div>
                                <span className="text-xs font-bold uppercase tracking-wider">{f.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:w-1/3 relative">
                    <div className="card-gradient border-white/20 p-8 rounded-[40px] shadow-2xl space-y-6 backdrop-blur-3xl transform lg:-rotate-6">
                        <div className="h-40 w-full bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                            <TrendingUp className="w-12 h-12 text-white/20" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-3/4 bg-white/10 rounded" />
                            <div className="h-4 w-1/2 bg-white/10 rounded" />
                        </div>
                        <div className="pt-4 flex justify-between">
                            <div className="h-8 w-8 bg-white/20 rounded-full" />
                            <div className="h-8 w-24 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-lg">LIVE FEED</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-center space-y-12">
                <h2 className="text-4xl font-black italic uppercase">Ready to Start?</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/register" className="w-full sm:w-auto bg-white text-background px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-center">REGISTER NOW</Link>
                    <button
                        onClick={handleSupportClick}
                        className="w-full sm:w-auto border border-border px-12 py-5 rounded-2xl font-black transition-all hover:bg-white/5"
                    >
                        TALK TO SUPPORT
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Services;
