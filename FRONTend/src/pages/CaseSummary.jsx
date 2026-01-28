import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCaseSummaries, getCases } from '../utils/api';
import { FileText, Edit, Plus } from 'lucide-react';

const CaseSummary = () => {
    const { user } = useAuth();
    const [summaries, setSummaries] = useState([]);

    // State for mock CRUD
    const [editing, setEditing] = useState(false);
    const [currentSummary, setCurrentSummary] = useState({ caseId: '', summary: '' });

    useEffect(() => {
        const data = getCaseSummaries();
        setSummaries(data);
    }, [user]);

    const handleSave = (e) => {
        e.preventDefault();
        // Logic to save summary to localStorage would go here
        // For now we just update state to simulate
        if (!summaries.find(s => s.caseId === currentSummary.caseId)) {
            setSummaries([...summaries, currentSummary]);
        } else {
            setSummaries(summaries.map(s => s.caseId === currentSummary.caseId ? currentSummary : s));
        }
        setEditing(false);
        setCurrentSummary({ caseId: '', summary: '' });
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Case Summaries</h1>
                    <p className="text-slate-500 dark:text-slate-400">Judicial summaries and case histories</p>
                </div>
                {user.role === 'court' && (
                    <button onClick={() => setEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                        <Plus className="w-5 h-5" /> Add Summary
                    </button>
                )}
            </div>

            {editing && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-indigo-200">
                    <h3 className="font-bold mb-4 dark:text-white">Edit Summary</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <input
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
                                placeholder="Case ID"
                                value={currentSummary.caseId}
                                onChange={e => setCurrentSummary({ ...currentSummary, caseId: e.target.value })}
                            />
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
                                placeholder="Summary text..."
                                rows="4"
                                value={currentSummary.summary}
                                onChange={e => setCurrentSummary({ ...currentSummary, summary: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(false)} type="button" className="px-4 py-2 text-slate-500">Cancel</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {summaries.map((s, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{s.caseId}</h3>
                            {user.role === 'court' && (
                                <button onClick={() => { setEditing(true); setCurrentSummary(s); }} className="text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                            )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{s.summary}</p>
                    </div>
                ))}
                {summaries.length === 0 && <p className="text-slate-500">No summaries available.</p>}
            </div>
        </div>
    );
};

export default CaseSummary;
