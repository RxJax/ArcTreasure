import React, { useState, useEffect } from 'react';
import { useGame, MAP_IMAGES, LOOT_TABLE } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shovel, Sparkles, MapPin, Lock, ChevronRight, Wallet, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const MAPS = [
  { id: 'desert', name: 'Desert Ruins', level: 1, color: '#F4E1A6', rarity: 'Common', desc: 'Ancient sands hiding lost pharaoh treasures.' },
  { id: 'island', name: 'Pirate Island', level: 15, color: '#1E40AF', rarity: 'Rare', desc: 'A tropical paradise of legendary pirate kings.' },
  { id: 'jungle', name: 'Jungle Temple', level: 30, color: '#2D5A27', rarity: 'Epic', desc: 'Dense foliage concealing mythical golden cities.', comingSoon: true },
  { id: 'cave', name: 'Ancient Cave', level: 50, color: '#4B5563', rarity: 'Legendary', desc: 'Deep caverns filled with glowing crystal artifacts.', comingSoon: true },
];

const Seagull = ({ delay, top, speed }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: '110vw', opacity: [0, 1, 1, 0] }}
    transition={{ duration: speed, delay, repeat: Infinity, ease: "linear" }}
    className="absolute z-30 pointer-events-none"
    style={{ top }}
  >
    <div className="flex gap-1 animate-bounce">
      <div className="w-4 h-0.5 bg-white/40 -rotate-12" />
      <div className="w-4 h-0.5 bg-white/40 rotate-12" />
    </div>
  </motion.div>
);

const SunlightRay = ({ left, delay, duration }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: [0, 0.2, 0], x: 20 }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] z-10 pointer-events-none"
    style={{ left }}
  />
);

