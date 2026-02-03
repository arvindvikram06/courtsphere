import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User as UserIcon, Lock, Loader2, Scale } from 'lucide-react';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeRole, setActiveRole] = useState('citizen');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await login(userId, password);
        if (!res.success) {
            setError(res.message);
        }
        setLoading(false);
    };

    const roles = [
        { id: 'citizen', label: 'Citizen', format: 'XXXX-XXXX-XXXX' },
        { id: 'police', label: 'Police', format: 'PS-XXX' },
        { id: 'court', label: 'Court', format: 'CRT-XXX' },
        { id: 'lawyer', label: 'Lawyer', format: 'LAW-XXX' },
        { id: 'finance', label: 'Finance', format: 'FIN-XXX' },
        { id: 'superadmin', label: 'Super Admin', format: 'SUP-XXX' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black">
            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side: Info */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-indigo-600 text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Scale size={40} />
                            <h1 className="text-3xl font-bold tracking-tight">CourtSphere</h1>
                        </div>
                        <h2 className="text-4xl font-light mb-6 leading-tight">
                            Justice Managed <br />
                            <span className="font-bold">Effortlessly.</span>
                        </h2>
                        <p className="text-indigo-100 text-lg">
                            Streamlining the judicial process with integrated case management, evidence tracking, and secure payments.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-200 text-sm">
                        <ShieldCheck size={18} />
                        <span>Secure Enterprise Encryption Activated</span>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
                        <p className="text-slate-500 dark:text-slate-400">Select your role and enter credentials</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-8">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRole(role.id)}
                                className={`text-xs py-2 px-1 rounded-lg border transition-all duration-200 ${activeRole === role.id
                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                    }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                User ID <span className="text-xs text-slate-400 font-normal">({roles.find(r => r.id === activeRole).format})</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <UserIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your ID"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
