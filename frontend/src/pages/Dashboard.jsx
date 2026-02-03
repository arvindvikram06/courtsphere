import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Gavel, CreditCard, Clock, Star, Users, Briefcase, Activity, Landmark, FileText, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        cases: 0,
        payments: 0,
        hearings: 0,
        lawyers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: cases } = await axios.get('http://localhost:5000/api/cases');
                const { data: payments } = await axios.get('http://localhost:5000/api/payments');

                setStats({
                    cases: cases.length,
                    payments: payments.filter(p => p.status === 'waiting').length,
                    hearings: cases.reduce((acc, curr) => acc + curr.hearings.length, 0),
                    lawyers: user.role === 'citizen' || user.role === 'police' ? 124 : 0
                });
            } catch (err) {
                console.error('Error fetching dashboard stats');
            }
        };
        fetchStats();
    }, [user.role]);

    const widgets = [
        {
            title: 'Active Cases',
            value: stats.cases,
            icon: <Gavel className="text-indigo-600" size={24} />,
            desc: 'Ongoing judicial matters',
            color: 'indigo'
        },
        {
            title: 'Pending Payments',
            value: stats.payments,
            icon: <CreditCard className="text-rose-600" size={24} />,
            desc: 'Fees awaiting clearance',
            color: 'rose'
        },
        {
            title: 'Upcoming Hearings',
            value: stats.hearings,
            icon: <Clock className="text-emerald-600" size={24} />,
            desc: 'Scheduled court appearances',
            color: 'emerald'
        },
        {
            title: 'Favorite Cases',
            value: '12',
            icon: <Star className="text-amber-500" size={24} />,
            desc: 'Bookmarked for quick access',
            color: 'amber'
        },
        {
            title: 'Lawyer Availability',
            value: 'Ready',
            icon: <Users className="text-blue-600" size={24} />,
            desc: 'Public prosecutors in session',
            color: 'blue'
        },
        {
            title: 'System Status',
            value: 'Optimal',
            icon: <Activity className="text-violet-600" size={24} />,
            desc: 'Secure node connectivity',
            color: 'violet'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
                <p className="text-slate-500 flex items-center gap-2">
                    <Landmark size={18} />
                    {user.role.toUpperCase()} Portal • Station ID: {user.userId}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {widgets.map((w, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${w.color}-50 dark:bg-${w.color}-900/20`}>
                                {w.icon}
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{w.title}</h3>
                            <p className="text-3xl font-bold">{w.value}</p>
                            <p className="text-xs text-slate-400 mt-2">{w.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Briefcase size={22} className="text-indigo-500" />
                        Recent Activity
                    </h2>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-sm">Hearing updated for CASE-2024-000{i}</p>
                                    <p className="text-xs text-slate-400 mt-1">2 hours ago • Judge Rao</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Legal Guidance</h2>
                        <p className="text-indigo-100 mb-6 text-sm">Need immediate assistance with a pro bono request? Connect with our top-rated legal aids today.</p>
                        <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                            Find a Lawyer
                        </button>
                    </div>
                    <FileText size={120} className="absolute -right-10 -bottom-10 text-indigo-500/30 rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
