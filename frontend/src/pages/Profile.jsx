import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, Calendar, Shield, MapPin, Award, CheckCircle, TrendingUp, Briefcase
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/users/profile');
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-600/20">
                    <User size={48} />
                </div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mt-1">{profile.role} • {profile.userId}</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Shield size={20} className="text-indigo-600" />
                        Basic Information
                    </h2>
                    <div className="space-y-4">
                        <InfoItem icon={<Phone size={16} />} label="Contact Number" value={profile.phone} />
                        {profile.dob && <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={new Date(profile.dob).toLocaleDateString()} />}
                        {profile.aadhaar && <InfoItem icon={<MapPin size={16} />} label="Aadhaar ID" value={profile.aadhaar} />}
                        <InfoItem icon={<Shield size={16} />} label="Role Access" value={profile.role.toUpperCase()} />
                    </div>
                </div>

                {profile.role === 'lawyer' && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Award size={20} className="text-indigo-600" />
                            Professional Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <p className="text-xs text-slate-400 mb-1">Success Rate</p>
                                <p className="text-2xl font-bold text-emerald-500">
                                    {profile.casesHandled > 0 ? Math.round((profile.casesWon / profile.casesHandled) * 100) : 0}%
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <p className="text-xs text-slate-400 mb-1">Status</p>
                                <p className={`text-sm font-bold ${profile.availability ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {profile.availability ? 'AVAILABLE' : 'IN SESSION'}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl col-span-2 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Specialization</p>
                                    <p className="text-sm font-bold">{profile.specialization}</p>
                                </div>
                                <Briefcase className="text-slate-300" size={24} />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <div className="flex-1 text-center">
                                <p className="text-2xl font-bold">{profile.casesHandled}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Handled</p>
                            </div>
                            <div className="flex-1 text-center border-x border-slate-100 dark:border-slate-700">
                                <p className="text-2xl font-bold text-emerald-500">{profile.casesWon}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Won</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-2xl font-bold text-rose-500">{profile.casesHandled - profile.casesWon}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Lost</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-indigo-600 p-8 rounded-4xl text-white shadow-xl shadow-indigo-600/20 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Security Verification</h2>
                    <p className="text-indigo-100 text-sm max-w-sm mb-6">Your profile is protected with enterprise-grade JWT encryption. Keep your ID and password confidential.</p>
                    <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                        Update Security Credentials
                    </button>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <Shield size={200} />
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="font-medium text-sm">{value}</p>
        </div>
    </div>
);

export default Profile;
