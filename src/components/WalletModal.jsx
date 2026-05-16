import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Wallet, Compass, ShieldCheck, Sparkles, Globe } from 'lucide-react';

const WalletModal = () => {
  const { connectWallet, loading } = useGame();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0c0a09]">
      {/* Background with explicit fallback */}
      <div className="absolute inset-0 bg-[#1a0f0e]" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" 
        style={{ backgroundImage: "url('/explorer_hq_bg.png')" }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative parchment-card w-full max-w-xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-4 border-adventure-brown/40"
      >
        {/* Scroll End Decoration */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-adventure-brown/20 border-b border-adventure-brown/10" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-adventure-brown/20 border-t border-adventure-brown/10" />

        <div className="p-12 text-center flex flex-col items-center relative z-10 bg-adventure-sand/5">
          <div className="relative mb-10 group">
            <div className="absolute inset-0 bg-adventure-amber/20 rounded-full blur-2xl group-hover:bg-adventure-amber/40 transition-all animate-pulse" />
            <div className="w-24 h-24 bg-gradient-to-br from-adventure-gold to-adventure-amber rounded-full flex items-center justify-center shadow-2xl relative border-4 border-adventure-brown/30 rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <Compass className="text-adventure-dark drop-shadow-lg" size={48} />
            </div>
          </div>

          <h1 className="text-5xl font-display font-black text-adventure-brown tracking-tighter mb-4 drop-shadow-sm">
            ARC TREASURE <span className="text-adventure-amber drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">HUNT</span>
          </h1>
          
          <div className="w-24 h-0.5 bg-adventure-brown/30 mb-6" />
          
          <p className="font-serif italic text-adventure-brown/80 text-xl leading-relaxed mb-10 max-w-sm mx-auto">
            "Unlock the secrets of the <span className="text-adventure-dark font-bold">Arc Testnet</span> and claim the artifacts lost to the ages."
          </p>

          <div className="grid grid-cols-1 gap-4 w-full mb-12">
            <div className="flex items-center gap-5 bg-adventure-brown/5 border border-adventure-brown/10 rounded-2xl p-5 text-left group hover:bg-adventure-brown/10 transition-colors">
              <div className="w-12 h-12 bg-adventure-brown/10 rounded-xl flex items-center justify-center text-adventure-brown border border-adventure-brown/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-adventure-dark tracking-widest uppercase">Ancient Security</p>
                <p className="font-serif italic text-xs text-adventure-brown/60">Protected by Arc Network protocols</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-adventure-brown/5 border border-adventure-brown/10 rounded-2xl p-5 text-left group hover:bg-adventure-brown/10 transition-colors">
              <div className="w-12 h-12 bg-adventure-brown/10 rounded-xl flex items-center justify-center text-adventure-brown border border-adventure-brown/20">
                <Globe size={24} />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-adventure-dark tracking-widest uppercase">Global Guilds</p>
                <p className="font-serif italic text-xs text-adventure-brown/60">Compete with explorers across the realm</p>
              </div>
            </div>
          </div>

          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full btn-adventure py-6 text-xl tracking-[0.2em] flex items-center justify-center gap-4 group"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-adventure-dark border-t-transparent rounded-full animate-spin"></div>
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Wallet size={28} className="group-hover:rotate-12 transition-transform" />
                ENTER THE RUINS
                <Sparkles size={24} className="animate-pulse" />
              </>
            )}
          </button>

          <p className="mt-10 font-display text-adventure-brown/40 text-[10px] font-black tracking-[0.3em] uppercase">
            MetaMask Required • Protocol: Arc Testnet
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletModal;
