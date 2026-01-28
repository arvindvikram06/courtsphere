import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEvidence, getCases } from '../utils/api';
import { File, Trash, Upload } from 'lucide-react';

const Evidence = () => {
    const { user } = useAuth();
    const [evidenceList, setEvidenceList] = useState([]);
    const [cases, setCases] = useState([]);

    // Mock upload
    const [uploadForm, setUploadForm] = useState({ caseId: '', filename: '' });

    useEffect(() => {
        refreshData();
    }, [user]);

    const refreshData = () => {
        const allEvidence = getEvidence();
        const allCases = getCases();

        // Filtering Rules: Evidence visible only to Court + involved Citizen/Lawyer/Police
        let filteredEvidence = [];
        if (user.role === 'court' || user.role === 'superadmin') {
            filteredEvidence = allEvidence;
            setCases(allCases);
        } else {
            // Find cases involved
            let myCaseIds = [];
            if (user.role === 'citizen') myCaseIds = allCases.filter(c => c.complainant === user.id || c.accused === user.id).map(c => c.caseId);
            if (user.role === 'lawyer') myCaseIds = allCases.filter(c => c.lawyer === user.id).map(c => c.caseId);
            if (user.role === 'police') myCaseIds = allCases.map(c => c.caseId); // Simplified police access

            filteredEvidence = allEvidence.filter(e => myCaseIds.includes(e.caseId));
            setCases(allCases.filter(c => myCaseIds.includes(c.caseId)));
        }
        setEvidenceList(filteredEvidence);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        // Logic to add evidence would normally be here (needs API support)
        alert("Mock upload: " + uploadForm.filename);
        setUploadForm({ caseId: '', filename: '' });
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Evidence Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Secure digital evidence repository</p>
                </div>
            </div>

            {(user.role === 'court') && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold mb-4 dark:text-white flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Evidence</h3>
                    <form onSubmit={handleUpload} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm mb-1 dark:text-slate-300">Case ID</label>
                            <select
                                value={uploadForm.caseId}
                                onChange={e => setUploadForm({ ...uploadForm, caseId: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600"
                            >
                                <option value="">Select Case</option>
                                {cases.map(c => <option key={c.caseId} value={c.caseId}>{c.caseId}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm mb-1 dark:text-slate-300">File Description</label>
                            <input
                                type="text"
                                value={uploadForm.filename}
                                onChange={e => setUploadForm({ ...uploadForm, filename: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600"
                                placeholder="e.g. Crime Scene Photo"
                            />
                        </div>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-[1px]">Upload</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evidenceList.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative group hover:shadow-md transition-shadow">
                        <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs px-2 py-1 rounded">
                            {item.caseId}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <File className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Evidence #{idx + 1}</h4>
                                <p className="text-sm text-slate-500">{item.files.length} Files</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {item.files.map((file, fidx) => (
                                <div key={fidx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                    {file}
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-slate-400 italic">"{item.log}"</p>
                    </div>
                ))}
                {evidenceList.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-slate-500">No evidence accessible.</div>
                )}
            </div>
        </div>
    );
};

export default Evidence;
