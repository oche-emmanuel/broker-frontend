import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowDownCircle,
    ArrowUpCircle,
    History,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ShieldCheck,
    UserCircle,
    MessageSquare,
    Settings as SettingsIcon
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Deposit', path: '/dashboard/deposit', icon: ArrowDownCircle },
        { name: 'Withdraw', path: '/dashboard/withdraw', icon: ArrowUpCircle },
        { name: 'History', path: '/dashboard/history', icon: History },
        { name: 'Referrals', path: '/dashboard/referrals', icon: Users },
        { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ name: 'Admin Panel', path: '/dashboard/admin', icon: ShieldCheck });
        menuItems.push({ name: 'Support Chat', path: '/dashboard/admin/chat', icon: MessageSquare });
    }

    return (
        <div className="min-h-screen bg-background text-text flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-secondary sticky top-0 h-screen">
                <div className="p-6 border-b border-border flex items-center space-x-2">
                    <ShieldCheck className="w-8 h-8 text-accent" />
                    <span className="text-xl font-bold tracking-tight">Trader<span className="text-accent">Portal</span></span>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                ? 'bg-accent text-white shadow-lg shadow-blue-500/20'
                                : 'text-text-muted hover:bg-primary/10 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-text-muted hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col w-full">
                {/* Top Navbar */}
                <header className="h-20 border-b border-border bg-secondary/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button className="lg:hidden text-text" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verify Account</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex flex-col items-end">
                            <div className="flex items-center space-x-2">
                                {user?.role === 'admin' && (
                                    <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-red-500/20">Admin</span>
                                )}
                                <span className="text-sm font-bold">{user?.name || 'User'}</span>
                            </div>
                            <span className="text-[10px] text-text-muted uppercase tracking-wider">{user?.role === 'admin' ? 'System Administrator' : 'Trading Account'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-accent/30">
                            <UserCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-secondary z-50 lg:hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ShieldCheck className="w-8 h-8 text-accent" />
                                    <span className="text-xl font-bold">TraderPortal</span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
                            </div>
                            <nav className="p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all ${location.pathname === item.path
                                            ? 'bg-accent text-white'
                                            : 'text-text-muted hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
