import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    FileUp, File, Download, Search, Gavel, Calendar, User, MoreVertical, Loader2
} from 'lucide-react';

const Evidence = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState('');
    const [evidence, setEvidence] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCases = async () => {
            const { data } = await axios.get('http://localhost:5000/api/cases');
            setCases(data);
            if (data.length > 0) setSelectedCase(data[0]._id);
        };
        fetchCases();
    }, []);

    useEffect(() => {
        if (selectedCase) {
            fetchEvidence();
        }
    }, [selectedCase]);

    const fetchEvidence = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/evidence/${selectedCase}`);
            setEvidence(data);
        } catch (err) {
            console.error('Error fetching evidence');
            setEvidence([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !selectedCase) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('caseId', selectedCase);
        formData.append('description', description);
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/api/evidence', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setDescription('');
            fetchEvidence();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Evidence Repository</h1>
                <p className="text-slate-500 text-sm">Secure digital locker for case-related documents and media</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left: Case Selector */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <label className="block text-sm font-semibold mb-4 flex items-center gap-2">
                            <Gavel size={18} className="text-indigo-600" />
                            Select Case Archive
                        </label>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {cases.map(c => (
                                <button
                                    key={c._id}
                                    onClick={() => setSelectedCase(c._id)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedCase === c._id
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 hover:border-indigo-400'
                                        }`}
                                >
                                    <p className="text-xs font-bold opacity-70 mb-1">{c.caseNumber}</p>
                                    <p className="text-sm font-medium line-clamp-1">{c.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {user.role === 'court' && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileUp size={20} className="text-indigo-600" />
                                Add New Exhibit
                            </h2>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <File className={`mx-auto mb-2 ${file ? 'text-indigo-600' : 'text-slate-300'}`} size={32} />
                                        <p className="text-xs font-medium text-slate-500">
                                            {file ? file.name : 'Click to select or drag file'}
                                        </p>
                                    </label>
                                </div>
                                <textarea
                                    placeholder="Enter description for this evidence..."
                                    className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="2"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={uploading || !file}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={18} /> : 'Upload Exhibit'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right: Evidence List */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm min-h-[600px]">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="font-bold flex items-center gap-2">
                                Evidence Vault
                                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full uppercase">
                                    Case ID: {selectedCase ? cases.find(c => c._id === selectedCase)?.caseNumber : 'Select Case'}
                                </span>
                            </h2>
                            <div className="relative w-48">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input type="text" placeholder="Filter vault..." className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none" />
                            </div>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-40">
                                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                                    <p className="text-slate-400 font-medium">Decrypting Vault...</p>
                                </div>
                            ) : evidence.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {evidence.map(item => (
                                        <div key={item._id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                                    <File size={24} />
                                                </div>
                                                <button className="text-slate-300 hover:text-slate-600">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-sm mb-1 truncate">{item.fileName.split('-').slice(1).join('-')}</h4>
                                            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{item.description || 'No description provided.'}</p>

                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {item.uploadedBy?.name}
                                                </div>
                                            </div>

                                            <a
                                                href={`http://localhost:5000${item.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-indigo-600 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <Download size={14} />
                                                Download Exhibit
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-40 text-center">
                                    <File size={64} className="mx-auto text-slate-100 dark:text-slate-800 mb-4" />
                                    <h3 className="font-bold text-slate-400">Vault Empty</h3>
                                    <p className="text-xs text-slate-400">No evidence has been uploaded for this case yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evidence;
