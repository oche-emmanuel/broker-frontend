import { useState, useEffect } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import api from '../../services/api';

const DepositHistory = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await api.get('/transactions');
                setTransactions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'rejected': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black">Transaction History</h1>
                    <p className="text-text-muted">A complete list of your deposits and withdrawals.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent" />
                        <input
                            placeholder="Search tx ID..."
                            className="bg-secondary border border-border pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-secondary border border-border rounded-xl text-text-muted hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="card-gradient rounded-[32px] overflow-hidden border border-border shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-white/5">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Coin</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-text-muted">Loading transactions...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-text-muted">No transactions found.</td>
                                </tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <span className="font-bold text-sm capitalize">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-mono text-sm font-bold">${tx.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black uppercase tracking-tighter bg-accent/10 text-accent px-2 py-1 rounded">
                                            {tx.coin}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-text-muted uppercase tracking-tighter">{new Date(tx.createdAt).toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase ${getStatusStyle(tx.status)}`}>
                                            {getStatusIcon(tx.status)}
                                            <span>{tx.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/[0.01] flex justify-center">
                    <button className="text-xs font-black uppercase text-accent hover:underline">Download Statement (PDF)</button>
                </div>
            </div>
        </div>
    );
};

export default DepositHistory;
