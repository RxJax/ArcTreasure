import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Shield, Zap, Coins, Map as MapIcon, Trophy, Box, Calendar, Wallet, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subtext }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
    <div className="w-14 h-14 bg-game-gold/10 rounded-2xl flex items-center justify-center text-game-gold border border-game-gold/20">
      <Icon size={28} />
    </div>
    <div>
      <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      {subtext && <p className="text-xs text-white/40 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Profile = () => {
  const { account, stats, inventory } = useGame();

  const xpToNextLevel = (stats.level) ** 2 * 100;
  const currentLevelXP = (stats.level - 1) ** 2 * 100;
  const progress = ((stats.xp - currentLevelXP) / (xpToNextLevel - currentLevelXP)) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="relative h-64 rounded-[3rem] overflow-hidden border border-white/10 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 flex items-end gap-8">
          <div className="w-32 h-32 rounded-3xl bg-game-orange border-4 border-[#0f172a] shadow-2xl flex items-center justify-center text-game-brown">
            <User size={64} strokeWidth={3} />
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-game-gold text-game-brown text-[10px] font-black rounded-full uppercase tracking-widest">
                {stats.rank}
              </span>
              <span className="text-white/40 font-mono text-xs">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
            </div>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Hunter Profile</h2>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-lg font-black italic flex items-center gap-2">
              <Shield className="text-game-gold" size={20} />
              RANK STATUS
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Experience</p>
                  <p className="text-xs font-bold text-game-gold">{stats.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</p>
                </div>
                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className="h-full bg-gradient-to-r from-game-gold to-game-orange rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-right">LVL {stats.level} EXPLORER</p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Joined Date</span>
                  <span className="text-white/80 font-medium">May 14, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Network</span>
                  <span className="text-game-gold font-medium">Arc Testnet</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs tracking-widest">
              <ExternalLink size={14} />
              VIEW ON ARCSCAN
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={Coins} label="Gold Balance" value={stats.gold.toLocaleString()} subtext="Ready to spend at Merchant" />
            <StatCard icon={Box} label="Chests Opened" value={stats.chestsOpened || 0} subtext="Total mystery boxes unsealed" />
            <StatCard icon={MapIcon} label="Treasures Found" value={stats.treasuresFound} subtext="Items dug from all maps" />
            <StatCard icon={Trophy} label="Rare Discoveries" value={stats.rareLootCount} subtext="Epic or Legendary artifacts" />
          </div>

          <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8">
            <h3 className="text-xl font-black italic mb-6 flex items-center gap-2">
              <Zap className="text-game-orange" size={24} />
              RECENT MILESTONES
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Reached Rank: {stats.rank}</p>
                  <p className="text-[10px] text-white/40 font-mono">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                  <Coins size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Earned 5,000+ Gold</p>
                  <p className="text-[10px] text-white/40 font-mono">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
