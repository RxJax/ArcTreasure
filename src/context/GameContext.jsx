import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GameContext = createContext();

export const ARC_TESTNET = {
  chainId: '0x4CEF52', // 5042002
  chainName: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
};

export const TREASURY_ADDRESS = "0x89d5286595f5653fa77e38d331d904c0a68832a8";

export const LOOT_TABLE = [
  { name: "Cursed Doubloon", rarity: "Common", icon: "🪙", value: 120 },
  { name: "Sea Glass", rarity: "Common", icon: "💎", value: 90 },
  { name: "Rusty Anchor", rarity: "Common", icon: "⚓", value: 110 },
  { name: "Message in a Bottle", rarity: "Common", icon: "🍾", value: 130 },
  { name: "Silver Chalice", rarity: "Rare", icon: "🍷", value: 500 },
  { name: "Emerald Scarab", rarity: "Rare", icon: "🪲", value: 750 },
  { name: "Jade Figurine", rarity: "Rare", icon: "🗿", value: 900 },
  { name: "Pirate's Map", rarity: "Rare", icon: "📜", value: 650 },
  { name: "Golden Idol", rarity: "Epic", icon: "🔱", value: 2500 },
  { name: "Ruby Crown", rarity: "Epic", icon: "👑", value: 3500 },
  { name: "Cursed Skull", rarity: "Epic", icon: "💀", value: 4000 },
  { name: "Blackbeard's Compass", rarity: "Epic", icon: "🧭", value: 4200 },
  { name: "Diamond Scepter", rarity: "Legendary", icon: "💎", value: 10000 },
  { name: "Phoenix Egg", rarity: "Legendary", icon: "🥚", value: 15000 },
  { name: "Ancient Relic", rarity: "Legendary", icon: "🏺", value: 12000 },
  { name: "Ghost Ship in a Bottle", rarity: "Legendary", icon: "⛵", value: 14000 },
  { name: "Heart of the Oasis", rarity: "Mythic", icon: "💙", value: 50000 },
  { name: "Neptune's Trident", rarity: "Mythic", icon: "🔱", value: 75000 },
];

export const CHEST_LOOT = {
  rare: [
    { name: "Obsidian Dagger", rarity: "Epic", icon: "🗡️", value: 3000 },
    { name: "Golden Compass", rarity: "Epic", icon: "🧭", value: 3500 },
    { name: "Emerald Eye", rarity: "Epic", icon: "👁️", value: 4500 },
    { name: "Lost King's Seal", rarity: "Legendary", icon: "💍", value: 8000 },
  ],
  pirate: [
    { name: "Blackbeard's Cutlass", rarity: "Epic", icon: "⚔️", value: 5000 },
    { name: "Kraken Tooth", rarity: "Epic", icon: "🦷", value: 5500 },
    { name: "Sea Witch's Eye", rarity: "Legendary", icon: "👁️", value: 12000 },
    { name: "Poseidon's Pearl", rarity: "Mythic", icon: "⚪", value: 80000 },
  ],
  legendary: [
    { name: "Scepter of Time", rarity: "Legendary", icon: "⌛", value: 15000 },
    { name: "Dragon Scale", rarity: "Legendary", icon: "🛡️", value: 20000 },
    { name: "Star of the Desert", rarity: "Mythic", icon: "⭐", value: 60000 },
    { name: "Ancient Mech Core", rarity: "Mythic", icon: "⚙️", value: 75000 },
  ]
};

export const MAP_IMAGES = {
  'Desert Ruins': '/desert_map.png',
  'Pirate Island': '/pirate_island.png',
  'Jungle Temple': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80',
  'Ancient Cave': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80',
  'Volcano Zone': 'https://images.unsplash.com/photo-1447023029226-ef8f6b52e3ea?auto=format&fit=crop&q=80',
};

export const useGame = () => useContext(GameContext);

const DEFAULT_STATS = {
  xp: 0,
  gold: 500,
  treasuresFound: 0,
  rareLootCount: 0,
  chestsOpened: 0,
  claimedMissions: [], 
  lastClaimed: {},
  streakDays: 1,
  level: 1,
  rank: 'Beginner Explorer',
  history: [], // Added history tracking
};

const DEFAULT_TOOLS = {
  shovel: { level: 1, name: 'Steel Shovel', cost: 1000 },
  detector: { level: 1, name: 'Artifact Scanner', cost: 2500 },
  backpack: { level: 1, name: 'Explorer Backpack', cost: 5000 },
};

