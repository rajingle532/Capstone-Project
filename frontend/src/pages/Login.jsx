import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, Lock, Mail, ArrowRight, UserCheck, Stethoscope, 
  Clock, Eye, EyeOff, ShieldCheck, Sparkles, Activity, Video, Award 
} from 'lucide-react';
import Button from '../components/ui/Button';
import RankBadge from '../components/ui/RankBadge';

const DEMO_USERS = [
  {
    role: 'PATIENT',
    name: 'Alice Johnson',
    email: 'patient.alice@bytemed.com',
    label: 'Patient Alice',
    badge: 'Patient',
    desc: 'Ask inquiries & book live consults',
    icon: UserCheck,
    color: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/50'
  },
  {
    role: 'DOCTOR',
    name: 'Dr. Eleanor Smith',
    email: 'doctor.smith@bytemed.com',
    label: 'Dr. Smith',
    badge: 'Plus 8 Master',
    desc: 'Verified Doctor, Live Available',
    icon: Stethoscope,
    color: 'text-amber-400',
    borderColor: 'hover:border-amber-500/50'
  },
  {
    role: 'DOCTOR',
    name: 'Dr. Sarah Connor',
    email: 'doctor.pending@bytemed.com',
    label: 'Dr. Connor',
    badge: 'Pending Review',
    desc: 'Simulate Admin verification pipeline',
    icon: Clock,
    color: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/50'
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.role === 'DOCTOR' ? 'Dr. ' : ''}${user.name}!`);
      if (user.role === 'DOCTOR') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Showcase Panel: ByteMed's Three Pillars */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/25">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Byte<span className="text-cyan-400">Med</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tracking-wider uppercase">
                  Community Health
                </span>
              </div>
              <p className="text-xs text-slate-400">Community-first physician response & telehealth</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Collaborative healthcare <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                powered by doctors & AI.
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-lg">
              Patients describe symptoms naturally in one simple paragraph. Verified physicians provide version-controlled guidance or instantaneous on-demand video consultations.
            </p>
          </div>

          {/* Three Core Architectural Pillars */}
          <div className="space-y-3.5 pt-2">
            
            {/* Pillar 1: AI Clinical Triage */}
            <div className="p-3.5 rounded-2xl glass-panel border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-start space-x-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>AI Clinical Triage</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">Real-Time</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Automatic specialty routing, clinical title synthesis, and immediate emergency screening (911 escalation gate).
                </p>
              </div>
            </div>

            {/* Pillar 2: 8-Bit Plus-Rank Ladder */}
            <div className="p-3.5 rounded-2xl glass-panel border border-slate-800/80 hover:border-amber-500/40 transition-all flex items-start space-x-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>8-Bit Plus-Rank System</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Byte = 8 Bits</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Physicians advance through 8 contribution tiers (Plus 1 to Plus 8 Master) based on verified helpfulness ratings.
                </p>
              </div>
            </div>

            {/* Pillar 3: On-Demand Video Consultations */}
            <div className="p-3.5 rounded-2xl glass-panel border border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-start space-x-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Instant Telehealth Consultations</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Atomic Lock</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Real-time camera feed with in-call clinical notes drawer and server-enforced atomic availability lock to avoid double-booking.
                </p>
              </div>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-base font-extrabold text-white">8 Ranks</div>
              <div className="text-[10px] text-slate-400">Byte Contribution</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-base font-extrabold text-cyan-400">6 Specialties</div>
              <div className="text-[10px] text-slate-400">Clinical Coverage</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <div className="text-base font-extrabold text-emerald-400">100% Free</div>
              <div className="text-[10px] text-slate-400">Community Access</div>
            </div>
          </div>

        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl space-y-6">
            
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Sign In to ByteMed
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your consultation portal or physician command center.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input with Icon */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@domain.com"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-2"
                icon={ArrowRight}
              >
                Sign In to Account
              </Button>
            </form>

            {/* Polished One-Click Demo Role Cards */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Sandbox Demo Accounts
                </span>
                <span className="text-[10px] text-cyan-400">Click to fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_USERS.map((usr) => {
                  const Icon = usr.icon;
                  return (
                    <button
                      key={usr.email}
                      type="button"
                      onClick={() => handleDemoFill(usr.email, 'password123')}
                      className={`p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 ${usr.borderColor} text-left transition-all duration-200 group flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${usr.color}`} />
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {usr.badge}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                          {usr.label}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {usr.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                New to ByteMed?{' '}
                <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition underline underline-offset-2">
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
