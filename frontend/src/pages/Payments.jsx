import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    CreditCard, CheckCircle2, XCircle, Clock, Search, Filter, ArrowUpRight, DollarSign
} from 'lucide-react';

const Payments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalDue, setTotalDue] = useState(0);

    const fetchPayments = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/payments');
            setPayments(data);
            if (user.role === 'citizen') {
                setTotalDue(data.filter(p => p.status === 'waiting').reduce((acc, curr) => acc + curr.amount, 0));
            }
        } catch (err) {
            console.error('Error fetching payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/payments/${id}`, { status });
            fetchPayments();
        } catch (err) {
            alert('Error updating payment status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Financial Clearing</h1>
                    <p className="text-slate-500 text-sm">Track registration fees, court fines, and lawyer payouts</p>
                </div>
                {user.role === 'citizen' && totalDue > 0 && (
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg shadow-indigo-600/20">
                        <div>
                            <p className="text-xs text-indigo-200">Total Outstanding</p>
                            <p className="text-xl font-bold">₹{totalDue.toLocaleString()}</p>
                        </div>
                        <button className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                            Pay All
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Revenue', value: '₹4,52,000', icon: <DollarSign size={20} />, color: 'indigo' },
                    { label: 'Pending Approval', value: payments.filter(p => p.status === 'waiting').length, icon: <Clock size={20} />, color: 'amber' },
                    { label: 'Cleared Today', value: '18', icon: <CheckCircle2 size={20} />, color: 'emerald' },
                    { label: 'Refunds', value: '2', icon: <ArrowUpRight size={20} />, color: 'slate' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="font-bold">Transaction History</h2>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 px-2.5 py-0.5 rounded-lg text-xs">
                            {payments.length} total
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search TXN ID..." className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Case / Purpose</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                {user.role === 'finance' && <th className="px-6 py-4">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {payments.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.transactionId}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="font-medium text-sm">{p.case?.caseNumber || 'N/A'}</p>
                                            <p className="text-xs text-slate-400 capitalize">{p.type} Fee</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-sm">₹{p.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                p.status === 'rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                                                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {p.status === 'approved' ? <CheckCircle2 size={12} /> :
                                                p.status === 'rejected' ? <XCircle size={12} /> : <Clock size={12} />}
                                            {p.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
                                    {user.role === 'finance' && (
                                        <td className="px-6 py-5">
                                            {p.status === 'waiting' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleVerify(p._id, 'approved')}
                                                        className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(p._id, 'rejected')}
                                                        className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">Verified</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {payments.length === 0 && !loading && (
                        <div className="p-20 text-center text-slate-400">
                            <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No transactions recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payments;
