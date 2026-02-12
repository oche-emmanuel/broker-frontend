import { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user, refreshProfile } = useAuth();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSetPin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) return alert('PIN must be at least 4 digits');
        if (pin !== confirmPin) return alert('PINs do not match');

        setIsLoading(true);
        try {
            await api.post('/user/set-pin', { pin });
            await refreshProfile();
            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to set PIN');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-10">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-2xl">
                    <Lock className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h1 className="text-3xl font-black italic">Security Settings</h1>
                    <p className="text-text-muted text-sm capitalize">Protect your assets with a withdrawal PIN.</p>
                </div>
            </div>

            <div className="card-gradient p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/5">
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 py-10"
                        >
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-green-500/5 rounded-full"
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black italic">Account Secured</h3>
                                <p className="text-text-muted leading-relaxed">Your withdrawal security PIN has been successfully established. All future withdrawal requests will now require this authorization code.</p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => window.location.href = '/dashboard/withdraw'}
                                    className="w-full py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Go to Withdrawals
                                </button>
                            </div>
                        </motion.div>
                    ) : user?.hasWithdrawalPin ? (
                        <motion.div
                            key="existing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 py-10"
                        >
                            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-12 h-12 text-blue-500" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black italic">Security Active</h3>
                                <p className="text-text-muted leading-relaxed">
                                    Your withdrawal PIN is currently active and securing your account.
                                    <br />
                                    For security reasons, you cannot change your PIN online.
                                </p>
                            </div>
                            <div className="p-6 bg-secondary/50 rounded-2xl border border-white/5 mt-6">
                                <p className="text-xs text-text-muted">
                                    If you need to reset your PIN, please contact <span className="text-accent font-bold">Customer Support</span> for identity verification.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleSetPin}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <div className="p-6 bg-accent/5 border border-accent/20 rounded-[32px] flex items-start space-x-4">
                                    <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-accent text-sm">Withdrawal PIN Required</h4>
                                        <p className="text-[10px] text-text-muted leading-relaxed mt-1">For your security, you must set a 4-6 digit numeric PIN. This PIN will be required for ALL future withdrawal requests. Do not share this with anyone.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Create New PIN</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                maxLength={6}
                                                placeholder="••••"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-background border border-border px-14 py-5 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-black text-2xl tracking-[0.5em] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest ml-1">Confirm PIN</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                maxLength={6}
                                                placeholder="••••"
                                                value={confirmPin}
                                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                                className="w-full bg-background border border-border px-14 py-5 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-black text-2xl tracking-[0.5em] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-orange-200 leading-relaxed italic">Once set, your PIN cannot be easily changed without contacting support. Please ensure you remember it clearly.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || pin.length < 4}
                                className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all shadow-xl shadow-blue-500/30 group"
                            >
                                <span>{isLoading ? 'Securing Account...' : 'Set Security PIN'}</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Settings;
