import React from 'react';
import { useGame } from '../context/GameContext';
import { Coins, Zap, Trophy, Map as MapIcon, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="relative group h-full"
  >
    <div className="absolute inset-0 bg-[#2a1b15] border-2 border-adventure-brown/50 rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.02] duration-500" />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
    
    <div className="relative p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3 text-adventure-gold/60">
        <div className="p-2 bg-adventure-brown/30 rounded-lg border border-adventure-gold/20">
          <Icon size={20} className="glow-relic" />
        </div>
        <span className="font-display text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="text-4xl font-display font-black text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {value}
      </div>
      <div className={`h-1 w-12 bg-${color} rounded-full opacity-50`} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { stats, claimMissionReward } = useGame();

  const activities = (stats.history || []).length > 0 ? stats.history : [
    { id: 1, text: "Journal: No entries yet. Start your expedition!", time: "Now", type: 'relic' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section: Map Table */}
      <div className="relative h-[450px] rounded-[3rem] overflow-hidden border-4 border-adventure-brown/40 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('/map_table.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-adventure-dark via-transparent to-black/40" />
        
        <div className="absolute bottom-12 left-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-6xl font-display font-black italic text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
              THE EXPEDITION <span className="text-adventure-gold">HEADQUARTERS</span>
            </h1>
            <p className="text-adventure-sand/80 text-xl font-serif italic max-w-lg leading-relaxed drop-shadow-md">
              "Every artifact tells a story of a civilization lost to time. Your journey across the Arc Testnet has only just begun."
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-adventure-brown/80 backdrop-blur-md border border-adventure-gold/30 rounded-full text-adventure-gold font-display text-xs tracking-widest animate-flicker">
                <Flame size={16} />
                {stats.streakDays} DAY EXPEDITION STREAK
              </div>
              
              <a 
                href="https://x.com/rxjax007"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-md border border-adventure-amber/30 rounded-full hover:border-adventure-amber transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-adventure-amber flex items-center justify-center text-adventure-dark font-black text-[10px]">RX</div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-adventure-sand/50 uppercase tracking-tighter leading-none">Architect</span>
                  <span className="text-xs text-adventure-amber font-display font-bold group-hover:text-adventure-gold transition-colors">@rxjax007</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 right-8 text-adventure-gold/20">
          <Sparkles size={120} className="animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Coins} label="Ancient Gold" value={stats.gold.toLocaleString()} color="adventure-gold" delay={0.1} />
        <StatCard icon={Zap} label="Knowledge XP" value={stats.xp.toLocaleString()} color="adventure-amber" delay={0.2} />
        <StatCard icon={MapIcon} label="Relics Found" value={stats.treasuresFound} color="adventure-sand" delay={0.3} />
        <StatCard icon={Trophy} label="Elite Artifacts" value={stats.rareLootCount} color="adventure-gold" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        {/* Daily Journal (Missions) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold text-adventure-gold flex items-center gap-3">
              <Sparkles className="animate-pulse" size={24} />
              EXPEDITION LOGS
            </h3>
            <span className="font-accent text-adventure-sand/50 italic text-sm">Resets at midnight...</span>
          </div>

          <div className="parchment-card p-1">
            <div className="bg-adventure-dark/5 p-8 space-y-6">
              {[
                { id: 'dig', t: "Recover 5 hidden treasures", p: Math.min(((stats.treasuresFound || 0) / 5) * 100, 100), r: "200 Gold", desc: "Scan the desert sands for buried history." },
                { id: 'chest', t: "Unlock 3 ancient chests", p: Math.min(((stats.chestsOpened || 0) / 3) * 100, 100), r: "500 XP", desc: "Solve the puzzles of the forgotten vaults." },
                { id: 'rare', t: "Identify a Rare Relic", p: (stats.rareLootCount || 0) > 0 ? 100 : 0, r: "Mystery Box", desc: "Find something the world hasn't seen in centuries." },
              ].map((m, i) => {
                const isComplete = m.p === 100;
                const isClaimed = stats.claimedMissions?.includes(m.id);
                
                return (
                  <div key={i} className="group relative border-b border-adventure-brown/20 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-display font-black text-2xl text-adventure-brown group-hover:text-black transition-colors uppercase tracking-tight">
                            {m.t}
                          </h4>
                          {isClaimed && (
                            <span className="text-xs font-display font-black bg-adventure-brown/20 text-adventure-brown px-4 py-1.5 rounded border-2 border-adventure-brown/40 uppercase tracking-tighter">Verified</span>
                          )}
                        </div>
                        <p className="font-serif font-black text-adventure-brown text-lg leading-relaxed">{m.desc}</p>
                        
                        <div className="relative mt-4">
                          <div className="w-full bg-adventure-brown/10 h-1.5 rounded-full overflow-hidden border border-adventure-brown/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${m.p}%` }}
                              className={`h-full ${isComplete ? 'bg-adventure-jungle' : 'bg-adventure-amber'}`}
                            />
                          </div>
                          <span className="absolute -top-6 right-0 font-display text-[10px] text-adventure-brown/40">{Math.round(m.p)}% EXPLORED</span>
                        </div>
                      </div>

                      <div className="min-w-[120px] pt-1">
                        {isComplete && !isClaimed ? (
                          <button 
                            onClick={() => claimMissionReward(m.id)}
                            className="btn-adventure w-full py-2.5 text-[10px]"
                          >
                            CLAIM REWARD
                          </button>
                        ) : (
                          <div className="text-right flex flex-col items-end">
                            <span className="font-display font-black text-xs text-adventure-brown/60 leading-none mb-1 uppercase tracking-widest">
                              {isClaimed ? 'Awarded' : 'Bounty'}
                            </span>
                            <span className={`font-display font-black text-xl ${isClaimed ? 'text-adventure-brown/20 line-through' : 'text-adventure-gold'}`}>
                              {m.r}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Journal Feed */}
        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold text-adventure-gold">WORLD JOURNAL</h3>
          <div className="parchment-card p-6 min-h-[400px]">
            <div className="space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="journal-entry border-l-4 border-adventure-gold/50 pl-4 py-2">
                  <p className="text-lg font-serif font-black text-adventure-brown leading-snug">
                    {act.text}
                  </p>
                  <p className="font-display font-black text-xs text-adventure-brown/80 uppercase tracking-widest mt-2">
                    {act.time} — <span className="text-adventure-gold">{act.type}</span>
                  </p>
                </div>
              ))}
              
              <div className="pt-10 text-center">
                <button className="font-accent text-adventure-brown/50 hover:text-adventure-brown transition-colors italic border-b border-adventure-brown/20 pb-1">
                  Read earlier reports...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
