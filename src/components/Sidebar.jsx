import React from 'react';
import { Home, Map, Briefcase, ShoppingBag, Trophy, LogOut, Compass, User } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { account, stats } = useGame();

  const menuItems = [
    { id: 'home', label: 'THE JOURNAL', icon: Home },
    { id: 'map', label: 'MAP ROOM', icon: Map },
    { id: 'inventory', label: 'BACKPACK', icon: Briefcase },
    { id: 'merchant', label: 'TRADING POST', icon: ShoppingBag },
    { id: 'profile', label: 'HUNTER SPECS', icon: User },
    { id: 'hall', label: 'GUILD HALL', icon: Trophy },
  ];

  return (
    <div className="w-72 bg-[#2a1b15] border-r-4 border-adventure-brown/50 flex flex-col h-full relative z-50 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
      {/* Decorative Wood Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] opacity-30 pointer-events-none" />
      
      <div className="p-10 flex flex-col items-center gap-4 relative">
        <div className="w-20 h-20 bg-gradient-to-br from-adventure-gold to-adventure-amber rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] border-4 border-adventure-brown/50">
          <Compass className="text-adventure-dark animate-flicker" size={40} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-display font-black text-adventure-gold tracking-tight leading-none">
            ARC TREASURE
          </h1>
          <p className="font-accent text-adventure-sand/40 text-xs mt-1 italic">Est. 2026 • Testnet</p>
        </div>
      </div>

      <div className="px-6 py-4 relative">
        <div className="stone-panel p-5 border-adventure-brown/30 bg-black/40">
          <p className="font-display text-[9px] text-adventure-gold/40 uppercase tracking-[0.3em] mb-2">Explorer Credentials</p>
          <p className="font-display font-bold text-adventure-sand text-sm leading-tight mb-4">{stats.rank}</p>
          
          <div className="space-y-1">
            <div className="flex justify-between font-display text-[10px] text-adventure-sand/30 uppercase">
              <span>Expertise</span>
              <span>Lvl {stats.level}</span>
            </div>
            <div className="w-full bg-adventure-dark h-2 rounded-full border border-adventure-brown/20 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-adventure-amber to-adventure-gold h-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                style={{ width: `${(stats.xp % 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-3 relative">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-500 overflow-hidden ${
                isActive 
                  ? 'text-adventure-dark translate-x-2' 
                  : 'text-adventure-sand/60 hover:text-adventure-gold hover:translate-x-1'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-adventure-gold to-adventure-amber shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon size={20} className={`relative z-10 transition-transform duration-500 ${isActive ? 'rotate-12 scale-110' : 'group-hover:rotate-6'}`} />
              <span className="relative z-10 font-display font-bold text-xs tracking-widest">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-adventure-dark rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 relative mt-auto border-t border-adventure-brown/20 bg-black/20">
        <div className="flex items-center gap-3 px-3 py-2 bg-adventure-dark/50 rounded-lg border border-adventure-brown/30 mb-4">
          <div className="w-2 h-2 rounded-full bg-adventure-jungle animate-pulse" />
          <p className="font-serif text-[10px] text-adventure-sand/40 truncate italic">{account}</p>
        </div>
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-adventure-brown/50 text-adventure-sand/40 hover:text-adventure-amber hover:border-adventure-amber/50 transition-all font-display text-[10px] tracking-widest uppercase">
          <LogOut size={16} />
          Abandon Expedition
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
