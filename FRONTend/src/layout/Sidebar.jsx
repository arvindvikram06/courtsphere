import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Home, Briefcase, CreditCard, FileText,
    User as UserIcon, LogOut, Moon, Sun, Shield
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Cases', path: '/cases', icon: Briefcase },
        { label: 'Payment', path: '/payments', icon: CreditCard },
        { label: 'Evidence', path: '/evidence', icon: Shield },
        { label: 'Case Summary', path: '/summary', icon: FileText },
        { label: 'Profile', path: '/profile', icon: UserIcon },
    ];

    // Access rules filtering could happen here, but for now we show all and handle access in pages
    // Or valid requirement: "Evidence visible only to Court + involved Citizen/Lawyer/Police"

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full shadow-lg transition-colors duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">CourtSphere</h1>
            </div>

            <div className="flex-1 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors relative",
                                active
                                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                            {active && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-full" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
