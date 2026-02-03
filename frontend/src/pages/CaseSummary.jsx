import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, Search, Save, History, Scale, FileText, CheckCircle2, ChevronRight, Loader2
} from 'lucide-react';

const CaseSummary = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [summary, setSummary] = useState({ summaryContent: '', finalJudgement: '' });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCases = async () => {
            const { data } = await axios.get('http://localhost:5000/api/cases');
            setCases(data);
        };
        fetchCases();
    }, []);

    const fetchSummary = async (caseId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/summary/${caseId}`);
            setSummary(data);
        } catch (err) {
            setSummary({ summaryContent: '', finalJudgement: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleCaseSelect = (caseObj) => {
        setSelectedCase(caseObj);
        fetchSummary(caseObj._id);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('http://localhost:5000/api/summary', {
                caseId: selectedCase._id,
                ...summary
            });
            alert('Summary and Judgement saved successfully.');
        } catch (err) {
            alert('Failed to save summary.');
        } finally {
            setSaving(false);
        }
    };

    const filteredCases = cases.filter(c =>
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Judgement Archive</h1>
                <p className="text-slate-500 text-sm">Draft, review, and finalize judicial verdicts and case summaries</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Case List Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Find case..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm outline-none border-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {filteredCases.map(c => (
                                <button
                                    key={c._id}
                                    onClick={() => handleCaseSelect(c)}
                                    className={`w-full text-left p-5 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-all ${selectedCase?._id === c._id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs font-bold font-mono">{c.caseNumber}</p>
                                        <ChevronRight size={14} className={selectedCase?._id === c._id ? 'opacity-100' : 'opacity-0'} />
                                    </div>
                                    <p className="text-sm font-medium line-clamp-1">{c.title}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'judgement given' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {c.status.toUpperCase()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-8">
                    {selectedCase ? (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 -rotate-45 translate-x-10 -translate-y-10" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">{selectedCase.title}</h2>
                                            <p className="text-slate-400 text-sm">Official Document ID: {selectedCase._id}</p>
                                        </div>
                                        {user.role === 'court' && (
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                                Finalize Record
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 h-full">
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold flex items-center gap-2">
                                                <FileText size={18} className="text-indigo-600" />
                                                Case Overview & Summary
                                            </label>
                                            <textarea
                                                readOnly={user.role !== 'court'}
                                                placeholder="Detail the case proceedings, evidence highlights, and witness summaries here..."
                                                className="w-full h-96 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                                                value={summary.summaryContent}
                                                onChange={(e) => setSummary({ ...summary, summaryContent: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold flex items-center gap-2">
                                                <Scale size={18} className="text-secondary" />
                                                Final Verdict / Judgement
                                            </label>
                                            <textarea
                                                readOnly={user.role !== 'court'}
                                                placeholder="The final decision of the honorable court..."
                                                className="w-full h-96 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed font-bold"
                                                value={summary.finalJudgement}
                                                onChange={(e) => setSummary({ ...summary, finalJudgement: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 h-[600px] flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                                <BookOpen size={40} className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Case Selected</h3>
                            <p className="text-slate-400 max-w-sm">Please select a case from the archive to view or edit the judicial summary and final judgement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseSummary;
