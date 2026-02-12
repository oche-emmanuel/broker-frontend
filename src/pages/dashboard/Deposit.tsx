import { useState } from 'react';
import { Bitcoin, Wallet, QrCode, Copy, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const Deposit = () => {
    const [selectedCoin, setSelectedCoin] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const coins = [
        { id: 'BTC', name: 'Bitcoin', address: 'bc1q8uq6kegq0sul6udd6n3tnmcwfs0jmuv7nlul4u', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1q8uq6kegq0sul6udd6n3tnmcwfs0jmuv7nlul4u' },
        { id: 'ETH', name: 'Ethereum', address: '0x322c95Cfd6D51401b3de58C82fc4b593882BdF08', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x322c95Cfd6D51401b3de58C82fc4b593882BdF08' },
        { id: 'USDT', name: 'USDT (TRC20)', address: 'TZAnnimj8MbEotndd3PU3mRXuaMRh4j2on', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TZAnnimj8MbEotndd3PU3mRXuaMRh4j2on' },
    ];

    const currentCoin = coins.find(c => c.id === selectedCoin)!;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentCoin.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount))) return alert('Please enter a valid amount');
        setIsLoading(true);
        try {
            await api.post('/deposit', {
                amount: Number(amount),
                coin: selectedCoin,
                walletAddress: currentCoin.address
            });
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.message || 'Failed to submit deposit request';
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-10">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black">Deposit Funds</h1>
                <p className="text-text-muted mt-2">Fund your account with crypto to start trading instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column: Selection & Info */}
                <div className="space-y-8">
                    <div className="card-gradient p-8 rounded-[32px] space-y-6">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-text-muted tracking-widest block ml-1">Amount to Deposit</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent font-bold">$</div>
                                <input
                                    type="number"
                                    required
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-background border border-border px-8 py-4 rounded-xl focus:ring-2 focus:ring-accent outline-none font-bold placeholder:text-gray-800 transition-all text-xl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent uppercase">USD Equivalent</div>
                            </div>
                        </div>

                        <label className="text-xs font-black uppercase text-text-muted tracking-widest block ml-1">Select Asset</label>
                        <div className="grid grid-cols-3 gap-4">
                            {coins.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => setSelectedCoin(coin.id)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${selectedCoin === coin.id
                                        ? 'bg-accent/10 border-accent text-accent'
                                        : 'bg-background border-border text-text-muted hover:border-accent/50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCoin === coin.id ? 'bg-accent text-white' : 'bg-surface'}`}>
                                        {coin.id === 'BTC' ? <Bitcoin className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                                    </div>
                                    <span className="text-xs font-black">{coin.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start space-x-4">
                        <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold">Important Instructions</p>
                            <ul className="text-xs text-text-muted space-y-1.5 list-disc ml-4 leading-relaxed">
                                <li>Send ONLY <span className="text-accent font-bold">{currentCoin.name}</span> to this address.</li>
                                <li>Deposits are credited after 3 network confirmations.</li>
                                <li>Ensure you're using the correct network (e.g., TRC20 for USDT).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right column: Address & QR */}
                <div className="card-gradient p-8 rounded-[32px] flex flex-col items-center text-center space-y-8">
                    <div className="relative p-6 bg-white rounded-3xl shadow-xl shadow-black/20">
                        <img src={currentCoin.qr} alt="QR Code" className="w-40 h-40" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg">
                            <QrCode className="w-6 h-6 text-black" />
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        <label className="text-[10px] font-black uppercase text-text-muted tracking-widest block">Wallet Address</label>
                        <div className="relative group">
                            <input
                                readOnly
                                value={currentCoin.address}
                                className="w-full bg-background border border-border px-4 py-4 rounded-xl text-xs font-mono text-center pr-12 outline-none group-hover:border-accent transition-colors"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:text-accent transition-colors"
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </motion.div>
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {success ? (
                        <div className="w-full bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col items-center space-y-3">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                            <p className="text-green-500 font-bold">Request Submitted!</p>
                            <p className="text-[10px] text-text-muted">Your deposit will be reflected once network confirmation is complete.</p>
                            <button onClick={() => setSuccess(false)} className="text-xs text-accent hover:underline font-bold pt-2">Make another deposit</button>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
                        >
                            <span>{isLoading ? 'Processing...' : 'Confirm Transaction Sent'}</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Deposit;
