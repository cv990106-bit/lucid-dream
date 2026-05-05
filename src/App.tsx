import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarDays, 
  PlayCircle, 
  ChevronLeft, 
  Music, 
  Heart 
} from 'lucide-react';
import { ARTISTS, TRACKS } from './constants';
import { Artist, View, Track } from './types';

// --- Shared Components ---

const EtherealBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="ethereal-sphere w-[400px] h-[400px] bg-primary-container -top-20 -left-20 animate-float" />
    <div className="ethereal-sphere w-[500px] h-[500px] bg-secondary-container bottom-20 -right-40 animate-float" style={{ animationDelay: '-3s' }} />
    <div className="ethereal-sphere w-[300px] h-[300px] bg-tertiary-container top-1/3 left-1/2 animate-float" style={{ animationDelay: '-7s' }} />
  </div>
);

const BottomNav = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => (
  <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pt-3 pb-8 glass-dark rounded-t-[32px] md:hidden flex justify-around items-center">
    <button 
      onClick={() => setView('lineup')}
      className={`flex flex-col items-center gap-1 transition-all ${activeView === 'lineup' || activeView === 'artist-detail' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}
    >
      <CalendarDays size={24} strokeWidth={activeView === 'lineup' ? 2.5 : 2} />
      <span className="text-[11px] font-display font-bold uppercase tracking-widest">Lineup</span>
    </button>
    <button 
      onClick={() => setView('player')}
      className={`flex flex-col items-center gap-1 transition-all ${activeView === 'player' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}
    >
      <PlayCircle size={24} strokeWidth={activeView === 'player' ? 2.5 : 2} />
      <span className="text-[11px] font-display font-bold uppercase tracking-widest">Player</span>
    </button>
  </nav>
);

const TopBar = ({ title, onBack }: { title: string, onBack?: () => void }) => (
  <header className="fixed top-0 left-0 w-full h-16 z-50 glass flex items-center px-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
    <div className="flex-1">
      {onBack && (
        <button onClick={onBack} className="text-primary hover:opacity-80 transition-opacity">
          <ChevronLeft size={24} />
        </button>
      )}
    </div>
    <h1 className="font-display font-black text-xl tracking-tighter text-slate-800 flex-1 text-center whitespace-nowrap">
      {title}
    </h1>
    <div className="flex-1" />
  </header>
);

// --- Views ---

interface SplashProps { onComplete: () => void; key?: string; }
const SplashView = ({ onComplete }: SplashProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center relative px-6 py-24 text-center cursor-pointer"
    onClick={onComplete}
  >
    <div className="flex-grow flex flex-col items-center justify-center">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-5xl font-black text-primary tracking-tighter mb-2"
      >
        Lucid Dream
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-secondary opacity-80"
      >
        A Surreal Experience
      </motion.p>
    </div>
    <footer className="w-full pb-8">
      <p className="text-[12px] font-sans font-light text-slate-500 uppercase tracking-[0.2em] opacity-60">
        2026 HOSEO UNIVERSITY FESTIVAL
      </p>
    </footer>
  </motion.div>
);

interface LineupProps { onArtistSelect: (a: Artist) => void; key?: string; }
const LineupView = ({ onArtistSelect }: LineupProps) => {
  const [day, setDay] = useState<1 | 2>(1);
  const filteredArtists = ARTISTS.filter(a => a.day === day);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6"
    >
      <section className="mb-8">
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Lineup</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setDay(1)}
            className={`px-6 py-2 rounded-full font-display text-xs font-bold transition-all ${day === 1 ? 'bg-primary-container text-primary shadow-sm' : 'text-slate-400 border border-primary-container/20'}`}
          >
            DAY 1
          </button>
          <button 
            onClick={() => setDay(2)}
            className={`px-6 py-2 rounded-full font-display text-xs font-bold transition-all ${day === 2 ? 'bg-primary-container text-primary shadow-sm' : 'text-slate-400 border border-primary-container/20'}`}
          >
            DAY 2
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {filteredArtists.map((artist) => (
          <motion.div
            key={artist.id}
            layoutId={artist.id}
            onClick={() => onArtistSelect(artist)}
            className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] group cursor-pointer"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-3">
              <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-800 truncate">{artist.name}</h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

interface DetailProps { artist: Artist; onBack: () => void; onTrackSelect: (t: Track) => void; key?: string; }
const ArtistDetailView = ({ artist, onBack, onTrackSelect }: DetailProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pb-32"
  >
    <div className="relative h-[60vh] overflow-hidden">
      <motion.img 
        layoutId={artist.id}
        src={artist.imageUrl} 
        alt={artist.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        {artist.isHeadliner && (
          <span className="inline-block bg-primary-container text-primary text-[10px] font-display font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Headliner
          </span>
        )}
        <h1 className="font-display text-5xl font-black text-slate-800 mb-2">{artist.englishName}</h1>
        <p className="text-secondary max-w-md">{artist.description}</p>
      </div>
    </div>

    <div className="px-6 mt-8">
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
        <h2 className="font-display text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Music size={20} className="text-primary" />
          Top 5 Tracks
        </h2>
        <div className="space-y-4">
          {TRACKS.filter(t => t.artistId === artist.id).map((track, i) => (
            <div 
              key={track.id} 
              onClick={() => onTrackSelect(track)}
              className="flex items-center gap-4 group cursor-pointer hover:bg-surface-container-low p-2 -m-2 rounded-xl transition-colors"
            >
              <span className="font-display text-xl font-bold text-slate-300 w-6">{i + 1}</span>
              <div className="flex-grow">
                <p className="font-display font-bold text-slate-800">{track.title}</p>
              </div>
              <span className={`text-[10px] font-display font-bold px-2 py-1 rounded-full border ${
                track.tag === 'Essential' ? 'bg-primary-container/30 text-primary border-primary-container' :
                track.tag === 'Vibe' ? 'bg-tertiary-container/30 text-tertiary border-tertiary-container' :
                'bg-secondary-container/30 text-secondary border-secondary-container'
              }`}>
                {track.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

interface PlayerProps { key?: string; track: Track; }
const PlayerView = ({ track }: PlayerProps) => {
  const artist = ARTISTS.find(a => a.id === track.artistId)!;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="pt-24 pb-40 px-6 max-w-2xl mx-auto"
    >
      <div className="aspect-video bg-surface-container-highest rounded-2xl overflow-hidden shadow-lg mb-8 relative">
        {track.videoUrl ? (
          <iframe
            src={track.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <Music size={48} className="text-primary opacity-20" />
          </div>
        )}
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] mb-6 border border-white/40">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-2xl font-black text-slate-800 leading-tight">{track.title}</h1>
            <p className="font-display text-lg text-secondary">{artist.englishName}</p>
          </div>
          <button className="text-error mt-2">
            <Heart size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-white/40">
        <h3 className="font-display font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Lyrics</h3>
        <div className="font-display text-2xl font-bold leading-relaxed space-y-4">
          {track.lyrics ? track.lyrics.map((line, i) => (
            <p key={i} className={i === 2 ? "text-primary origin-left scale-105" : "opacity-60"}>
              {line}
            </p>
          )) : (
            <p className="opacity-40 italic">Lyrics not available for this track.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<View>('splash');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    setView('artist-detail');
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setView('player');
  };

  const handleBack = () => {
    if (view === 'artist-detail') {
      setView('lineup');
      setSelectedArtist(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <EtherealBackground />
      
      {view !== 'splash' && (
        <TopBar 
          title="Lucid Dream" 
          onBack={view === 'artist-detail' ? handleBack : undefined} 
        />
      )}

      <main>
        <AnimatePresence mode="wait">
          {view === 'splash' && (
            <SplashView key="splash" onComplete={() => setView('lineup')} />
          )}
          {view === 'lineup' && (
            <LineupView key="lineup" onArtistSelect={handleArtistSelect} />
          )}
          {view === 'artist-detail' && selectedArtist && (
            <ArtistDetailView 
              key="detail" 
              artist={selectedArtist} 
              onBack={handleBack} 
              onTrackSelect={handleTrackSelect}
            />
          )}
          {view === 'player' && (
             <PlayerView key="player" track={currentTrack} />
          )}
        </AnimatePresence>
      </main>

      {view !== 'splash' && (
        <BottomNav activeView={view} setView={setView} />
      )}
    </div>
  );
}
