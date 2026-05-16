import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MapExplorer from './components/MapExplorer';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import WalletModal from './components/WalletModal';
import { AnimatePresence, motion } from 'framer-motion';

const DustParticles = () => (
  <div className="dust-container">
    {Array.from({ length: 40 }).map((_, i) => (
      <div 
        key={i} 
        className="dust-particle animate-float-dust" 
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 20}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
        }}
      />
    ))}
  </div>
);

const MainApp = () => {
  const { account, loading } = useGame();
  const [activeTab, setActiveTab] = useState('home');

  if (!account) {
    return <WalletModal />;
  }

  return (
    <div className="flex h-screen bg-adventure-dark text-adventure-sand overflow-hidden font-serif selection:bg-adventure-gold/30">
      <DustParticles />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        {/* Immersive Background - Ensure pointer-events-none so it doesn't block scrolling */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
          style={{ backgroundImage: "url('/explorer_hq_bg.png')" }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-adventure-dark/20 to-adventure-dark pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-8 relative z-10 max-w-7xl mx-auto"
          >
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'map' && <MapExplorer />}
            {activeTab === 'inventory' && <Inventory />}
            {activeTab === 'merchant' && <Shop />}
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'hall' && <Leaderboard />}
          </motion.div>
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-adventure-dark/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-t-4 border-l-4 border-adventure-gold rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-b-4 border-r-4 border-adventure-amber/50 rounded-full animate-spin-reverse"></div>
              </div>
            </div>
            <p className="mt-8 font-display text-adventure-gold text-2xl tracking-[0.3em] animate-flicker">Consulting the Ancients...</p>
            <p className="font-accent text-adventure-sand/40 text-sm mt-2 italic">Translating forgotten scripts...</p>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}

export default App;
