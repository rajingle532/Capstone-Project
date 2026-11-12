import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck, User, HeartPulse, Trophy, LayoutDashboard } from 'lucide-react';
import RankBadge from './ui/RankBadge';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info('Signed out of ByteMed successfully');
    navigate('/login');
  };

  const isLeaderboard = location.pathname === '/leaderboard';

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Nav Links */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <HeartPulse className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Byte<span className="text-cyan-400">Med</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tracking-wide uppercase">
                  Community Health
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="flex items-center space-x-1">
              <Link
                to="/"
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                  !isLeaderboard
                    ? 'bg-slate-900 text-cyan-400 border border-slate-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal</span>
              </Link>
              <Link
                to="/leaderboard"
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                  isLeaderboard
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </Link>
            </nav>
          )}
        </div>

        {/* User Info & Controls */}
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Role & Verification Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold ${
                user.role === 'DOCTOR' 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {user.role === 'DOCTOR' ? 'Physician' : 'Patient'}
              </span>

              {user.role === 'DOCTOR' && user.status === 'VERIFIED' && (
                <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}

              {user.role === 'DOCTOR' && (
                <RankBadge rank={user.plusRank || 'Plus 1 (+)'} size="xs" />
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-200 font-bold text-xs border border-slate-700">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-semibold text-slate-200 max-w-[110px] truncate hidden md:inline">
                {user.role === 'DOCTOR' ? `Dr. ${user.name}` : user.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-cyan-500/40"
            >
              Get Started
            </Link>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
