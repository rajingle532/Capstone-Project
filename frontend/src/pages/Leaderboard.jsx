import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Award, Star, ShieldCheck, Video, Search, Filter, 
  Sparkles, Activity, Clock, ArrowRight 
} from 'lucide-react';
import { RankBadge, parseRankLevel, Button, Card } from '../components/ui';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankFilter, setRankFilter] = useState('ALL'); // 'ALL' | 'PLUS_8' | 'SENIOR'
  const [bookingDocId, setBookingDocId] = useState(null);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      // Sort by rating average or rank
      const sorted = [...data].sort((a, b) => {
        const rankA = parseRankLevel(a.plusRank);
        const rankB = parseRankLevel(b.plusRank);
        if (rankB !== rankA) return rankB - rankA;
        const avgA = a.ratingCount ? a.ratingSum / a.ratingCount : 0;
        const avgB = b.ratingCount ? b.ratingSum / b.ratingCount : 0;
        return avgB - avgA;
      });
      setDoctors(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Could not load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBookDoctor = async (doctorId) => {
    setBookingDocId(doctorId);
    try {
      const { data } = await api.post(`/doctors/${doctorId}/book`);
      toast.success('Doctor claimed! Connecting to secure telehealth room...');
      navigate(data.roomUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Doctor is no longer available.');
      fetchDoctors();
    } finally {
      setBookingDocId(null);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = doc.name?.toLowerCase().includes(term) || doc.credentials?.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    const rankLvl = parseRankLevel(doc.plusRank);
    if (rankFilter === 'PLUS_8') return rankLvl === 8;
    if (rankFilter === 'SENIOR') return rankLvl >= 5;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Leaderboard Header Banner */}
        <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>ByteMed Contribution Leaderboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Physician Peer Contribution Ranks
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Byte = 8 bits → 8 ranks (Plus 1 to Plus 8). Physicians earn reputation points from verified advice, version updates, and patient helpfulness ratings.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[110px]">
                <div className="text-xl font-extrabold text-amber-400">{doctors.length}</div>
                <div className="text-[11px] font-medium text-slate-400">Verified Doctors</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[110px]">
                <div className="text-xl font-extrabold text-cyan-400">
                  {doctors.filter(d => parseRankLevel(d.plusRank) === 8).length}
                </div>
                <div className="text-[11px] font-medium text-slate-400">Master Ranks (8)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by physician name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 self-end sm:self-center text-xs">
            <button
              onClick={() => setRankFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                rankFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setRankFilter('SENIOR')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                rankFilter === 'SENIOR'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Plus 5+ Senior
            </button>
            <button
              onClick={() => setRankFilter('PLUS_8')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1 ${
                rankFilter === 'PLUS_8'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-amber-400/70 hover:text-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plus 8 Master</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        {loading ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-sm animate-pulse">
            Loading ByteMed physician rankings...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-sm">
            No doctors found matching your filter criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDoctors.map((doc, index) => {
              const rankLevel = parseRankLevel(doc.plusRank);
              const avgRating = doc.ratingCount ? (doc.ratingSum / doc.ratingCount).toFixed(1) : '5.0';

              return (
                <div
                  key={doc._id}
                  className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  {/* Left: Position Rank & Avatar */}
                  <div className="flex items-center space-x-4">
                    {/* Rank Number Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                      index === 0
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : index === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                        : index === 2
                        ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm sm:text-base">
                          Dr. {doc.name}
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        {doc.availability === 'AVAILABLE' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Live Now
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {doc.credentials || 'Licensed Medical Practitioner'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Plus Rank & Rating & Live Action */}
                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    {/* Plus Rank Badge */}
                    <RankBadge rank={doc.plusRank || 'Plus 1 (+)'} size="sm" showTitle={true} />

                    {/* Patient Rating */}
                    <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{avgRating}</span>
                      <span className="text-slate-500 text-[11px]">
                        ({doc.ratingCount || 1})
                      </span>
                    </div>

                    {/* Book Consultation Button if Available */}
                    {doc.availability === 'AVAILABLE' && user?.role === 'PATIENT' && (
                      <Button
                        size="sm"
                        variant="emerald"
                        disabled={bookingDocId === doc._id}
                        isLoading={bookingDocId === doc._id}
                        onClick={() => handleBookDoctor(doc._id)}
                        icon={Video}
                      >
                        Consult
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default Leaderboard;

