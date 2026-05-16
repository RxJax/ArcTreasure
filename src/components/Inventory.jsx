import React from 'react';
import { useGame } from '../context/GameContext';
import { Briefcase, Info, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Inventory = () => {
  const { inventory } = useGame();

  // Mock inventory if empty for demo
  const displayItems = inventory.length > 0 ? inventory : [
    { id: 1, name: "Rusty Compass", rarity: "Common", icon: "🧭", desc: "Still points North, mostly." },
    { id: 2, name: "Ancient Coin", rarity: "Common", icon: "🪙", desc: "A gold coin from a lost era." },
    { id: 3, name: "Emerald Scarab", rarity: "Rare", icon: "🪲", desc: "Glows with a faint green light." },
    { id: 4, name: "Pirate's Map", rarity: "Rare", icon: "📜", desc: "Leads to a hidden cove." },
    { id: 5, name: "Golden Idol", rarity: "Epic", icon: "🗿", desc: "A heavy statue of a forgotten god." },
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Mythic': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      case 'Legendary': return 'text-game-orange border-game-orange/30 bg-game-orange/5';
      case 'Epic': return 'text-game-gold border-game-gold/30 bg-game-gold/5';
      case 'Rare': return 'text-blue-400 border-blue-500/30 bg-blue-500/5';
      default: return 'text-white/40 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic">EXPLORER'S BACKPACK</h2>
          <p className="text-white/40">Your collection of artifacts and treasures.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`group relative aspect-square border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all cursor-pointer ${getRarityColor(item.rarity)}`}
          >
            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
            <p className="font-bold text-sm text-center">{item.name}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Info size={16} className="text-white/20" />
            </div>
            <div className={`absolute bottom-2 px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest border ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </div>
          </motion.div>
        ))}
        
        {/* Empty Slots */}
        {Array.from({ length: 15 - displayItems.length }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border border-white/5 rounded-2xl bg-black/20 flex items-center justify-center opacity-30">
            <div className="w-8 h-8 border-2 border-dashed border-white/20 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="mt-12 bg-game-orange/5 border border-game-orange/20 rounded-3xl p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-game-orange/20 rounded-2xl flex items-center justify-center">
            <Briefcase size={32} className="text-game-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Backpack Capacity</h3>
            <p className="text-white/40">You are using {displayItems.length} of 50 available slots.</p>
          </div>
        </div>
        <button className="btn-primary">
          <Sparkles size={18} />
          UPGRADE BACKPACK
        </button>
      </div>
    </div>
  );
};

export default Inventory;
