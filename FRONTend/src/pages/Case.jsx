import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCases, addCase, updateCase, getUsers, getUserName, requestDefenseLawyer, approveDefenseLawyer } from '../utils/api';
import { Plus, Search, Filter, CheckCircle, UserPlus } from 'lucide-react';

import clsx from 'clsx';

const Case = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Registration Form State
    const [newCaseData, setNewCaseData] = useState({ type: 'Normal', nature: 'Civil', description: '', accused: '' });

    // Lawyer Request State
    const [lawyerModalOpen, setLawyerModalOpen] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [availableLawyers, setAvailableLawyers] = useState([]);
    const [viewCase, setViewCase] = useState(null);

    useEffect(() => {
        refreshCases();
        const lawyers = getUsers().filter(u => u.role === 'lawyer' && u.specialization !== 'Public Prosecutor'); // Filter out PPs for defense request
        setAvailableLawyers(lawyers);
    }, [user]);

    const refreshCases = () => {
        const allCases = getCases();
        if (user.role === 'citizen') {
            setCases(allCases.filter(c => c.complainant === user.id || c.accused === user.id));
        } else if (user.role === 'lawyer') {
            setCases(allCases.filter(c => c.defenseLawyer === user.id || c.publicProsecutor === user.id || c.requestedDefenseLawyer === user.id || (c.type === 'Pro Bono' && c.defenseLawyer === 'Pending')));
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
            defenseLawyer: 'Pending',
            publicProsecutor: 'N/A', // Assigned by system/court later
            hearings: [],
            fees: { court: 500, lawyer: 0, fine: 0 },
            paymentStatus: 'Pending',
            description: newCaseData.description
        };
        addCase(newCase);
        setShowModal(false);
        refreshCases();
        setNewCaseData({ type: 'Normal', nature: 'Civil', description: '', accused: '' });
    };

    const handleRequestLawyer = (lawyerId) => {
        if (selectedCaseId && lawyerId) {
            requestDefenseLawyer(selectedCaseId, lawyerId);
            setLawyerModalOpen(false);
            refreshCases();
        }
    };

    const handleAcceptCase = (caseId) => {
        approveDefenseLawyer(caseId, user.id);
        refreshCases();
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
                                <th className="p-4">Nature</th>
                                <th className="p-4">Parties</th>
                                <th className="p-4">Lawyers</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                            {cases.length > 0 ? cases.map((c) => (
                                <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400">
                                        {c.caseId}
                                        <div className="mt-1">
                                            <span className={clsx("px-2 py-0.5 rounded text-[10px] font-medium border", c.type === 'Pro Bono' ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-slate-50 text-slate-600 border-slate-200")}>
                                                {c.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">{c.nature}</td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <p><span className="text-slate-500">Comp:</span> {getUserName(c.complainant)}</p>
                                            <p><span className="text-slate-500">Acc:</span> {getUserName(c.accused)}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <p><span className="text-slate-500">Def:</span> {getUserName(c.defenseLawyer)}</p>
                                            <p><span className="text-slate-500">PP:</span> {getUserName(c.publicProsecutor)}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx("px-2 py-1 rounded-full text-xs font-medium",
                                            c.status === 'Ongoing' ? "bg-blue-100 text-blue-700" :
                                                c.status === 'Closed' ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-100 text-yellow-700")}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {user.role === 'court' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusUpdate(c, 'Ongoing')} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100">Ongoing</button>
                                                <button onClick={() => handleStatusUpdate(c, 'Closed')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100">Close</button>
                                            </div>
                                        )}
                                        {user.role === 'citizen' && (c.defenseLawyer === 'Pending' || c.defenseLawyer === 'N/A') && (
                                            c.requestedDefenseLawyer ? (
                                                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded border border-yellow-200">Pending Req</span>
                                            ) : (
                                                <button onClick={() => { setSelectedCaseId(c.caseId); setLawyerModalOpen(true); }} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1">
                                                    <UserPlus className="w-3 h-3" /> Req Lawyer
                                                </button>
                                            )
                                        )}
                                        {user.role === 'lawyer' && c.requestedDefenseLawyer === user.id && (
                                            <button onClick={() => handleAcceptCase(c.caseId)} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded border border-green-200 hover:bg-green-100">Accept Request</button>
                                        )}
                                        {user.role === 'lawyer' && c.type === 'Pro Bono' && c.defenseLawyer === 'Pending' && (
                                            <button onClick={() => { c.defenseLawyer = user.id; updateCase(c); refreshCases(); }} className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded border border-pink-200 hover:bg-pink-100">Take Pro Bono</button>
                                        )}
                                        <button onClick={() => setViewCase(c)} className="text-slate-400 hover:text-indigo-600">View</button>
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
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Nature</label>
                                <select
                                    value={newCaseData.nature}
                                    onChange={(e) => setNewCaseData({ ...newCaseData, nature: e.target.value })}
                                    className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option>Civil</option>
                                    <option>Criminal</option>
                                    <option>Family</option>
                                    <option>Traffic</option>
                                    <option>Cyber Crime</option>
                                    <option>Labor</option>
                                    <option>Other</option>
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

            {/* Lawyer Selection Modal */}
            {lawyerModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Select Defense Lawyer</h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                            {availableLawyers.map(lawyer => (
                                <button
                                    key={lawyer.id}
                                    onClick={() => handleRequestLawyer(lawyer.id)}
                                    className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-indigo-200"
                                >
                                    <p className="font-semibold text-slate-900 dark:text-white">{lawyer.name}</p>
                                    <p className="text-xs text-slate-500">{lawyer.specialization} • {lawyer.casesHandled} cases handled</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setLawyerModalOpen(false)} className="w-full py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                    </div>
                </div>
            )}
            {/* Case Detail Modal */}
            {
                viewCase && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                                        {viewCase.caseId}
                                        <span className={clsx("px-3 py-1 rounded-full text-sm font-medium",
                                            viewCase.status === 'Ongoing' ? "bg-blue-100 text-blue-700" :
                                                viewCase.status === 'Closed' ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-100 text-yellow-700")}>
                                            {viewCase.status}
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">{viewCase.subject}</p>
                                </div>
                                <button onClick={() => setViewCase(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Case Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-slate-500">Nature:</span> {viewCase.nature}</p>
                                        <p><span className="text-slate-500">Type:</span> {viewCase.type}</p>
                                        <p><span className="text-slate-500">Priority:</span> {viewCase.priority}</p>
                                        <p><span className="text-slate-500">Filing Date:</span> {viewCase.filingDate}</p>
                                        <p><span className="text-slate-500">Court:</span> {getUserName(viewCase.court)}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Parties Involved</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-slate-500">Complainant:</span> {getUserName(viewCase.complainant)}</p>
                                        <p><span className="text-slate-500">Accused:</span> {getUserName(viewCase.accused)}</p>
                                        <p><span className="text-slate-500">Defense Lawyer:</span> {getUserName(viewCase.defenseLawyer)}</p>
                                        <p><span className="text-slate-500">Public Prosecutor:</span> {getUserName(viewCase.publicProsecutor)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Financials</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                                        <p className="text-xs text-slate-500 mb-1">Court Fees</p>
                                        <p className="font-bold text-slate-900 dark:text-white">₹{viewCase.fees?.court}</p>
                                    </div>
                                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                                        <p className="text-xs text-slate-500 mb-1">Lawyer Fees</p>
                                        <p className="font-bold text-slate-900 dark:text-white">₹{viewCase.fees?.lawyer}</p>
                                    </div>
                                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                                        <p className="text-xs text-slate-500 mb-1">Fine</p>
                                        <p className="font-bold text-slate-900 dark:text-white">₹{viewCase.fees?.fine}</p>
                                    </div>
                                </div>
                                <p className="text-right text-sm mt-2 text-slate-500">Payment Status: <span className="font-medium text-slate-900 dark:text-white">{viewCase.paymentStatus}</span></p>
                            </div>

                            {viewCase.hearings && viewCase.hearings.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Hearing Schedule</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {viewCase.hearings.map((date, i) => (
                                            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">{date}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button onClick={() => setViewCase(null)} className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Close</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Case;
