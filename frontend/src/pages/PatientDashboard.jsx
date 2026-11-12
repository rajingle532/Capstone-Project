import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Send, HeartPulse, Video, Star, Clock, 
  MessageSquare, ShieldCheck, Activity, Search, Sparkles, Filter,
  Paperclip, Image as ImageIcon, X, History, CheckCircle2, ChevronRight,
  Info, ExternalLink
} from 'lucide-react';
import { 
  RankBadge, 
  CategoryBadge, 
  TriageAlert, 
  Button, 
  Card, 
  Modal 
} from '../components/ui';

const CATEGORIES = ['All', 'General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'];
const EMERGENCY_KEYWORDS = [
  'chest pain', 'bleeding', 'heart attack', 'stroke', 
  'unconscious', 'breathing difficulty', 'severe burn', 'head injury'
];

const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe', 'Acute'];
const DURATION_PRESETS = ['Just started (<24h)', '2–3 days', '1–2 weeks', 'Chronic (>1 month)'];

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'answered' | 'unanswered' | 'emergency'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Patient single-paragraph symptom input
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [bookingDocId, setBookingDocId] = useState(null);

  // Live detection of emergency keywords for clinical safety
  const matchedEmergencyKeywords = EMERGENCY_KEYWORDS.filter(kw => 
    description.toLowerCase().includes(kw)
  );
  const isEmergencyTyping = matchedEmergencyKeywords.length > 0;

  const fetchQueries = async () => {
    try {
      const url = selectedCategory === 'All' 
        ? '/queries' 
        : `/queries?category=${encodeURIComponent(selectedCategory)}`;
      const { data } = await api.get(url);
      setQueries(data);
    } catch (err) {
      console.error('Error fetching queries:', err);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const { data } = await api.get('/doctors/available');
      setAvailableDoctors(data);
    } catch (err) {
      console.error('Error fetching available doctors:', err);
    }
  };

  useEffect(() => {
    fetchQueries();
    fetchAvailableDoctors();
    const interval = setInterval(fetchAvailableDoctors, 6000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file'
    }));

    setAttachedFiles(prev => [...prev, ...newAttachments]);
    toast.info(`Attached ${files.length} diagnostic file(s)`);
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.warning('Please describe what you are experiencing.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/queries', {
        description: description.trim(),
        patientId: user.id
      });
      setDescription('');
      setAttachedFiles([]);
      toast.success(`Inquiry triaged into ${data.category}! Posted to verified doctors.`);
      fetchQueries();
    } catch (err) {
      toast.error('Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookDoctor = async (doctorId) => {
    setBookingDocId(doctorId);
    try {
      const { data } = await api.post(`/doctors/${doctorId}/book`);
      toast.success('Doctor claimed! Connecting to secure telehealth room...');
      navigate(data.roomUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Doctor is no longer available. Another patient may have booked just now.');
      fetchAvailableDoctors();
    } finally {
      setBookingDocId(null);
    }
  };

  // Filter queries by search & tab
  const filteredQueries = queries.filter(q => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    if (feedFilter === 'emergency') return q.aiTriage?.isEmergency;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero / Patient Greeting & Quick Stats */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                <span>Patient Health Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello, {user.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Get asynchronous physician reviews on the community board or initiate instantaneous live video consultations with verified doctors.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[110px]">
                <div className="text-xl font-extrabold text-cyan-400">{availableDoctors.length}</div>
                <div className="text-[11px] font-medium text-slate-400">Live Doctors</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center min-w-[110px]">
                <div className="text-xl font-extrabold text-white">{queries.length}</div>
                <div className="text-[11px] font-medium text-slate-400">Open Queries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Doctors Online Banner */}
        <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="font-bold text-white text-base">On-Demand Live Consultations</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Server-enforced atomic lock guard enabled
            </span>
          </div>

          {availableDoctors.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-sm text-slate-400 space-y-1">
              <p className="font-medium text-slate-300">No physicians are currently live in the consultation queue.</p>
              <p className="text-xs text-slate-500">Submit an asynchronous query below and verified doctors will review and respond promptly.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDoctors.map(doc => (
                <div key={doc._id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-cyan-500/40 transition duration-200">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-white truncate">Dr. {doc.name}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="mt-1">
                      <RankBadge rank={doc.plusRank || 'Plus 1 (+)'} size="xs" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-1">
                      {doc.credentials || 'Licensed Medical Practitioner'}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="emerald"
                    disabled={bookingDocId === doc._id}
                    isLoading={bookingDocId === doc._id}
                    onClick={() => handleBookDoctor(doc._id)}
                    icon={Video}
                  >
                    Consult Live
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main 2-Column Section: Query Creation & Community Board */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: One-Paragraph Ask Query Form */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800/80 sticky top-24 space-y-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Clinical Routing</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Tell Us What's Happening
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Describe your symptoms in your own words. Our medical AI will automatically analyze your description, generate a clinical summary title, and route it to the right specialist.
              </p>
            </div>

            <form onSubmit={handleSubmitQuery} className="space-y-4">
              {/* Single Paragraph Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Describe What You're Experiencing
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Tell us what is happening... For example:
'I've had a persistent dull headache on the right side of my head for 3 days. It gets worse under bright lights and I feel slightly nauseous. I took paracetamol yesterday with only temporary relief.'"
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed"
                  />
                  
                  {/* Char counter */}
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
                    {description.trim().length} chars
                  </div>
                </div>
              </div>

              {/* AI Auto-Processing Live Feedback */}
              {description.trim().length > 15 && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center space-x-2 text-xs text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-[11px]">
                    <strong>AI Triage Active:</strong> Clinical title & specialty category will be generated automatically on submit.
                  </span>
                </div>
              )}

              {/* Attachment / Diagnostics Dropzone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Symptom Photos / Reports
                  </label>
                  <span className="text-[10px] text-slate-500">Optional</span>
                </div>
                
                <label className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-cyan-500/50 cursor-pointer transition text-xs text-slate-400">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Attach symptom photo or lab PDF</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center space-x-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="text-slate-200 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-500">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-slate-400 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Real-time AI Triage Preview Warning */}
              {isEmergencyTyping && (
                <TriageAlert 
                  isEmergency={true} 
                  confidenceScore={0.96} 
                  matchedKeywords={matchedEmergencyKeywords} 
                />
              )}

              <Button
                type="submit"
                isLoading={submitting}
                className="w-full"
                icon={Send}
              >
                Submit to Verified Doctors
              </Button>
            </form>
          </div>

          {/* Right Column: Community Board */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filter & Search Header */}
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search symptoms or queries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                {/* Sub-tabs: All vs Emergency Flagged */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center text-xs">
                  <button
                    onClick={() => setFeedFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      feedFilter === 'all' 
                        ? 'bg-slate-800 text-white font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({queries.length})
                  </button>
                  <button
                    onClick={() => setFeedFilter('emergency')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center space-x-1 ${
                      feedFilter === 'emergency' 
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                        : 'text-rose-400/70 hover:text-rose-300'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Urgent Triage</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Queries Feed */}
            {filteredQueries.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-sm space-y-2">
                <p className="font-semibold text-slate-300">No medical inquiries found in this category.</p>
                <p className="text-xs text-slate-500">Submit an inquiry on the left to start receiving physician guidance.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredQueries.map(q => (
                  <div
                    key={q._id}
                    className={`glass-panel rounded-2xl p-6 border transition-all ${
                      q.aiTriage?.isEmergency
                        ? 'border-rose-500/60 bg-rose-950/20 shadow-lg shadow-rose-950/30'
                        : 'border-slate-800/80'
                    }`}
                  >
                    {/* Emergency Alert Banner */}
                    {q.aiTriage?.isEmergency && (
                      <TriageAlert
                        isEmergency={true}
                        confidenceScore={q.aiTriage?.confidenceScore || 0.9}
                        className="mb-4"
                      />
                    )}

                    {/* Query Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <CategoryBadge category={q.category} size="xs" />
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{q.title}</h3>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-900 border border-slate-800 text-slate-300 flex-shrink-0">
                        Asked by {q.patientId?.name || 'Patient'}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line">
                      {q.description}
                    </p>

                    {/* Responses Component */}
                    <div className="mt-6 pt-5 border-t border-slate-800/80">
                      <ResponsesSection queryId={q._id} />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
};

// Subcomponent for Doctor Responses list, Version History, & Star Rating
const ResponsesSection = ({ queryId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [versionModalData, setVersionModalData] = useState(null);
  const toast = useToast();

  const fetchResponses = async () => {
    try {
      const { data } = await api.get(`/responses/query/${queryId}`);
      setResponses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [queryId]);

  const handleRate = async (responseId, rating) => {
    try {
      await api.post(`/responses/${responseId}/rate`, { rating });
      toast.success(`Thank you! Submitted ${rating}-star feedback.`);
      fetchResponses();
    } catch (err) {
      toast.error('Could not submit rating');
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 animate-pulse">Loading verified doctor responses...</div>;
  }

  if (responses.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-500 italic">
        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
        <span>Awaiting verified doctor advice. Responses will be version-tracked.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
        <span>Verified Physician Advice ({responses.length})</span>
      </div>

      {responses.map(r => (
        <div key={r._id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          
          {/* Doctor Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-xs">
                MD
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-white">Dr. {r.doctorId?.name || 'Physician'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="mt-0.5">
                  <RankBadge rank={r.doctorId?.plusRank || 'Plus 1 (+)'} size="xs" />
                </div>
              </div>
            </div>

            {/* Version Badge & History Button */}
            {r.versions && r.versions.length > 1 ? (
              <button
                onClick={() => setVersionModalData(r)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center space-x-1 transition"
              >
                <History className="w-3 h-3" />
                <span>Revised (v{r.versions.length}.0) — View History</span>
              </button>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Original (v1.0)
              </span>
            )}
          </div>

          {/* Advice content */}
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 whitespace-pre-line">
            {r.currentContent}
          </p>

          {/* Rating Section */}
          <div className="pt-2 flex items-center justify-between text-xs flex-wrap gap-2">
            {r.rating ? (
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <span className="text-amber-400 flex tracking-widest text-sm">
                  {'★'.repeat(r.rating)}
                </span>
                <span className="text-xs text-slate-300">You rated this advice ({r.rating}/5)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-[11px]">Helpful advice? Rate response:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRate(r._id, star)}
                      className="text-slate-600 hover:text-amber-400 text-base leading-none transition transform hover:scale-125"
                      title={`Rate ${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Version History Modal */}
      {versionModalData && (
        <Modal
          isOpen={true}
          onClose={() => setVersionModalData(null)}
          title="Physician Response Revision History"
          subtitle={`Dr. ${versionModalData.doctorId?.name || 'Physician'} — ${versionModalData.versions.length} revisions tracked`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
              ByteMed records immutable version logs for all doctor responses to protect clinical auditability and patient trust.
            </div>

            <div className="space-y-3">
              {versionModalData.versions.map((ver, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      Version {idx + 1}.0 {idx === versionModalData.versions.length - 1 && '(Current Published)'}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {new Date(ver.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    {ver.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientDashboard;