export const GameProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [inventory, setInventory] = useState([]);
  const [activeMap, setActiveMap] = useState('Desert Ruins');
  const [unlockedMaps, setUnlockedMaps] = useState(['Desert Ruins']);
  const [tools, setTools] = useState(DEFAULT_TOOLS);
  
  const isInitialMount = useRef(true);

  // Reset state to defaults
  const resetState = () => {
    setStats(DEFAULT_STATS);
    setInventory([]);
    setUnlockedMaps(['Desert Ruins']);
    setTools(DEFAULT_TOOLS);
    setActiveMap('Desert Ruins');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (err) {
          console.error("Connection check failed:", err);
        }
      }
    };
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setAccount(null);
          resetState();
        }
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      setLoading(true);
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setLoading(false);
        return;
      }
      
      const userAddress = accounts[0].toLowerCase();
      setAccount(userAddress);
      
      // Load Data (Parallel)
      const loadProgress = async () => {
        let dataLoaded = false;
        
        // Load from Firestore if configured
        if (db && db.app.options.apiKey && !db.app.options.apiKey.includes("YOUR_API_KEY")) {
          try {
            console.log("Fetching global data for:", userAddress);
            const userDocRef = doc(db, "users", userAddress);
            
            const userDoc = await Promise.race([
              getDoc(userDocRef),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
            ]);

            if (userDoc && userDoc.exists()) {
              const data = userDoc.data();
              setStats(prev => ({ ...DEFAULT_STATS, ...(data.stats || {}) }));
              setInventory(data.inventory || []);
              setUnlockedMaps(data.unlockedMaps || ['Desert Ruins']);
              setTools(data.tools || DEFAULT_TOOLS);
              console.log("Global progress loaded.");
              dataLoaded = true;
            }
          } catch (dbError) {
            console.warn("Firestore skip/timeout, using local:", dbError.message);
          }
        }

        if (!dataLoaded) {
          const savedProgress = localStorage.getItem(`arc_treasure_${userAddress}`);
          if (savedProgress) {
            const data = JSON.parse(savedProgress);
            setStats(prev => ({ ...DEFAULT_STATS, ...(data.stats || {}) }));
            setInventory(data.inventory || []);
            setUnlockedMaps(data.unlockedMaps || ['Desert Ruins']);
            setTools(data.tools || DEFAULT_TOOLS);
            console.log("Local progress loaded.");
          }
        }
      };

      // Setup Provider and Network (Parallel)
      const setupNetwork = async () => {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ARC_TESTNET.chainId }],
          }).catch(async (err) => {
            if (err.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [ARC_TESTNET],
              });
            }
          });

          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
        } catch (e) {
          console.error("Network setup error:", e);
        }
      };

      await Promise.all([loadProgress(), setupNetwork()]);
      console.log("Setup complete for:", userAddress);

    } catch (error) {
      console.error('Connection failed', error);
      const errMsg = error?.message || "Unknown connection error";
      if (errMsg.toLowerCase().includes("user rejected")) {
        alert("Connection rejected by user.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (account) {
      const data = { 
        stats, 
        inventory, 
        unlockedMaps, 
        tools,
        lastSeen: serverTimestamp ? serverTimestamp() : Date.now(),
        address: account 
      };
      
      // Save locally
      localStorage.setItem(`arc_treasure_${account}`, JSON.stringify(data));
      
      // Save to Firestore (Track every user)
      if (db && db.app.options.apiKey && !db.app.options.apiKey.includes("YOUR_API_KEY")) {
        try {
          await setDoc(doc(db, "users", account), data, { merge: true });
          console.log("Progress saved to Firestore.");
        } catch (e) {
          console.warn("Firestore sync failed:", e);
        }
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      saveProgress();
    }, 1000); // Debounce saves
    return () => clearTimeout(timer);
  }, [stats, inventory, unlockedMaps, tools]);

  const addHistory = (text, type = 'general') => {
    setStats(prev => ({
      ...prev,
      history: [
        { id: Date.now(), text, time: 'Just now', type, timestamp: Date.now() },
        ...(prev.history || []).slice(0, 49) // Keep last 50 events
      ]
    }));
  };

  const addXP = (amount) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      let newRank = prev.rank;
      
      const newlyUnlockedMaps = [];
      if (newLevel >= 15 && !prev.unlockedMaps?.includes('Pirate Island')) newlyUnlockedMaps.push('Pirate Island');
      if (newLevel >= 30 && !prev.unlockedMaps?.includes('Jungle Temple')) newlyUnlockedMaps.push('Jungle Temple');
      if (newLevel >= 50 && !prev.unlockedMaps?.includes('Ancient Cave')) newlyUnlockedMaps.push('Ancient Cave');
      if (newLevel >= 100 && !prev.unlockedMaps?.includes('Volcano Zone')) newlyUnlockedMaps.push('Volcano Zone');

      if (newLevel >= 100) newRank = 'Volcano Overlord';
      else if (newLevel >= 50) newRank = 'Ancient Guardian';
      else if (newLevel >= 30) newRank = 'Jungle Stalker';
      else if (newLevel >= 15) newRank = 'Pirate Raider';
      else if (newLevel >= 5) newRank = 'Treasure Hunter';

      const newHistory = [...(prev.history || [])];
      if (newLevel > prev.level) {
        newHistory.unshift({
          id: Date.now(),
          text: `Level Up! You've reached Level ${newLevel} and became a ${newRank}!`,
          time: 'Just now',
          type: 'rank',
          timestamp: Date.now()
        });
      }

      if (newlyUnlockedMaps.length > 0) {
        setUnlockedMaps(prevMaps => [...prevMaps, ...newlyUnlockedMaps]);
        newlyUnlockedMaps.forEach(map => {
          newHistory.unshift({
            id: Date.now() + Math.random(),
            text: `New Territory Discovered: ${map} is now accessible!`,
            time: 'Just now',
            type: 'map',
            timestamp: Date.now()
          });
        });
      }

      return { 
        ...prev, 
        xp: newXP, 
        level: newLevel, 
        rank: newRank,
        history: newHistory.slice(0, 50),
        unlockedMaps: [...(prev.unlockedMaps || ['Desert Ruins']), ...newlyUnlockedMaps]
      };
    });
  };

  const addGold = (amount) => {
    setStats(prev => ({ ...prev, gold: prev.gold + amount }));
  };

  const addChestOpened = () => {
    setStats(prev => ({ 
      ...prev, 
      chestsOpened: (prev.chestsOpened || 0) + 1,
      history: [
        { id: Date.now(), text: `Unlocked an Ancient Chest and claimed its secrets!`, time: 'Just now', type: 'chest', timestamp: Date.now() },
        ...(prev.history || [])
      ].slice(0, 50)
    }));
  };

  const claimMissionReward = async (missionId) => {
    if (stats.claimedMissions?.includes(missionId)) {
      alert("Already claimed today!");
      return;
    }

    const success = await performAction(`claim_${missionId}_reward`, "1.0");
    
    if (success) {
      setStats(prev => {
        let newGold = prev.gold;
        let newXP = prev.xp;
        let missionName = "";

        if (missionId === 'dig') {
          newGold += 200;
          missionName = "Recover 5 hidden treasures";
        }
        if (missionId === 'chest') {
          newXP += 500;
          missionName = "Unlock 3 ancient chests";
        }
        if (missionId === 'rare') {
          const rareChestItem = { name: "Mystery Chest (Rare)", rarity: "Epic", icon: "🎁", value: 1000 };
          setInventory(inv => [...inv, { ...rareChestItem, id: Date.now() }]);
          missionName = "Identify a Rare Relic";
        }

        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

        return {
          ...prev,
          gold: newGold,
          xp: newXP,
          level: newLevel,
          claimedMissions: [...(prev.claimedMissions || []), missionId],
          lastClaimed: {
            ...(prev.lastClaimed || {}),
            [missionId]: Date.now()
          },
          history: [
            { id: Date.now(), text: `Completed Mission: ${missionName}!`, time: 'Just now', type: 'relic', timestamp: Date.now() },
            ...(prev.history || [])
          ].slice(0, 50)
        };
      });
    }
  };

  // Logic to reset missions after 24 hours
  useEffect(() => {
    if (!stats.lastClaimed) return;
    
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    const missionsToReset = stats.claimedMissions.filter(id => {
      const last = stats.lastClaimed[id] || 0;
      return (now - last) >= TWENTY_FOUR_HOURS;
    });

    if (missionsToReset.length > 0) {
      setStats(prev => ({
        ...prev,
        claimedMissions: prev.claimedMissions.filter(id => !missionsToReset.includes(id)),
        treasuresFound: missionsToReset.includes('dig') ? 0 : prev.treasuresFound,
        chestsOpened: missionsToReset.includes('chest') ? 0 : prev.chestsOpened,
        rareLootCount: missionsToReset.includes('rare') ? 0 : prev.rareLootCount
      }));
    }
  }, [stats.lastClaimed]);

  const performAction = async (actionName, cost = "0") => {
    if (!account || !provider) {
      await connectWallet();
      return false;
    }

    try {
      setLoading(true);
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ARC_TESTNET.chainId }],
        });
      } catch (e) {}

      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: TREASURY_ADDRESS,
        value: ethers.parseUnits(cost, 18),
      });
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`${actionName} failed`, error);
      alert(`Transaction Failed: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContext.Provider value={{
      account,
      loading,
      stats,
      inventory,
      activeMap,
      unlockedMaps,
      tools,
      connectWallet,
      performAction,
      addXP,
      addGold,
      addChestOpened,
      claimMissionReward,
      setActiveMap,
      setInventory,
      setTools,
      setStats,
      addHistory
    }}>
      {children}
    </GameContext.Provider>
  );
};
