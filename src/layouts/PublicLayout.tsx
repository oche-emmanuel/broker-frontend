import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Landmark, Globe, ShieldCheck, Headphones, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-text">
            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border">
                <Link to="/" className="flex items-center space-x-2">
                    <Landmark className="w-8 h-8 text-accent" />
                    <span className="text-xl font-bold tracking-tight">TopTexPro<span className="text-accent">Trades</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === link.path ? 'text-accent' : 'text-text-muted'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center space-x-4 ml-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium hover:text-accent transition-colors flex items-center space-x-1">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-accent transition-colors">Login</Link>
                                <Link to="/register" className="bg-accent hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden fixed inset-x-0 top-[73px] bg-secondary border-b border-border z-40 p-6 flex flex-col space-y-4"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-lg font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border" />
                        <Link to="/login" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link
                            to="/register"
                            className="bg-accent text-white text-center py-3 rounded-lg font-bold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-secondary border-t border-border pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4 col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2">
                            <Landmark className="w-6 h-6 text-accent" />
                            <span className="text-lg font-bold tracking-tight">TopTexPro<span className="text-accent">Trades</span></span>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Leading global crypto broker providing professional trading solutions for investors worldwide. Secure, transparent, and efficient.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
                            <li><Link to="/register" className="hover:text-accent transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Security</h4>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-accent" /> <span>2FA Protection</span></li>
                            <li className="flex items-center space-x-2"><Globe className="w-4 h-4 text-accent" /> <span>Global Compliance</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li className="flex items-center space-x-2"><Headphones className="w-4 h-4 text-accent" /> <span>24/7 Live Support</span></li>
                            <li className="text-xs mt-4">support@toptexprotrades.xyz</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-text-muted space-y-4 md:space-y-0">
                    <p>© 2026 TopTexProTrades. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <span className="hover:text-accent cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-accent cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
