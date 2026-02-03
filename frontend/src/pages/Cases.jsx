import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Plus, Search, Filter, MoreVertical, FileText, Gavel, User, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cases = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [newCase, setNewCase] = useState({
        title: '',
        description: '',
        type: 'normal',
        accusedDetails: { name: '', aadhaar: '', address: '' },
        lawyerType: 'none'
    });

    const fetchCases = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/cases');
            setCases(data);
        } catch (err) {
            console.error('Error fetching cases');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const handleCreateCase = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/cases', newCase);
            setShowModal(false);
            fetchCases();
        } catch (err) {
            alert('Error creating case');
        }
    };

    const filteredCases = cases.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Judicial Cases</h1>
                    <p className="text-slate-500 text-sm">Manage and track your ongoing legal proceedings</p>
                </div>
                {(user.role === 'citizen' || user.role === 'police') && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-medium"
                    >
                        <Plus size={20} />
                        Register Case
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search case title or number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                                <th className="px-6 py-4">Case Details</th>
                                <th className="px-6 py-4">Parties</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Hearings</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredCases.map((c) => (
                                <tr key={c._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{c.caseNumber}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1">{c.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <User size={12} className="text-indigo-500" />
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    Complainant: {c.complainant?.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <AlertCircle size={12} className="text-rose-500" />
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    Accused: {c.accusedDetails?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'ongoing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                                c.status === 'judgement given' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {c.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock size={14} />
                                            {c.hearings.length} Sessions
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                            <MoreVertical size={18} className="text-slate-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCases.length === 0 && !loading && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium">No Cases Found</h3>
                            <p className="text-slate-400 text-sm">Try adjusting your search or register a new case.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Register New Case</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                            </div>
                            <form onSubmit={handleCreateCase} className="p-6 grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1.5">Case Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCase.title}
                                        onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1.5">Case Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={newCase.description}
                                        onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Case Type</label>
                                    <select
                                        value={newCase.type}
                                        onChange={(e) => setNewCase({ ...newCase, type: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="probono">Pro-Bono (Anonymous)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Lawyer Request</label>
                                    <select
                                        value={newCase.lawyerType}
                                        onChange={(e) => setNewCase({ ...newCase, lawyerType: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="none">No Lawyer</option>
                                        <option value="public">Public Prosecutor</option>
                                        <option value="personal">Personal Lawyer</option>
                                    </select>
                                </div>
                                <div className="col-span-2 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6 mt-2">
                                    <div className="col-span-3 mb-2 font-bold text-sm text-indigo-600">Accused Details</div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={newCase.accusedDetails.name}
                                            onChange={(e) => setNewCase({ ...newCase, accusedDetails: { ...newCase.accusedDetails, name: e.target.value } })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Aadhaar (if known)</label>
                                        <input
                                            type="text"
                                            value={newCase.accusedDetails.aadhaar}
                                            onChange={(e) => setNewCase({ ...newCase, accusedDetails: { ...newCase.accusedDetails, aadhaar: e.target.value } })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={newCase.accusedDetails.address}
                                            onChange={(e) => setNewCase({ ...newCase, accusedDetails: { ...newCase.accusedDetails, address: e.target.value } })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 flex gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all"
                                    >
                                        Confirm Registration
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cases;
