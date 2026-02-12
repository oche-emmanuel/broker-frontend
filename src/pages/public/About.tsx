import { Shield, Users, Globe, Award, Target, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="space-y-32 pb-32 pt-20">
            {/* Hero */}
            <section className="px-6 max-w-7xl mx-auto text-center space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black leading-tight">Empowering Global <br /><span className="text-accent underline">Digital Wealth</span></h1>
                    <p className="text-text-muted text-xl max-w-3xl mx-auto">Founded in 2018, TopTexProTrades has grown from a specialized trading desk to a world-leading crypto broker serving over 500,000 clients across 120 countries.</p>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="px-6 bg-secondary/30 py-20 border-y border-border overflow-hidden relative">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    {[
                        { label: 'Founded', value: '2018' },
                        { label: 'Active Users', value: '500K+' },
                        { label: 'Daily Trade Vol', value: '$2.4B+' },
                        { label: 'Support Agents', value: '150+' },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <p className="text-4xl md:text-5xl font-black text-accent">{stat.value}</p>
                            <p className="text-xs font-black uppercase text-text-muted tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
                    <Globe className="w-[1000px] h-[1000px] -ml-[200px] -mt-[100px]" />
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="card-gradient p-12 rounded-[48px] space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                        <Target className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-3xl font-black italic">Our Mission</h3>
                    <p className="text-text-muted leading-loose">To democratize access to institutional-grade trading tools and provide a secure, transparent environment where every investor, regardless of capital size, can participate in the digital economy effectively.</p>
                </div>
                <div className="card-gradient p-12 rounded-[48px] space-y-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                        <Heart className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-3xl font-black italic">Our Vision</h3>
                    <p className="text-text-muted leading-loose">Becoming the world's most trusted partner in crypto-brokering by continuously innovating our technology, maintaining strict regulatory compliance, and prioritizing client security above all else.</p>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-black lowercase">/// our_core_values</h2>
                    <p className="text-text-muted">The principles that guide every decision we make.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: 'Absolute Integrity', desc: 'We operate with total transparency and ethical standards in all market interactions.' },
                        { icon: Award, title: 'Excellence', desc: 'We strive for perfection in our execution speed, platform uptime, and client support.' },
                        { icon: Users, title: 'Client First', desc: 'Our success is measured solely by the success and satisfaction of our trading community.' },
                    ].map((v, i) => (
                        <div key={i} className="text-center space-y-6">
                            <div className="w-20 h-20 bg-accent rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 transform rotate-12">
                                <v.icon className="w-10 h-10 text-white -rotate-12" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold">{v.title}</h4>
                                <p className="text-text-muted text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