const MapExplorer = () => {
  const { stats, setStats, performAction, addXP, addGold, activeMap, setActiveMap, unlockedMaps, setInventory } = useGame();
  const [digging, setDigging] = useState(null);
  const [reward, setReward] = useState(null);
  const [revealedSpots, setRevealedSpots] = useState({});

  const isPirate = activeMap === 'Pirate Island';

  const handleDig = async (index) => {
    if (digging !== null || revealedSpots[index]) return;
    
    setDigging(index);
    try {
      const success = await performAction(`dig_${activeMap.toLowerCase().replace(' ', '_')}_spot_${index}`, "1.0");
      if (success) {
        setRevealedSpots(prev => ({ ...prev, [index]: true }));
        
        const roll = Math.random() * 100;
        let pool = [];
        if (roll > 95) pool = LOOT_TABLE.filter(l => l.rarity === "Mythic" || l.rarity === "Legendary");
        else if (roll > 80) pool = LOOT_TABLE.filter(l => l.rarity === "Epic");
        else if (roll > 50) pool = LOOT_TABLE.filter(l => l.rarity === "Rare");
        else pool = LOOT_TABLE.filter(l => l.rarity === "Common");
        
        if (pool.length === 0) pool = LOOT_TABLE.filter(l => l.rarity === "Common");
        
        const loot = pool[Math.floor(Math.random() * pool.length)];
        const xpGain = 25 + Math.floor(Math.random() * 50);
        const goldGain = loot.value;
        
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: isPirate ? ['#1E40AF', '#D4AF37', '#60A5FA'] : ['#FFD700', '#FB923C', '#F4E1A6']
        });

        setReward({ 
          xp: xpGain, 
          gold: goldGain, 
          item: loot.name, 
          rarity: loot.rarity, 
          icon: loot.icon 
        });

        addXP(xpGain);
        addGold(goldGain);
        setStats(prev => ({
          ...prev,
          treasuresFound: prev.treasuresFound + 1,
          rareLootCount: loot.rarity !== 'Common' ? prev.rareLootCount + 1 : prev.rareLootCount
        }));
        setInventory(prev => [...prev, { ...loot, id: Date.now() }]);
      }
    } catch (err) {
      console.error("Digging error:", err);
    } finally {
      setDigging(null);
      setTimeout(() => setReward(null), 5000);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-5xl font-display font-black text-white italic tracking-tight">EXPEDITION <span className="text-adventure-gold text-4xl">MAPS</span></h2>
          <div className="w-20 h-1 bg-adventure-gold/30 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {MAPS.map((m) => {
            const isUnlocked = stats.level >= m.level;
            const isActive = activeMap === m.name;
            const isDisabled = m.comingSoon || !isUnlocked;
            
            return (
              <button
                key={m.id}
                disabled={isDisabled}
                onClick={() => setActiveMap(m.name)}
                className={`stone-panel group p-5 transition-all duration-500 flex flex-col text-left h-40 ${
                  isActive ? 'border-adventure-gold ring-4 ring-adventure-gold/20' : 
                  isUnlocked && !m.comingSoon ? 'hover:border-adventure-gold/50 cursor-pointer' : 'opacity-40 grayscale'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-adventure-gold text-adventure-dark' : 'bg-adventure-brown/20 text-adventure-gold'}`}>
                    {isUnlocked ? <MapPin size={20} /> : <Lock size={20} />}
                  </div>
                  <span className="font-display text-[8px] tracking-[0.3em] text-adventure-gold/40 uppercase">
                    {m.rarity}
                  </span>
                </div>
                
                <h4 className={`font-display font-black text-sm mb-1 ${isActive ? 'text-adventure-gold' : 'text-adventure-sand'}`}>{m.name}</h4>
                <p className="font-serif text-[10px] text-adventure-sand/40 italic leading-tight flex-1">{m.desc}</p>
                
                {!isUnlocked && !m.comingSoon && (
                  <div className="mt-2 text-[9px] font-display font-black text-red-400/60 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    Req. Lvl {m.level}
                  </div>
                )}
                {m.comingSoon && <span className="mt-2 text-[9px] font-display font-black text-blue-400/60 uppercase tracking-widest">Undiscovered</span>}
              </button>
            );
          })}
        </div>
      </header>

      <div className="relative group">
        <div className={`parchment-card p-4 transition-all duration-700 ${isPirate ? 'shadow-[0_0_100px_rgba(59,130,246,0.2)]' : 'shadow-[0_0_100px_rgba(212,175,55,0.2)]'}`}>
          <div className="relative aspect-[21/9] rounded-lg overflow-hidden border-4 border-adventure-brown/40 bg-adventure-dark">
            {/* Base Map Image */}
            <motion.div 
              key={activeMap}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${MAP_IMAGES[activeMap]})` }}
            />

            {/* Atmosphere Layer: Pirate Island */}
            {isPirate && (
              <>
                <Seagull delay={2} top="15%" speed={25} />
                <Seagull delay={8} top="30%" speed={20} />
                <Seagull delay={15} top="10%" speed={30} />
                
                <SunlightRay left="10%" delay={1} duration={8} />
                <SunlightRay left="40%" delay={3} duration={10} />
                <SunlightRay left="75%" delay={0} duration={12} />

                {/* Tropical Heat / Mist */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-adventure-amber/5 pointer-events-none z-10" />
                
                {/* Wave reflections (CSS) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none z-20">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water.png')] animate-float-dust" />
                </div>
              </>
            )}

            {/* Atmosphere Layer: Desert Ruins */}
            {!isPirate && activeMap === 'Desert Ruins' && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-orange-500/5 mix-blend-overlay" />
                {/* More concentrated dust */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      x: [0, 100, 0], 
                      y: [0, -20, 0],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                    className="absolute w-1 h-1 bg-adventure-gold rounded-full blur-[1px]"
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: `${Math.random() * 100}%` 
                    }}
                  />
                ))}
              </div>
            )}

            {/* Digging Grid */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-3 gap-3 p-8 z-30">
              {Array.from({ length: 24 }).map((_, i) => {
                const isRevealed = revealedSpots[i];
                return (
                  <button
                    key={i}
                    onClick={() => handleDig(i)}
                    disabled={digging !== null || isRevealed}
                    className="relative group/spot rounded-lg transition-all duration-300"
                  >
                    <AnimatePresence>
                      {!isRevealed && (
                        <motion.div
                          exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                          className={`absolute inset-0 border border-white/10 flex items-center justify-center transition-all ${
                            isPirate 
                              ? 'bg-blue-900/40 hover:bg-blue-800/40 group-hover/spot:border-blue-400/50' 
                              : 'bg-adventure-brown/40 hover:bg-adventure-brown/20 group-hover/spot:border-adventure-gold/50'
                          } rounded-lg backdrop-blur-[2px]`}
                        >
                          <Shovel size={24} className="text-white/10 group-hover/spot:text-white/40 transition-colors group-hover/spot:scale-110" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {digging === i && (
                      <motion.div
                        animate={{ rotate: [0, -20, 20, -20, 0], scale: [1, 1.2, 1] }}
                        className="relative z-40 text-adventure-gold"
                      >
                        <div className="w-12 h-12 bg-adventure-dark/80 rounded-full flex items-center justify-center border-2 border-adventure-gold animate-pulse">
                          <Shovel size={24} />
                        </div>
                      </motion.div>
                    )}

                    {isRevealed && !digging && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-adventure-gold/30">
                        <Star size={24} className="animate-pulse" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Map Info Overlay */}
            <div className="absolute top-6 left-6 z-40">
              <div className="bg-adventure-dark/80 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-adventure-brown/40 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPirate ? 'bg-blue-500 text-white' : 'bg-adventure-gold text-adventure-dark'}`}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white tracking-widest uppercase">{activeMap}</h3>
                  <p className="font-serif italic text-[10px] text-adventure-sand/50">"Where ancient legends are unearthed"</p>
                </div>
              </div>
            </div>

            {/* Digging Cost */}
            <div className="absolute bottom-6 right-6 z-40">
              <div className="bg-adventure-dark/80 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-adventure-brown/40 flex items-center gap-3">
                <Wallet size={18} className="text-adventure-gold" />
                <span className="font-display font-black text-xs text-adventure-gold tracking-widest">1.0 USDC / DIG</span>
              </div>
            </div>

            {/* Discovery Popup */}
            <AnimatePresence>
              {reward && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
                >
                  <div className="parchment-card p-1 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 border-adventure-brown/40">
                    <div className="bg-adventure-dark/5 p-8 text-center space-y-6 relative overflow-hidden">
                      {/* Rarity Glow */}
                      <div className={`absolute -inset-10 opacity-30 blur-3xl rounded-full ${
                        reward.rarity === 'Mythic' ? 'bg-purple-500' :
                        reward.rarity === 'Legendary' ? 'bg-orange-500' : 'bg-adventure-gold'
                      }`} />

                      <motion.div 
                        initial={{ rotate: -15, scale: 0 }}
                        animate={{ rotate: 0, scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-8xl relative z-10 drop-shadow-2xl mb-8"
                      >
                        {reward.icon}
                      </motion.div>

                      <div className="relative z-10 space-y-2">
                        <p className={`font-display font-black text-[10px] tracking-[0.4em] uppercase ${
                          reward.rarity === 'Mythic' ? 'text-purple-400' :
                          reward.rarity === 'Legendary' ? 'text-orange-400' : 'text-adventure-brown/40'
                        }`}>
                          {reward.rarity} RELIC FOUND
                        </p>
                        <h4 className="font-display font-black text-3xl text-adventure-brown uppercase leading-tight italic">{reward.item}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10 pt-4">
                        <div className="bg-adventure-brown/10 p-3 rounded-lg border border-adventure-brown/20">
                          <p className="font-display font-black text-[9px] text-adventure-brown/40 uppercase mb-1">Bounty</p>
                          <p className="font-display font-black text-lg text-adventure-gold">+{reward.gold}</p>
                        </div>
                        <div className="bg-adventure-brown/10 p-3 rounded-lg border border-adventure-brown/20">
                          <p className="font-display font-black text-[9px] text-adventure-brown/40 uppercase mb-1">Expertise</p>
                          <p className="font-display font-black text-lg text-adventure-amber">+{reward.xp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
