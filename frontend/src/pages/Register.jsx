import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, Mail, Lock, User, FileText, ArrowRight, Stethoscope, 
  UserCheck, Eye, EyeOff, ShieldCheck, Sparkles, Activity, Video, Award,
  Heart, Brain, Smile, Bone, UploadCloud, FileCheck, CheckCircle2, Trash2
} from 'lucide-react';
import Button from '../components/ui/Button';

const SPECIALTIES = [
  { id: 'Cardiology', label: 'Cardiology', icon: Heart, color: 'text-cyan-400', border: 'border-cyan-500/40 bg-cyan-500/10' },
  { id: 'Dermatology', label: 'Dermatology', icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500/40 bg-amber-500/10' },
  { id: 'Neurology', label: 'Neurology', icon: Brain, color: 'text-purple-400', border: 'border-purple-500/40 bg-purple-500/10' },
  { id: 'Pediatrics', label: 'Pediatrics', icon: Smile, color: 'text-emerald-400', border: 'border-emerald-500/40 bg-emerald-500/10' },
  { id: 'Orthopedics', label: 'Orthopedics', icon: Bone, color: 'text-rose-400', border: 'border-rose-500/40 bg-rose-500/10' },
  { id: 'General Medicine', label: 'General Med', icon: Stethoscope, color: 'text-blue-400', border: 'border-blue-500/40 bg-blue-500/10' }
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('PATIENT');
  
  // Doctor-specific fields
  const [specialty, setSpecialty] = useState('Cardiology');
  const [licenseNumber, setLicenseNumber] = useState('MD-LIC-2024-8849');
  const [uploadedFile, setUploadedFile] = useState({
    name: 'medical_board_license_cert.pdf',
    size: '2.4 MB',
    uploadedAt: 'Ready for verification'
  });
  const [isDragging, setIsDragging] = useState(false);
  const [agreedBoard, setAgreedBoard] = useState(true);
  const [agreedEthics, setAgreedEthics] = useState(true);
  const [agreedPending, setAgreedPending] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { register } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Ready for verification'
      });
      toast.success(`Attached "${file.name}" for board verification.`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Ready for verification'
      });
      toast.success(`Attached "${file.name}" for board verification.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'DOCTOR') {
      if (!agreedBoard || !agreedEthics || !agreedPending) {
        const msg = 'Please complete all verification checklist agreements before submitting.';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!licenseNumber.trim()) {
        const msg = 'Please provide your official Medical License number.';
        setError(msg);
        toast.error(msg);
        return;
      }
    }

    setLoading(true);
    try {
      const credentialsString = role === 'DOCTOR' 
        ? `${specialty} - Lic #${licenseNumber} (${uploadedFile ? uploadedFile.name : 'Document Verified'})`
        : null;

      await register({ 
        name, 
        email, 
        password, 
        role, 
        credentials: credentialsString 
      });

      toast.success('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10 my-6">
        
        {/* Left Showcase Panel: Pillars & Clinical Trust */}
        <div className="lg:col-span-5 space-y-6 text-left lg:sticky lg:top-24">
          
          {/* Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/25">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Byte<span className="text-cyan-400">Med</span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">Network</span>
              </span>
              <p className="text-xs text-slate-400">Community-First Telehealth Platform</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Join the Next Era of <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Collaborative Medicine.
              </span>
            </h1>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              Whether you are seeking instant medical guidance or a board-certified physician contributing evidence-based care, ByteMed gives you the clinical tools to connect seamlessly.
            </p>
          </div>

          {/* Three Architectural Pillars */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-3 hover:border-cyan-500/30 transition">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">AI Clinical Triage & Synthesis</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Natural language intake translates patient symptoms into clinical specialties and urgency flags automatically.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-3 hover:border-indigo-500/30 transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">8-Bit Plus-Rank Contribution Model</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Physicians build peer-acknowledged reputation (Plus 1 to Plus 8 Master) based purely on clinical guidance quality and responsiveness.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-3 hover:border-emerald-500/30 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Video className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Atomic Reservation Consultations</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Real-time video encounters with server-side atomic locking to guarantee zero double-booking during live hours.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Board Verified Credentials
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> HIPAA Security Standards
            </span>
          </div>

        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl relative overflow-hidden">
            
            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your account role to configure your personalized clinical environment.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRole('PATIENT')}
                    className={`py-2.5 px-3 rounded-lg text-left flex items-center space-x-2.5 transition-all ${
                      role === 'PATIENT'
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-white shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <UserCheck className={`w-4 h-4 ${role === 'PATIENT' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-semibold text-xs text-white">Patient Account</div>
                      <div className="text-[10px] text-slate-400">Ask queries & consult</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DOCTOR')}
                    className={`py-2.5 px-3 rounded-lg text-left flex items-center space-x-2.5 transition-all ${
                      role === 'DOCTOR'
                        ? 'bg-indigo-500/20 border border-indigo-500/50 text-white shadow-md shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Stethoscope className={`w-4 h-4 ${role === 'DOCTOR' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-semibold text-xs text-white">Physician (MD)</div>
                      <div className="text-[10px] text-slate-400">Respond & build rank</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Basic Fields Grid */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={role === 'DOCTOR' ? 'Dr. Sarah Connor' : 'Alice Johnson'}
                      className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@hospital.org"
                      className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 characters"
                    className="block w-full pl-9 pr-10 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* DOCTOR ENHANCEMENT SUITE */}
              {role === 'DOCTOR' && (
                <div className="space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in duration-300">
                  
                  {/* Specialty Selector with Medical Icons */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Primary Medical Specialty</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Auto-assigned for query routing</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SPECIALTIES.map((spec) => {
                        const Icon = spec.icon;
                        const isSelected = specialty === spec.id;
                        return (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => setSpecialty(spec.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                              isSelected
                                ? `${spec.border} ring-1 ring-cyan-500/40 text-white shadow-sm`
                                : 'bg-slate-900/50 border-slate-800/90 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${spec.color}`} />
                            <span className="text-xs font-medium truncate">{spec.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Medical License Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      State / National Medical License Number
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <FileText className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                        placeholder="e.g. MD-LIC-2024-8849"
                        className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  {/* Drag-and-Drop License Upload Mock Area */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Medical Board Certification Document</span>
                      <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 10MB)</span>
                    </label>
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />

                    {uploadedFile ? (
                      /* File Preview Chip */
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                            <FileCheck className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                              {uploadedFile.name}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                              <span>{uploadedFile.size}</span>
                              <span>•</span>
                              <span className="text-cyan-400 font-medium">{uploadedFile.uploadedAt}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Remove document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Drop Area */
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-cyan-400 bg-cyan-500/10'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                        }`}
                      >
                        <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-medium text-white">
                          Click to browse or drag and drop certification
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Verification document encrypted according to HIPAA guidelines
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Verification Safety Checklist */}
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      Physician Board Verification Checklist
                    </p>
                    
                    <label className="flex items-start space-x-2.5 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={agreedBoard}
                        onChange={(e) => setAgreedBoard(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-slate-800"
                      />
                      <span className="text-[11px] text-slate-300 leading-snug">
                        I certify that my medical license is current, active, and in good standing with official medical boards.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2.5 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={agreedEthics}
                        onChange={(e) => setAgreedEthics(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-slate-800"
                      />
                      <span className="text-[11px] text-slate-300 leading-snug">
                        I commit to evidence-based medical advice and ByteMed's clinical triage ethical standards.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2.5 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={agreedPending}
                        onChange={(e) => setAgreedPending(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-slate-800"
                      />
                      <span className="text-[11px] text-slate-300 leading-snug">
                        I understand that newly submitted physician profiles start in <span className="text-amber-400 font-semibold">Pending Review</span> status until verification is approved.
                      </span>
                    </label>
                  </div>

                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-2"
                icon={ArrowRight}
              >
                {role === 'DOCTOR' ? 'Submit Physician Application' : 'Create Patient Account'}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already registered with ByteMed?{' '}
                <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition">
                  Sign in to your account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
