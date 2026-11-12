import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, Video, Send, Clock, Edit3, 
  History, CheckCircle2, MessageSquare, Filter, Sparkles, User, RefreshCw,
  Award, TrendingUp, HelpCircle, FileCheck, ArrowRight
} from 'lucide-react';
import { 
  RankBadge, 
  parseRankLevel, 
  CategoryBadge, 
  TriageAlert, 
  Button, 
  Card, 
  Modal 
} from '../components/ui';

const CATEGORIES = ['All', 'General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'];

const DoctorDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my-contributions' | 'urgent'
  const [availability, setAvailability] = useState(user?.availability || 'OFFLINE');
  const [approving, setApproving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [reputationModalOpen, setReputationModalOpen] = useState(false);

  const currentRankLevel = parseRankLevel(user?.plusRank);

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

  useEffect(() => {
    if (user?.status === 'VERIFIED') {
      fetchQueries();
    }
  }, [user?.status, selectedCategory]);

  const toggleAvailability = async () => {
    setToggling(true);
    const newState = availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    try {
      const { data } = await api.put(`/doctors/${user.id}/availability`, { availability: newState });
      setAvailability(data.availability);
      updateUser({ availability: data.availability });
      toast.info(`Telehealth status set to ${data.availability}`);
    } catch (err) {
      toast.error('Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

  const handleTestConsultation = async () => {
    try {
      const { data } = await api.post(`/doctors/${user.id}/book`);
      toast.success('Consultation session initialized! Launching video room...');
      navigate(data.roomUrl);
    } catch (err) {
      toast.warning('Doctor already in consultation or unavailable.');
    }
  };

  const handleApproveAccount = async () => {
    try {
      setApproving(true);
      const { data } = await api.put(`/doctors/${user.id}/approve`);
      updateUser({ status: data.status || 'VERIFIED' });
      toast.success('Physician license verified successfully!');
      navigate('/doctor');
    } catch (err) {
      toast.error('Failed to approve account');
    } finally {
      setApproving(false);
    }
  };

  // PENDING VERIFICATION SCREEN
  if (user?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-xl w-full glass-panel-elevated rounded-2xl p-8 sm:p-10 border border-slate-800 text-center relative overflow-hidden shadow-2xl space-y-6">
            
            {/* Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">Credentials Under Admin Review</h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Dr. {user.name}, your medical license and credentials have been submitted for verification. As required by ByteMed clinical safety protocols, patient communication unlocks upon verification.
              </p>
            </div>

            {/* Verification Pipeline Steps */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Verification Pipeline Progress
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Identity & Account Setup</span>
                  </div>
                  <span className="text-emerald-400 font-medium">Completed</span>
                </div>
                <div className="flex items-center justify-between text-amber-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Credential & Medical License Review</span>
                  </div>
                  <span className="text-amber-400 font-medium">In Queue</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Physician Privileges</span>
                  </div>
                  <span>Pending</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Submitted License:</span>
                <span className="font-mono text-cyan-300 truncate max-w-[200px]">
                  {user.credentials || 'MD Verification File'}
                </span>
              </div>
            </div>

            {/* Prototype Fast-Track Approval */}
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Prototype Admin Fast-Track</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">
                Simulate instant administrative verification to immediately unlock the Physician Command Center, open query answering, and live consultations.
              </p>
              
              <Button
                variant="emerald"
                size="md"
                isLoading={approving}
                onClick={handleApproveAccount}
                className="w-full"
                icon={CheckCircle2}
              >
                Simulate Admin Verification Approval
              </Button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Filter queries based on tab
  const filteredQueries = queries.filter(q => {
    if (activeTab === 'urgent') return q.aiTriage?.isEmergency;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Physician Profile & Live Availability Control Center */}
        <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left Info */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
                Dr
              </div>
              <div>
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                  <h1 className="text-2xl font-extrabold text-white">Dr. {user.name}</h1>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Physician</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400 flex-wrap gap-y-1">
                  <span>{user.credentials || 'Licensed Medical Practitioner'}</span>
                  <span>•</span>
                  <RankBadge rank={user.plusRank || 'Plus 1 (+)'} size="sm" showTitle={true} />
                </div>
              </div>
            </div>

            {/* Right: Live Availability Toggle & Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Reputation Explorer Button */}
              <button
                onClick={() => setReputationModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Rank Progress</span>
              </button>

              {/* Availability Switch */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Live Status:</span>
                <button
                  disabled={toggling}
                  onClick={toggleAvailability}
                  className={`relative inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    availability === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                      : availability === 'RESERVED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    availability === 'AVAILABLE' ? 'bg-emerald-400 animate-ping' : availability === 'RESERVED' ? 'bg-amber-400' : 'bg-slate-500'
                  }`}></span>
                  <span>{availability}</span>
                </button>
              </div>

              {/* Instant Test Consultation Launch */}
              {availability === 'AVAILABLE' && (
                <Button
                  size="sm"
                  onClick={handleTestConsultation}
                  icon={Video}
                >
                  Test Video Room
                </Button>
              )}

            </div>

          </div>

          {/* 8-Bit Rank Progression Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                ByteMed 8-Bit Rank Scale (Level {currentRankLevel} of 8)
              </span>
              <span className="font-mono text-cyan-300 text-[11px]">
                {Math.round((currentRankLevel / 8) * 100)}% Milestone
              </span>
            </div>
            
            {/* Visual 8-Segment Progress Track */}
            <div className="grid grid-cols-8 gap-1.5 h-2 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-slate-800">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div
                  key={step}
                  title={`Plus ${step} (${'+'.repeat(step)})`}
                  className={`h-full rounded-sm transition-all duration-300 ${
                    step <= currentRankLevel
                      ? step === 8 
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm shadow-amber-400/50' 
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                      : 'bg-slate-800/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar & Query Feed */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="font-bold text-white text-base">Community Triage Board</h2>
              <p className="text-xs text-slate-400">Review open patient inquiries, submit medical advice, and version previous responses.</p>
            </div>

            {/* Sub-tabs: All vs Urgent Flags */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Inquiries ({queries.length})
              </button>
              <button
                onClick={() => setActiveTab('urgent')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                  activeTab === 'urgent'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                    : 'bg-slate-900 text-rose-400/70 hover:text-rose-300 border border-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Urgent AI Triage</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Queries Grid */}
          {filteredQueries.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-sm space-y-2">
              <p className="font-semibold text-slate-300">No patient inquiries currently in this category.</p>
              <p className="text-xs text-slate-500">Check back shortly or select another medical category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {filteredQueries.map(q => (
                <DoctorQueryCard 
                  key={q._id} 
                  query={q} 
                  doctorId={user.id} 
                  onResponseUpdated={fetchQueries} 
                />
              ))}
            </div>
          )}

        </div>

      </main>

      {/* Reputation & Plus Rank Information Modal */}
      <Modal
        isOpen={reputationModalOpen}
        onClose={() => setReputationModalOpen(false)}
        title="ByteMed Plus-Rank Contribution Model"
        subtitle="Byte = 8 Bits → 8 Contribution Tiers (Plus 1 through Plus 8)"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 leading-relaxed">
            <strong>Architecture Boundary Rule:</strong> A high Plus rank reflects verified contribution history, peer review activity, and patient helpfulness ratings. It is a community contribution rank and must never be represented as a medical qualification.
          </div>

          <div className="space-y-2 text-xs">
            {[
              { lvl: 1, label: 'Plus 1 (+)', desc: 'Entry contribution tier upon credential verification.' },
              { lvl: 2, label: 'Plus 2 (++)', desc: 'Early sustained helpful contributions.' },
              { lvl: 3, label: 'Plus 3 (+++)', desc: 'Established contributor with consistent community feedback.' },
              { lvl: 4, label: 'Plus 4 (++++)', desc: 'Trusted contributor with high response quality score.' },
              { lvl: 5, label: 'Plus 5 (+++++)', desc: 'Senior contributor active across specialty consultations.' },
              { lvl: 6, label: 'Plus 6 (++++++)', desc: 'Expert contributor with peer review audit recognition.' },
              { lvl: 7, label: 'Plus 7 (+++++++)', desc: 'Distinguished physician with exemplary rating marks.' },
              { lvl: 8, label: 'Plus 8 (++++++++)', desc: 'ByteMed Master Contributor (Highest Platform Rank).' },
            ].map(tier => (
              <div 
                key={tier.lvl}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                  tier.lvl === currentRankLevel 
                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/40' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <RankBadge rank={tier.label} size="xs" />
                  <span className="text-xs text-slate-300">{tier.desc}</span>
                </div>
                {tier.lvl === currentRankLevel && (
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
};

// Subcomponent: Individual Query Card for Doctors with Response & Version Editing
const DoctorQueryCard = ({ query, doctorId, onResponseUpdated }) => {
  const [existingResponses, setExistingResponses] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const toast = useToast();

  const fetchResponses = async () => {
    try {
      const { data } = await api.get(`/responses/query/${query._id}`);
      setExistingResponses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [query._id]);

  // Check if current doctor already has a response
  const myResponse = existingResponses.find(r => r.doctorId?._id === doctorId || r.doctorId === doctorId);

  const handleStartEdit = () => {
    if (myResponse) {
      setEditingResponseId(myResponse._id);
      setReplyText(myResponse.currentContent);
    }
  };

  const handleCancelEdit = () => {
    setEditingResponseId(null);
    setReplyText('');
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      if (editingResponseId) {
        // Edit existing response -> Creates a new version (ResponseVersion) in MongoDB
        await api.put(`/responses/${editingResponseId}`, { content: replyText });
        toast.success('Medical advice revised! New version recorded in immutable ledger.');
        setEditingResponseId(null);
      } else {
        // New initial response
        await api.post('/responses', {
          queryId: query._id,
          doctorId,
          content: replyText
        });
        toast.success('Medical advice published to patient!');
      }
      setReplyText('');
      fetchResponses();
      onResponseUpdated();
    } catch (err) {
      toast.error('Failed to submit advice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 border flex flex-col justify-between space-y-4 ${
      query.aiTriage?.isEmergency ? 'border-rose-500/60 bg-rose-950/15' : 'border-slate-800'
    }`}>
      
      {/* Emergency Ribbon if flagged */}
      {query.aiTriage?.isEmergency && (
        <TriageAlert
          isEmergency={true}
          confidenceScore={query.aiTriage?.confidenceScore || 0.9}
          compact={true}
        />
      )}

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={query.category} size="xs" />
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {new Date(query.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-bold text-base text-white">{query.title}</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          {query.description}
        </p>
      </div>

      {/* Responses Summary or Existing Contribution */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {myResponse ? (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Your Submitted Advice
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                v{myResponse.versions?.length || 1}.0 Published
              </span>
            </div>
            
            <p className="text-xs text-slate-200 whitespace-pre-line">
              {myResponse.currentContent}
            </p>

            {/* Actions: Edit response to create new version or view history */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Revise Advice (New Version)</span>
              </button>

              {myResponse.versions?.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] transition"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{showHistory ? 'Hide Versions' : `Audit (${myResponse.versions.length} versions)`}</span>
                </button>
              )}
            </div>

            {/* Version Audit Log Drawer */}
            {showHistory && myResponse.versions && (
              <div className="mt-3 pt-3 border-t border-indigo-500/20 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Immutable Version Audit Log
                </div>
                {myResponse.versions.map((v, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                    <div className="text-slate-500 text-[10px] flex justify-between font-mono">
                      <span>Revision {i + 1}.0</span>
                      <span>{new Date(v.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-200">{v.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
            <span>You have not contributed advice to this query yet.</span>
          </div>
        )}

        {/* Advice Submission or Edit Form */}
        {(!myResponse || editingResponseId) && (
          <form onSubmit={handleSubmitResponse} className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">
                {editingResponseId ? 'Revise Medical Advice (New version will be recorded):' : 'Provide Clinical Guidance:'}
              </label>
              {editingResponseId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-rose-400 hover:underline text-[11px]"
                >
                  Cancel
                </button>
              )}
            </div>
            
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              placeholder="Structure: 1) Clinical assessment, 2) Recommended next steps, 3) Symptoms requiring in-person emergency care..."
              className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <Button
              type="submit"
              size="sm"
              isLoading={submitting}
              className="w-full"
              icon={Send}
            >
              {editingResponseId ? 'Save & Record Revision v' + ((myResponse?.versions?.length || 1) + 1) + '.0' : 'Submit Medical Advice'}
            </Button>
          </form>
        )}

      </div>

    </div>
  );
};

export default DoctorDashboard;
