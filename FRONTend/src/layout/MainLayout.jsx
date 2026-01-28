import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
