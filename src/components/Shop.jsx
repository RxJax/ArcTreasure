import React, { useState } from 'react';
import { useGame, MAP_IMAGES, LOOT_TABLE, CHEST_LOOT } from '../context/GameContext';
import { ShoppingBag, Zap, Shield, Briefcase, Shovel, Sparkles, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopItem = ({ icon: Icon, name, level, cost, benefit, onPurchase, canAfford }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:bg-white/10 transition-all border-b-4 border-b-game-gold/20">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 bg-game-orange/10 rounded-xl flex items-center justify-center text-game-orange group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase font-bold text-white/40">Current Level</p>
        <p className="text-game-gold font-bold">LVL {level}</p>
      </div>
    </div>
    
    <div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-xs text-white/40 mt-1">{benefit}</p>
    </div>

      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-game-gold text-[10px] font-black tracking-widest uppercase">
          <Wallet size={12} />
          1.0 USDC Required
        </div>
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all ${
            canAfford 
              ? 'bg-game-gold text-game-brown hover:scale-105 shadow-xl shadow-game-gold/20' 
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
          }`}
        >
          <Zap size={18} fill="currentColor" />
          {cost.toLocaleString()} GOLD
        </button>
      </div>
  </div>
);

const Shop = () => {
  const { stats, setStats, tools, setTools, performAction, addGold, addChestOpened, setInventory } = useGame();

  const handleUpgrade = async (type) => {
    const cost = tools[type]?.cost || 0;
    if (stats.gold < cost) {
      alert("Not enough Gold!");
      return;
    }

    // Every upgrade costs 1.0 USDC on Testnet
    const success = await performAction(`upgrade_${type}_to_lvl_${(tools[type]?.level || 1) + 1}`, "1.0");
    
    if (success) {
      console.log("Deducting gold:", cost);
      addGold(-cost); // Ensure gold is deducted
      setTools(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          level: (prev[type]?.level || 1) + 1,
          cost: Math.floor(cost * 2.5)
        }
      }));
    }
  };

  const [openingChest, setOpeningChest] = useState(false);
  const [chestReward, setChestReward] = useState(null);

  const openChest = async (type) => {
    const cost = type === 'legendary' ? 10000 : 1000;
    console.log(`Opening ${type} chest. Cost: ${cost}. Current Gold: ${stats.gold}`);
    
    if (stats.gold < cost) {
      alert("Not enough Gold!");
      return;
    }

    try {
      const success = await performAction(`open_${type}_chest`, "1.0");
      console.log("Perform action success:", success);
      
      if (success) {
        addGold(-cost);
        setOpeningChest(true);
        
        const pool = CHEST_LOOT[type];
        const loot = pool[Math.floor(Math.random() * pool.length)];
        console.log("Loot rolled:", loot);
        
        setTimeout(() => {
          console.log("Revealing loot...");
          setChestReward(loot);
          setInventory(prev => [...prev, { ...loot, id: Date.now() }]);
          setOpeningChest(false);
          
          // Track mission progress
          addChestOpened();
          if (loot.rarity !== 'Common') {
            setStats(prev => ({
              ...prev,
              rareLootCount: (prev.rareLootCount || 0) + 1
            }));
          }
        }, 2000);
      }
    } catch (err) {
      console.error("Open chest error:", err);
      setOpeningChest(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic">TRADING POST</h2>
          <p className="text-white/40">Equip yourself for deeper exploration.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-white/40">Available Gold</p>
          <p className="text-2xl font-black text-game-gold">{stats.gold.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShopItem 
          icon={Shovel} 
          name="Steel Shovel" 
          level={tools?.shovel?.level || 1} 
          cost={tools?.shovel?.cost || 1000} 
          benefit="Reduces digging time and increases XP gain."
          canAfford={stats.gold >= (tools?.shovel?.cost || 1000)}
          onPurchase={() => handleUpgrade('shovel')}
        />
        <ShopItem 
          icon={Shield} 
          name="Artifact Scanner" 
          level={tools?.detector?.level || 1} 
          cost={tools?.detector?.cost || 2500} 
          benefit="Increases chances of finding Epic or Legendary loot."
          canAfford={stats.gold >= (tools?.detector?.cost || 2500)}
          onPurchase={() => handleUpgrade('detector')}
        />
        <ShopItem 
          icon={Briefcase} 
          name="Explorer Backpack" 
          level={tools?.backpack?.level || 1} 
          cost={tools?.backpack?.cost || 5000} 
          benefit="Expands inventory capacity by 20 slots."
          canAfford={stats.gold >= (tools?.backpack?.cost || 5000)}
          onPurchase={() => handleUpgrade('backpack')}
        />
      </div>

      <div className="mt-12 bg-black/40 border border-white/5 rounded-[2rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShoppingBag size={120} className="text-game-gold" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-black italic mb-4">MYSTERY CHESTS</h3>
          <p className="text-white/60 mb-8">
            Feeling lucky? Purchase a mystery chest for a chance to win exclusive relics that can't be found anywhere else.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-game-gold text-[10px] font-black tracking-widest uppercase ml-2">
                <Wallet size={12} />
                1.0 USDC Required
              </div>
              <button 
                onClick={() => openChest('rare')}
                disabled={stats.gold < 1000 || openingChest}
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <Sparkles size={18} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                RARE CHEST (1k)
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-game-gold text-[10px] font-black tracking-widest uppercase ml-2">
                <Wallet size={12} />
                1.0 USDC Required
              </div>
              <button 
                onClick={() => openChest('legendary')}
                disabled={stats.gold < 10000 || openingChest}
                className="w-full px-8 py-5 bg-game-orange text-game-brown rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-game-orange/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                LEGENDARY CHEST (10k)
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(openingChest || chestReward) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          >
            {openingChest ? (
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-9xl mb-8"
                >
                  🎁
                </motion.div>
                <h3 className="text-3xl font-black italic text-game-gold animate-pulse">UNSEALING CHEST...</h3>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-sm"
              >
                <div className="text-9xl mb-8">{chestReward.icon}</div>
                <p className="text-game-orange font-black tracking-widest uppercase mb-2">{chestReward.rarity} DISCOVERY</p>
                <h2 className="text-5xl font-black italic text-white mb-8 uppercase">{chestReward.name}</h2>
                <button 
                  onClick={() => setChestReward(null)}
                  className="px-12 py-4 bg-game-gold text-game-brown font-black rounded-2xl"
                >
                  COLLECT ITEM
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
