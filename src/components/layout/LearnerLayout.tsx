import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookA, Pencil, Mic, Trophy, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LearnerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/learner/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
    { name: 'Vocabulary', path: '/learner/vocabulary', icon: BookA },
    { name: 'Grammar', path: '/learner/grammar', icon: Pencil },
    { name: 'Speaking', path: '/learner/speaking', icon: Mic },
    { name: 'Progress', path: '/learner/progress', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-600">
            <BookA size={28} />
            <span className="text-xl font-bold">English Learn</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-600">Level: <span className="font-semibold text-indigo-600">{user?.courseLevel}</span></span>
            <div className="flex items-center space-x-2 text-orange-500">
              <span className="font-bold">{user?.streak} 🔥</span>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-indigo-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 py-8 pr-8 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 min-h-[calc(100vh-8rem)] p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
