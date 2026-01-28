import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPayments, getCases, addPayment, updatePaymentStatus } from '../utils/api';
import { DollarSign, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const Payment = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [showPayModal, setShowPayModal] = useState(false);
    const [payForm, setPayForm] = useState({ caseId: '', amount: '' });
    const [myCases, setMyCases] = useState([]);

    useEffect(() => {
        refreshData();
    }, [user]);

    const refreshData = () => {
        const allPayments = getPayments();
        if (user.role === 'citizen') {
            setPayments(allPayments.filter(p => p.paidBy === user.id));
            const cases = getCases().filter(c => c.complainant === user.id || c.accused === user.id);
            setMyCases(cases);
        } else if (user.role === 'finance' || user.role === 'court') {
            setPayments(allPayments);
        } else {
            setPayments([]); // Lawyers maybe see payments related to their cases?
        }
    };

    const handlePay = (e) => {
        e.preventDefault();
        const newPayment = {
            paymentId: `PAY-${Math.floor(Math.random() * 10000)}`,
            caseId: payForm.caseId,
            amount: Number(payForm.amount),
            paidBy: user.id,
            status: 'Waiting Approval'
        };
        addPayment(newPayment);
        setShowPayModal(false);
        refreshData();
    };

    const handleApprove = (id) => {
        updatePaymentStatus(id, 'Approved');
        refreshData();
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payments</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage fee transactions</p>
                </div>
                {user.role === 'citizen' && (
                    <button
                        onClick={() => setShowPayModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <DollarSign className="w-5 h-5" />
                        Make Payment
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold text-sm">
                        <tr>
                            <th className="p-4">Payment ID</th>
                            <th className="p-4">Case ID</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payer</th>
                            <th className="p-4">Status</th>
                            {(user.role === 'finance' || user.role === 'court') && <th className="p-4">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                        {payments.map((p) => (
                            <tr key={p.paymentId}>
                                <td className="p-4 font-mono text-xs">{p.paymentId}</td>
                                <td className="p-4">{p.caseId}</td>
                                <td className="p-4 font-bold">₹{p.amount}</td>
                                <td className="p-4">{p.paidBy}</td>
                                <td className="p-4">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium",
                                        p.status === 'Approved' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                                        {p.status}
                                    </span>
                                </td>
                                {(user.role === 'finance' || user.role === 'court') && (
                                    <td className="p-4">
                                        {p.status === 'Waiting Approval' && (
                                            <button onClick={() => handleApprove(p.paymentId)} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1 text-xs">
                                                <CheckCircle className="w-3 h-3" /> Approve
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No payments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pay Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Make Payment</h3>
                        <form onSubmit={handlePay} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-300">Select Case</label>
                                <select
                                    value={payForm.caseId}
                                    onChange={(e) => setPayForm({ ...payForm, caseId: e.target.value })}
                                    className="w-full p-2 border rounded bg-transparent dark:border-slate-600 dark:text-white"
                                    required
                                >
                                    <option value="">Select Case</option>
                                    {myCases.map(c => <option key={c.caseId} value={c.caseId}>{c.caseId} ({c.type})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1 dark:text-slate-300">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={payForm.amount}
                                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                                    className="w-full p-2 border rounded bg-transparent dark:border-slate-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setShowPayModal(false)} className="px-3 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Cancel</button>
                                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Pay Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
