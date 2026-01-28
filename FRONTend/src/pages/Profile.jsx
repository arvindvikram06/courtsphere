import { useAuth } from '../context/AuthContext';
import { User, CreditCard, Shield, Phone, Calendar } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">User Profile</h1>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg">
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                        <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mt-2 capitalize">
                            {user.role}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-white dark:bg-slate-600 rounded-lg text-indigo-500 shadow-sm">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">User ID</p>
                                <p className="font-medium text-slate-900 dark:text-white">{user.id}</p>
                            </div>
                        </div>

                        {user.phone && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg text-green-500 shadow-sm">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Phone</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user.phone}</p>
                                </div>
                            </div>
                        )}

                        {user.dob && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg text-orange-500 shadow-sm">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Date of Birth</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user.dob}</p>
                                </div>
                            </div>
                        )}

                        {(user.role === 'lawyer') && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
                                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg text-purple-500 shadow-sm">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Performance</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{user.casesWon} Wins / {user.casesHandled} Cases</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Security</h3>
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
