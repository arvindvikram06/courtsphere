import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCases, getPayments } from '../utils/api';
import { Briefcase, CreditCard, Gavel, Calendar, UserPlus, FileText } from 'lucide-react';
import clsx from 'clsx';

const Home = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState({
        myCases: [],
        pendingPayments: [],
        hearingsToday: [],
        favCases: [], // Mock
        lawyerRequests: [], // Mock
        caseStatus: []
    });

    useEffect(() => {
        const allCases = getCases();
        const allPayments = getPayments();

        // Filter cases based on role
        let relevantCases = [];
        if (user?.role === 'citizen') {
            relevantCases = allCases.filter(c => c.complainant === user.id || c.accused === user.id);
        } else if (user?.role === 'lawyer') {
            relevantCases = allCases.filter(c => c.lawyer === user.id);
        } else {
            // Court, Police, Superadmin see all (simplified logic)
            relevantCases = allCases;
        }

        // Filter payments
        let relevantPayments = [];
        if (user?.role === 'citizen') {
            relevantPayments = allPayments.filter(p => p.paidBy === user.id && p.status === 'Waiting Approval');
        } else if (user?.role === 'finance' || user?.role === 'court') {
            relevantPayments = allPayments.filter(p => p.status === 'Waiting Approval');
        }

        // Hearings (mock date logic, showing all relevant)
        const hearings = relevantCases.filter(c => c.hearings && c.hearings.length > 0);

        setMetrics({
            myCases: relevantCases,
            pendingPayments: relevantPayments,
            hearingsToday: hearings, // loosely using all hearings as "upcoming"
            favCases: [],
            lawyerRequests: [],
            caseStatus: relevantCases
        });
    }, [user]);

    const Widget = ({ title, value, icon: Icon, color, subtext, onClick }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                    {subtext && <p className="text-xs text-green-500 mt-1">{subtext}</p>}
                </div>
                <div className={clsx("p-3 rounded-lg", color)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Widget
                    title="My Cases"
                    value={metrics.myCases.length}
                    icon={Briefcase}
                    color="bg-blue-500"
                    subtext="+2 new this month"
                />
                <Widget
                    title="Pending Payments"
                    value={metrics.pendingPayments.length}
                    icon={CreditCard}
                    color="bg-orange-500"
                    subtext="Action required"
                />
                <Widget
                    title="Hearings Today"
                    value={metrics.hearingsToday.length}
                    icon={Calendar}
                    color="bg-purple-500"
                    subtext="Next: 10:00 AM"
                />
                <Widget
                    title="Favourite Cases"
                    value="0"
                    icon={UserPlus}
                    color="bg-pink-500"
                    subtext="Pro Bono available"
                />
                <Widget
                    title="Lawyer Requests"
                    value="0"
                    icon={Gavel}
                    color="bg-indigo-500"
                    subtext="Pending acceptance"
                />
                <Widget
                    title="Case Status"
                    value="Active"
                    icon={FileText}
                    color="bg-teal-500"
                    subtext="System operational"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Mock activity */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Case CASE-00{i} updated by Court</p>
                                <span className="text-xs text-slate-400 ml-auto">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Pro Bono Cases</h3>
                        <p className="text-indigo-100 mb-6 max-w-sm">Help those in need. Register for Pro Bono cases today and make a difference.</p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                            View Available Cases
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400 rounded-full opacity-50 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;
