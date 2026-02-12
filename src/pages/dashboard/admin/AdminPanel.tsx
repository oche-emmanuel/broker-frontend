import { useState, useEffect } from 'react';
import { Users, DollarSign, History as HistoryIcon, ShieldCheck, Search, X, User as UserIcon, Mail } from 'lucide-react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [viewingHistoryUser, setViewingHistoryUser] = useState<any | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Modal states
    const [newBalance, setNewBalance] = useState('');
    const [newActiveDeposit, setNewActiveDeposit] = useState('');
    const [newBonus, setNewBonus] = useState('');
    const [newManager, setNewManager] = useState('');
    const [newStatus, setNewStatus] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async (userId: string) => {
        setIsHistoryLoading(true);
        try {
            const { data } = await api.get(`/admin/transactions/${userId}`);
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setIsUpdating(true);
        try {
            await api.put('/admin/update-account', {
                userId: selectedUser._id,
                balance: parseFloat(newBalance),
                activeDeposit: parseFloat(newActiveDeposit),
                bonus: parseFloat(newBonus),
                manager: newManager,
                accountStatus: newStatus
            });
            fetchUsers();
            setSelectedUser(null);
            alert('Account updated successfully!');
        } catch (err) {
            console.error('Failed to update account', err);
            alert('Update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateTransaction = async (transactionId: string, status: string) => {
        try {
            await api.put('/admin/update-transaction', { transactionId, status });
            if (viewingHistoryUser) {
                fetchHistory(viewingHistoryUser._id);
            }
            fetchUsers();
            alert(`Transaction ${status} successfully!`);
        } catch (err) {
            console.error('Failed to update transaction', err);
            alert('Failed to update status');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic">System Administration</h1>
                    <p className="text-text-muted text-sm mt-1">Manage users, approve transactions, and monitor system health.</p>
                </div>
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary border border-border pl-12 pr-6 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-gradient p-8 rounded-[32px] space-y-2">
                    <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Total Users</p>
                    <h3 className="text-3xl font-black">{users.length}</h3>
                </div>
                <div className="card-gradient p-8 rounded-[32px] space-y-2">
                    <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Active Deposits</p>
                    <h3 className="text-3xl font-black text-green-500">${users.reduce((acc, u) => acc + (u.account?.activeDeposit || 0), 0).toLocaleString()}</h3>
                </div>
                <div className="card-gradient p-8 rounded-[32px] space-y-2">
                    <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Global Balance</p>
                    <h3 className="text-3xl font-black text-accent">${users.reduce((acc, u) => acc + (u.account?.balance || 0), 0).toLocaleString()}</h3>
                </div>
            </div>

            <div className="bg-secondary border border-border rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-border">
                    <h4 className="font-bold flex items-center space-x-2">
                        <Users className="w-5 h-5 text-accent" />
                        <span>User Management</span>
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-text-muted italic">Loading user directory...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-text-muted italic">No users found matching your search.</td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-black text-sm uppercase">
                                                {user.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{user.name}</span>
                                                <span className="text-[10px] text-text-muted">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-green-500">${user.account?.balance?.toLocaleString() || '0'}</span>
                                            <span className="text-[9px] text-text-muted uppercase">Total Assets</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.accountStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-xs font-medium capitalize">{user.accountStatus || 'active' || 'active'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setNewBalance(user.account?.balance?.toString() || '0');
                                                    setNewActiveDeposit(user.account?.activeDeposit?.toString() || '0');
                                                    setNewBonus(user.account?.bonus?.toString() || '0');
                                                    setNewManager(user.account?.manager || 'Unassigned');
                                                    setNewStatus(user.accountStatus || 'active');
                                                }}
                                                title="Edit Account"
                                                className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors border border-transparent hover:border-green-500/20"
                                            >
                                                <DollarSign className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setViewingHistoryUser(user);
                                                    fetchHistory(user._id);
                                                }}
                                                title="View History"
                                                className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors border border-transparent hover:border-accent/20"
                                            >
                                                <HistoryIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Management Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-secondary border border-border rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex justify-between items-center bg-white/5">
                                <h3 className="font-black italic flex items-center space-x-2">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                    <span>Account Settings</span>
                                </h3>
                                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateAccount} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4 p-4 bg-background/50 rounded-2xl border border-border">
                                        <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-black">
                                            {selectedUser.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{selectedUser.name}</p>
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center space-x-2">
                                                <DollarSign className="w-3 h-3 text-green-500" />
                                                <span>Current Balance ($)</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={newBalance}
                                                onChange={(e) => setNewBalance(e.target.value)}
                                                placeholder="Enter amount..."
                                                className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all font-black text-xl text-green-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center space-x-2">
                                                    <DollarSign className="w-3 h-3 text-blue-500" />
                                                    <span>Active Deposit</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newActiveDeposit}
                                                    onChange={(e) => setNewActiveDeposit(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center space-x-2">
                                                    <DollarSign className="w-3 h-3 text-purple-500" />
                                                    <span>Bonus / Gift</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newBonus}
                                                    onChange={(e) => setNewBonus(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center space-x-2">
                                                <UserIcon className="w-3 h-3 text-orange-500" />
                                                <span>Account Manager</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newManager}
                                                onChange={(e) => setNewManager(e.target.value)}
                                                placeholder="Enter manager name..."
                                                className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-text-muted tracking-widest flex items-center space-x-2">
                                                <ShieldCheck className="w-3 h-3 text-blue-500" />
                                                <span>Account Status</span>
                                            </label>
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="w-full bg-background border border-border px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended</option>
                                                <option value="upgrade_required">Upgrade Required</option>
                                                <option value="pending_verification">Pending Verification</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving Changes...' : 'Save Settings'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* History Modal */}
            <AnimatePresence>
                {viewingHistoryUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingHistoryUser(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-secondary border border-border rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-8 border-b border-border flex justify-between items-center bg-white/5">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-black text-xl">
                                        {viewingHistoryUser.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-black italic flex items-center space-x-2">
                                            <HistoryIcon className="w-5 h-5 text-accent" />
                                            <span>Transaction History</span>
                                        </h3>
                                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{viewingHistoryUser.name} • {viewingHistoryUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingHistoryUser(null)} className="p-2 hover:bg-white/5 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-8 scrollbar-hide">
                                {isHistoryLoading ? (
                                    <div className="py-20 text-center opacity-30 italic">Gathering transaction records...</div>
                                ) : history.length === 0 ? (
                                    <div className="py-20 text-center opacity-30">
                                        <HistoryIcon className="w-12 h-12 mx-auto mb-4" />
                                        <p className="font-bold">No transactions found for this user.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((tx) => (
                                            <div key={tx._id} className="p-6 bg-background/50 border border-border rounded-[32px] flex items-center justify-between group hover:border-accent/30 transition-all">
                                                <div className="flex items-center space-x-6">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                                                        {tx.type === 'deposit' ? <DollarSign className="w-6 h-6" /> : <HistoryIcon className="w-6 h-6 rotate-180" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-black text-lg">${tx.amount.toLocaleString()}</span>
                                                            <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${tx.status === 'approved' ? 'bg-green-500 text-white' : tx.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
                                                            {tx.type} • {tx.method || 'crypto'} • {tx.coin || ''} • {new Date(tx.createdAt).toLocaleString()}
                                                        </p>
                                                        {tx.walletAddress && (
                                                            <p className="text-[9px] text-accent/60 truncate max-w-xs mt-1">Address: {tx.walletAddress}</p>
                                                        )}
                                                        {tx.method === 'bank' && (
                                                            <div className="mt-2 p-3 bg-background/50 rounded-xl border border-white/5 space-y-1">
                                                                <p className="text-[9px] text-text-muted uppercase tracking-tighter">Bank Details</p>
                                                                <p className="text-[10px] font-bold text-white">{tx.bankName}</p>
                                                                <p className="text-[10px] text-accent/80">Acc: {tx.accountNumber} • SWIFT: {tx.swiftCode}</p>
                                                                <p className="text-[10px] italic text-text-muted">{tx.accountName}</p>
                                                            </div>
                                                        )}
                                                        {tx.method === 'paypal' && (
                                                            <div className="mt-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center space-x-2">
                                                                <Mail className="w-3 h-3 text-blue-400" />
                                                                <p className="text-[10px] font-bold text-blue-200">{tx.paypalEmail}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {tx.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateTransaction(tx._id, 'approved')}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateTransaction(tx._id, 'rejected')}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
