import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Gavel, CreditCard, FileText, BookOpen, User, LogOut, Sun, Moon, Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const menuItems = [
        { name: 'Home', icon: <Home size={20} />, path: '/', roles: ['all'] },
        { name: 'Cases', icon: <Gavel size={20} />, path: '/cases', roles: ['all'] },
        { name: 'Payments', icon: <CreditCard size={20} />, path: '/payments', roles: ['all'] },
        { name: 'Evidence', icon: <FileText size={20} />, path: '/evidence', roles: ['court', 'citizen', 'lawyer', 'police'] },
        { name: 'Case Summary', icon: <BookOpen size={20} />, path: '/summary', roles: ['all'] },
        { name: 'Profile', icon: <User size={20} />, path: '/profile', roles: ['all'] },
    ];

    const filteredItems = menuItems.filter(item =>
        item.roles.includes('all') || item.roles.includes(user.role)
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Scale size={24} />
                </div>
                <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                    CourtSphere
                </Link>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {filteredItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
