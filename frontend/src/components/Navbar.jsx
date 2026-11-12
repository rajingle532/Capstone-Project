import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, User, HeartPulse, Trophy, LayoutDashboard, 
  ChevronDown, CheckCircle2, Stethoscope, UserCheck, Clock,
  Sparkles, Activity, RefreshCw
} from 'lucide-react';
import RankBadge, { parseRankLevel } from './ui/RankBadge';

const DEMO_ACCOUNTS = [
  {
    role: 'PATIENT',
    name: 'Alice Johnson',
    email: 'patient.alice@bytemed.com',
    label: 'Patient Alice',
    badge: 'Patient',
    desc: 'Ask inquiries & book live consults',
    icon: UserCheck,
    color: 'text-cyan-400'
  },
  {
    role: 'DOCTOR',
    name: 'Dr. Eleanor Smith',
    email: 'doctor.smith@bytemed.com',
    label: 'Dr. Smith',
    badge: 'Plus 8 Master',
    desc: 'Verified Doctor, Live Available',
    icon: Stethoscope,
    color: 'text-amber-400'
  },
  {
    role: 'DOCTOR',
    name: 'Dr. Sarah Connor',
    email: 'doctor.pending@bytemed.com',
    label: 'Dr. Connor',
    badge: 'Pending Review',
    desc: 'Simulate Admin verification pipeline',
    icon: Clock,
    color: 'text-indigo-400'
  }
];

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    toast.info('Signed out of ByteMed successfully');
    navigate('/login');
  };

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // One-click demo role switcher
  const handleSwitchAccount = async (account) => {
    if (user?.email === account.email) {
      toast.info(`Already signed in as ${account.name}`);
      return;
    }
    setSwitching(true);
    try {
      const loggedUser = await login(account.email, 'password123');
      toast.success(`Quick-switched to ${loggedUser.role === 'DOCTOR' ? 'Dr. ' : ''}${loggedUser.name}`);
      setMenuOpen(false);
      navigate(loggedUser.role === 'DOCTOR' ? '/doctor' : '/patient');
    } catch (err) {
      toast.error('Failed to switch accounts');
    } finally {
      setSwitching(false);
    }
  };

  const isLeaderboard = location.pathname === '/leaderboard';
  const isPortal = location.pathname === '/' || location.pathname === '/patient' || location.pathname === '/doctor';

  const doctorRankLevel = user?.role === 'DOCTOR' ? parseRankLevel(user?.plusRank) : 1;
  const doctorRankPercent = Math.round((doctorRankLevel / 8) * 100);

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Floating Island Container with Backdrop Blur 2XL and Ambient Underglow */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl shadow-2xl shadow-cyan-500/5 transition-all duration-300">
        
        {/* Subtle Ambient Underglow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-transparent -z-10 blur-md pointer-events-none opacity-80" />

        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand & System Health Indicator */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Byte<span className="text-cyan-400">Med</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* System Health Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">ByteMed Network Live</span>
              <span className="text-slate-600 font-mono">v1.0</span>
            </div>

            {/* Navigation Tabs with Active State Indicators */}
            {user && (
              <nav className="flex items-center space-x-1.5 pl-2 sm:pl-4 border-l border-slate-800/80">
                <Link
                  to="/"
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 ${
                    isPortal && !isLeaderboard
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Portal</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1.5 ${
                    isLeaderboard
                      ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leaderboard</span>
                </Link>
              </nav>
            )}
          </div>

          {/* User Controls & Dropdown Menu */}
          {user ? (
            <div className="relative flex items-center space-x-3" ref={dropdownRef}>
              
              {/* Doctor Rank Quick Pill (Desktop) */}
              {user.role === 'DOCTOR' && (
                <div className="hidden md:flex items-center space-x-2">
                  <RankBadge rank={user.plusRank || 'Plus 1 (+)'} size="xs" />
                </div>
              )}

              {/* User Avatar with Online Dot & Trigger Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all duration-200 ${
                  menuOpen 
                    ? 'bg-slate-900 border-cyan-500/40 ring-2 ring-cyan-500/20' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
                title="Account & Quick-Switch Menu"
              >
                {/* Avatar with Online Status Dot */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-cyan-500/30 flex items-center justify-center text-cyan-200 font-bold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>

                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                    {user.role === 'DOCTOR' ? `Dr. ${user.name}` : user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {user.role === 'DOCTOR' ? 'Physician' : 'Patient'}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {/* Enhanced User Profile & Quick-Switch Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-14 w-80 rounded-2xl glass-panel-elevated border border-slate-700/80 shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 z-50">
                  
                  {/* Account Header */}
                  <div className="flex items-start space-x-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-white truncate">
                          {user.role === 'DOCTOR' ? `Dr. ${user.name}` : user.name}
                        </span>
                        {user.role === 'DOCTOR' && user.status === 'VERIFIED' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      
                      {/* Role Pill */}
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          user.role === 'DOCTOR'
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        }`}>
                          {user.role === 'DOCTOR' ? 'Verified Physician' : 'Active Patient'}
                        </span>

                        {user.role === 'DOCTOR' && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {user.status || 'VERIFIED'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* For Doctors: Live Plus-Rank Progress Percentage */}
                  {user.role === 'DOCTOR' && (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>8-Bit Rank Progress</span>
                        </span>
                        <span className="font-mono font-bold text-cyan-300">
                          {doctorRankPercent}% (Tier {doctorRankLevel}/8)
                        </span>
                      </div>
                      
                      {/* Mini 8-Segment Progress Track */}
                      <div className="grid grid-cols-8 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-950 p-0.5 border border-slate-800">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => (
                          <div
                            key={lvl}
                            className={`h-full rounded-sm transition-all ${
                              lvl <= doctorRankLevel 
                                ? lvl === 8 
                                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50' 
                                  : 'bg-cyan-400' 
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* One-Click Demo Role Switcher */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Quick-Switch Role</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Demo Sandbox</span>
                    </div>

                    <div className="space-y-1.5">
                      {DEMO_ACCOUNTS.map(acc => {
                        const isCurrent = user.email === acc.email;
                        const Icon = acc.icon;

                        return (
                          <button
                            key={acc.email}
                            disabled={switching || isCurrent}
                            onClick={() => handleSwitchAccount(acc)}
                            className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                              isCurrent
                                ? 'bg-cyan-500/10 border border-cyan-500/30 text-white font-semibold'
                                : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <Icon className={`w-4 h-4 flex-shrink-0 ${acc.color}`} />
                              <div className="truncate">
                                <div className="font-medium truncate">{acc.label}</div>
                                <div className="text-[10px] text-slate-500 truncate">{acc.desc}</div>
                              </div>
                            </div>

                            {isCurrent ? (
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">
                                Switch
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center space-x-1.5 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of ByteMed</span>
                    </button>
                  </div>

                </div>
              )}

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
      </div>
    </header>
  );
};

export default Navbar;
