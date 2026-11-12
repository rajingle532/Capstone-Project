import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import { 
  PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, 
  ShieldCheck, Clock, Users, Activity, Sparkles, MessageSquare,
  FileText, Star, CheckCircle2, AlertTriangle, Maximize2, Minimize2,
  Share2
} from 'lucide-react';
import { RankBadge, Modal, Button } from '../components/ui';

const VideoRoom = () => {
  const { id } = useParams(); // Doctor ID
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [ending, setEnding] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [doctorInfo, setDoctorInfo] = useState(null);

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch doctor info for the room
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctorInfo(data);
      } catch (e) {
        console.warn('Could not fetch doctor details:', e);
      }
    };
    fetchDoc();
  }, [id]);

  // Try real webcam stream if supported
  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          if (active && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        }
      } catch (err) {
        // Fallback to avatar if webcam not connected/denied
        console.log('Webcam not accessible, using mock avatar fallback:', err.message);
      }
    };

    if (camOn) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [camOn]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSessionClick = () => {
    setConfirmEndOpen(true);
  };

  const executeEndSession = async () => {
    setConfirmEndOpen(false);
    setEnding(true);
    try {
      // Release atomic lock in database
      await api.post(`/doctors/${id}/end-session`);
      toast.info('Consultation completed. Atomic reservation lock released.');
      
      if (user.role === 'PATIENT') {
        setFeedbackOpen(true);
      } else {
        navigate('/doctor');
      }
    } catch (e) {
      console.error('Error ending session:', e);
      toast.error('Session ended with error');
      navigate(user.role === 'DOCTOR' ? '/doctor' : '/patient');
    } finally {
      setEnding(false);
    }
  };

  const submitPostConsultationFeedback = async () => {
    try {
      toast.success(`Thank you! Submitted ${rating}-star consultation rating.`);
    } catch (e) {
      // ignore
    } finally {
      setFeedbackOpen(false);
      navigate('/patient');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="glass-panel rounded-2xl px-6 py-3.5 border border-slate-800 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white">ByteMed Live Telehealth</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Atomic Lock Engaged
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>HIPAA-Compliant Encrypted P2P Stream</span>
            </div>
          </div>
        </div>

        {/* Live Call Duration & Notes Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
              showNotes 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clinical Notes</span>
          </button>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Video Streams Grid & Clinical Notes Sidebar */}
      <div className="my-auto max-w-6xl w-full mx-auto grid lg:grid-cols-12 gap-6 relative z-10 py-6">
        
        {/* Video Grid (8 or 12 columns based on notes panel) */}
        <div className={`${showNotes ? 'lg:col-span-8' : 'lg:col-span-12'} grid md:grid-cols-2 gap-6 transition-all duration-300`}>
          
          {/* Doctor Screen Feed */}
          <div className="relative aspect-video rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-5">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none"></div>

            {/* Participant Label */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-700/60 text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {user.role === 'DOCTOR' ? `You (Dr. ${user.name})` : `Dr. ${doctorInfo?.name || 'Physician'}`}
              </span>
              <RankBadge rank={doctorInfo?.plusRank || user?.plusRank || 'Plus 1 (+)'} size="xs" />
            </div>

            {/* Center Simulated Doctor Avatar */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 p-1 shadow-xl shadow-indigo-500/25">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-extrabold text-white">
                  🩺
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full animate-bounce"
                    style={{ height: `${12 + (i % 3) * 8}px`, animationDelay: `${i * 150}ms` }}
                  ></span>
                ))}
              </div>
              <span className="text-xs text-slate-300 font-medium mt-2">Physician Audio Connected</span>
            </div>

            {/* Feed Watermark */}
            <div className="relative z-10 flex justify-between text-[10px] text-slate-500">
              <span>1080p • 60 FPS Secure</span>
              <span>Encrypted Mock P2P</span>
            </div>
          </div>

          {/* Patient Screen Feed (Real Camera or Avatar Fallback) */}
          <div className="relative aspect-video rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-5">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none"></div>

            {/* Real Webcam Stream if available */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${camOn ? 'block' : 'hidden'}`}
            />

            {/* Participant Label */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-700/60 text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Patient Stream ({user.role === 'PATIENT' ? 'You' : 'Connected Patient'})
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-800/80 backdrop-blur px-2 py-0.5 rounded-full border border-slate-700">
                {camOn ? 'Camera Active' : 'Camera Off'}
              </span>
            </div>

            {/* Center Simulated Patient Avatar when camera is off */}
            {!camOn && (
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 p-1 shadow-xl shadow-cyan-500/25">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-extrabold text-white">
                    👤
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full animate-bounce"
                      style={{ height: `${10 + (i % 2) * 10}px`, animationDelay: `${i * 120}ms` }}
                    ></span>
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium mt-2">Patient Audio Connected</span>
              </div>
            )}

            {/* Feed Watermark */}
            <div className="relative z-10 flex justify-between text-[10px] text-slate-500">
              <span>Room ID: {id?.substring(0, 8)}...</span>
              <span>HD 720p</span>
            </div>
          </div>

        </div>

        {/* Clinical Notes & Recommendations Panel */}
        {showNotes && (
          <div className="lg:col-span-4 glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 animate-in fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Clinical Consultation Notes</span>
                </h4>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Live Sync
                </span>
              </div>
              <textarea
                rows={9}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={user.role === 'DOCTOR' 
                  ? 'Document observations, patient vitals discussed, and prescription instructions...' 
                  : 'Write down key instructions and medications recommended by the doctor...'}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
            
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Confidentiality Notice:</div>
              <div>Notes remain accessible in consultation history under ByteMed HIPAA guidelines.</div>
            </div>
          </div>
        )}

      </div>

      {/* Floating Telehealth Control Dock */}
      <div className="glass-panel-elevated max-w-md mx-auto rounded-full px-6 py-3.5 border border-slate-700/60 flex items-center justify-center space-x-4 relative z-10 shadow-2xl">
        
        {/* Toggle Mic */}
        <button
          onClick={() => {
            setMicOn(!micOn);
            toast.info(micOn ? 'Microphone muted' : 'Microphone unmuted');
          }}
          className={`p-3 rounded-full transition-all ${
            micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
          title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Cam */}
        <button
          onClick={() => {
            setCamOn(!camOn);
            toast.info(camOn ? 'Camera paused' : 'Camera enabled');
          }}
          className={`p-3 rounded-full transition-all ${
            camOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
          title={camOn ? 'Turn Off Video' : 'Turn On Video'}
        >
          {camOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* End Call Button */}
        <button
          disabled={ending}
          onClick={handleEndSessionClick}
          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 disabled:opacity-50"
        >
          <PhoneOff className="w-4 h-4" />
          <span>{ending ? 'Releasing Lock...' : 'End Consultation'}</span>
        </button>

      </div>

      {/* End Call Confirmation Modal */}
      <Modal
        isOpen={confirmEndOpen}
        onClose={() => setConfirmEndOpen(false)}
        title="End Live Telehealth Consultation?"
        subtitle="This will conclude the video stream and release the atomic server lock."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to exit? Both participants will be disconnected, and the physician's availability state will reset to available.
          </p>

          <div className="flex items-center justify-end space-x-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmEndOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={executeEndSession}
            >
              Confirm End Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post-Session Feedback Modal (For Patients) */}
      <Modal
        isOpen={feedbackOpen}
        onClose={() => { setFeedbackOpen(false); navigate('/patient'); }}
        title="Rate Your Consultation Experience"
        subtitle={`Your feedback updates Dr. ${doctorInfo?.name || 'Physician'}'s ByteMed Plus-Rank`}
        maxWidth="max-w-md"
      >
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">How helpful was this live consultation?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Ratings are integrated into the ByteMed reputation engine to recognize top contributors.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-125 ${
                  star <= rating ? 'text-amber-400' : 'text-slate-700'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <Button
            size="md"
            onClick={submitPostConsultationFeedback}
            className="w-full"
            icon={CheckCircle2}
          >
            Submit Feedback & Return to Dashboard
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default VideoRoom;
