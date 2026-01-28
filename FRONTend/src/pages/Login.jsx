import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Gavel, Scale, Briefcase, DollarSign, Lock } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('citizen');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const roles = [
        { id: 'citizen', label: 'Citizen', icon: User, placeholder: 'Aadhaar (XXXX-XXXX-XXXX)' },
        { id: 'police', label: 'Police', icon: Shield, placeholder: 'Station ID (PS-001)' },
        { id: 'court', label: 'Court', icon: Gavel, placeholder: 'Court ID (CRT-001)' },
        { id: 'lawyer', label: 'Lawyer', icon: Scale, placeholder: 'Lawyer ID (LAW-001)' },
        { id: 'finance', label: 'Finance', icon: DollarSign, placeholder: 'Finance ID (FIN-001)' },
        { id: 'superadmin', label: 'Super Admin', icon: Lock, placeholder: 'Admin ID (SUPER-001)' },
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const result = login(id, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    const currentRole = roles.find(r => r.id === selectedRole);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Role Selection Sidebar */}
                <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-6 border-r border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Select Role</h2>
                    <div className="space-y-2">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => { setSelectedRole(role.id); setError(''); }}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                        selectedRole === role.id
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{role.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Login Form */}
                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Login to your CourtSphere account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {currentRole.label} ID
                            </label>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder={currentRole.placeholder}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Login as {currentRole.label}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        CourtSphere Legal Management System &copy; 2026
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
