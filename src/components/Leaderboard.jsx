import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Star, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Leaderboard = () => {
  const { account } = useGame();
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("stats.xp", "desc"), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        address: doc.id,
        xp: doc.data().stats?.xp || 0,
        treasures: doc.data().stats?.treasuresFound || 0,
        rare: doc.data().stats?.rareLootCount || 0,
        streak: doc.data().stats?.streakDays || 1,
        isUser: doc.id === account
      }));
      setHunters(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [account]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="text-adventure-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" size={32} />;
      case 2: return <Medal className="text-stone-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" size={28} />;
      case 3: return <Medal className="text-adventure-amber drop-shadow-[0_0_10px_rgba(255,191,0,0.4)]" size={24} />;
      default: return <span className="text-adventure-brown/40 font-display text-xl">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-6">
        <Loader2 className="text-adventure-gold animate-spin" size={48} />
        <p className="text-adventure-gold font-display text-xl animate-pulse tracking-[0.3em] uppercase">Consulting the Ancients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-5xl font-display font-black text-white italic drop-shadow-2xl">THE GUILD HALL <span className="text-adventure-gold">RECORDS</span></h2>
        <div className="w-24 h-1 bg-adventure-gold/30 mx-auto rounded-full" />
        <p className="text-adventure-sand/50 font-serif italic text-lg">"Behold the names of those who have braved the shifting ruins and claimed the greatest artifacts of the Arc Network."</p>
      </div>

      <div className="stone-panel border-adventure-brown/30 bg-black/40 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-adventure-dark/50 border-b border-adventure-brown/20">
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80">Legacy Rank</th>
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80">Expedition Member</th>
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80 text-center">Knowledge XP</th>
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80 text-center">Relics</th>
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80 text-center">Rare Findings</th>
                <th className="px-8 py-8 text-[11px] uppercase font-display tracking-[0.4em] text-adventure-gold/80 text-right">Loyalty</th>
              </tr>
            </thead>
            <tbody className="font-serif">
              {hunters.map((hunter, i) => (
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={hunter.address}
                  className={`border-b border-adventure-brown/10 last:border-0 group transition-all duration-500 ${
                    hunter.isUser ? 'bg-adventure-gold/5' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="px-8 py-8">{getRankIcon(hunter.rank)}</td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-display border-2 ${
                        hunter.isUser 
                          ? 'bg-adventure-gold text-adventure-dark border-adventure-amber' 
                          : 'bg-adventure-brown/20 text-adventure-sand border-adventure-brown/30'
                      }`}>
                        {hunter.address.substring(2, 5).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-display text-sm font-black tracking-widest ${hunter.isUser ? 'text-adventure-gold' : 'text-adventure-sand'}`}>
                          {hunter.address.substring(0, 8)}...{hunter.address.substring(36)}
                        </span>
                        {hunter.isUser && <span className="font-accent text-[10px] text-adventure-gold/60 mt-0.5">Legendary You</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="font-display font-black text-adventure-amber text-xl drop-shadow-sm">{hunter.xp.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-8 text-center text-adventure-sand font-display font-bold">{hunter.treasures}</td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-adventure-gold">
                      <Star size={16} fill="currentColor" className="animate-pulse" />
                      <span className="font-display font-black text-lg">{hunter.rare}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className={`flex flex-col items-end gap-1 font-display ${hunter.streak > 1 ? 'text-adventure-amber' : 'text-adventure-sand/20'}`}>
                      <span className="text-lg font-black">{hunter.streak} DAYS</span>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(hunter.streak, 5) }).map((_, idx) => (
                          <div key={idx} className="w-1 h-1 bg-adventure-gold rounded-full" />
                        ))}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Weekly Champion", desc: "The member who uncovers the most knowledge this week shall be granted a Mythic Sealed Box.", icon: Trophy, color: "adventure-gold" },
          { title: "Elite Relic Hunter", desc: "Identify 10 Rare artifacts to be engraved as a 'Grand Master' on the guild's entrance.", icon: Star, color: "adventure-amber" },
          { title: "Indomitable Spirit", desc: "Maintain a 14-day expedition streak to receive the explorer's badge of honor.", icon: Medal, color: "stone-300" },
        ].map((feat, i) => (
          <div key={i} className="parchment-card p-1 group">
            <div className="bg-adventure-dark/5 p-8 flex flex-col items-center text-center space-y-4">
              <div className={`w-20 h-20 bg-adventure-brown/10 rounded-full flex items-center justify-center border-2 border-adventure-brown/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <feat.icon size={40} className={`text-${feat.color} drop-shadow-lg`} />
              </div>
              <h4 className="font-display font-black text-lg text-adventure-brown uppercase tracking-wider">{feat.title}</h4>
              <p className="font-serif italic text-adventure-brown/60 text-sm leading-relaxed">{feat.desc}</p>
              <div className="w-12 h-0.5 bg-adventure-brown/20 pt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
