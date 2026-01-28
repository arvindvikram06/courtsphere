import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCases, addCase, updateCase, getUsers } from '../utils/api';
import { Plus, Search, Filter, CheckCircle } from 'lucide-react';

import clsx from 'clsx';

const Case = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Registration Form State
    const [newCaseData, setNewCaseData] = useState({ type: 'Normal', description: '', accused: '' });

    useEffect(() => {
        refreshCases();
    }, [user]);

    const refreshCases = () => {
        const allCases = getCases();
        if (user.role === 'citizen') {
            setCases(allCases.filter(c => c.complainant === user.id || c.accused === user.id));
        } else if (user.role === 'lawyer') {
            setCases(allCases.filter(c => c.lawyer === user.id || c.status === 'Open')); // Open for acceptance?
        } else if (user.role === 'police') {
            setCases(allCases); // Police sees all
        } else {
            setCases(allCases); // Court/Admin sees all
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const newCase = {
            caseId: `CASE-${Math.floor(Math.random() * 1000)}`,
            type: newCaseData.type,
            status: 'Open',
            complainant: user.id,
            accused: newCaseData.accused || 'Unknown',
            lawyer: 'Pending',
            hearings: [],
            fees: { court: 500, lawyer: 0, fine: 0 },
            paymentStatus: 'Pending',
            description: newCaseData.description
        };
        addCase(newCase);
        setShowModal(false);
        refreshCases();
        setNewCaseData({ type: 'Normal', description: '', accused: '' });
    };

    const handleStatusUpdate = (caseItem, newStatus) => {
        const updated = { ...caseItem, status: newStatus };
        updateCase(updated);
        refreshCases();
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Case Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track legal cases</p>
                </div>
                {(user.role === 'citizen' || user.role === 'police') && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Register Case
                    </button>
                )}
            </div>

            {/* Case Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold text-sm">
                            <tr>
                                <th className="p-4">Case ID</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                            {cases.length > 0 ? cases.map((c) => (
                                <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400">{c.caseId}</td>
                                    <td className="p-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", c.type === 'Pro Bono' ? "bg-pink-100 text-pink-700" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300")}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium",
                                            c.status === 'Ongoing' ? "bg-blue-100 text-blue-700" :
                                                c.status === 'Closed' ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-100 text-yellow-700")}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'citizen' && c.complainant === user.id ? 'Complainant' :
                                            user.role === 'citizen' ? 'Accused' :
                                                user.role === 'lawyer' ? 'Counsel' : '-'}
                                    </td>
                                    <td className="p-4">{c.paymentStatus}</td>
                                    <td className="p-4 flex gap-2">
                                        {user.role === 'court' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusUpdate(c, 'Ongoing')} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100">Ongoing</button>
                                                <button onClick={() => handleStatusUpdate(c, 'Closed')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100">Close</button>
                                            </div>
                                        )}
                                        {user.role === 'lawyer' && c.lawyer === 'Pending' && (
                                            <button onClick={() => { c.lawyer = user.id; updateCase(c); refreshCases(); }} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-100">Accept</button>
                                        )}
                                        <button className="text-slate-400 hover:text-indigo-600">View</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No cases found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Register New Case</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Case Type</label>
                                <select
                                    value={newCaseData.type}
                                    onChange={(e) => setNewCaseData({ ...newCaseData, type: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option>Normal</option>
                                    <option>Pro Bono</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Accused ID (Optional)</label>
                                <input
                                    type="text"
                                    value={newCaseData.accused}
                                    onChange={(e) => setNewCaseData({ ...newCaseData, accused: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="xxxx-xxxx-xxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description</label>
                                <textarea
                                    value={newCaseData.description}
                                    onChange={(e) => setNewCaseData({ ...newCaseData, description: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Case;
