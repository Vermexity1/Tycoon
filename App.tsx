import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, FloatingText, MarketEvent, User, View } from './types';
import { INITIAL_STATE, INITIAL_UPGRADES, REBIRTH_COST, REBIRTH_SCALING } from './constants';
import ClickerArea from './components/ClickerArea';
import UpgradesPanel from './components/UpgradesPanel';
import RebirthPanel from './components/RebirthPanel';
import AdminPanel from './components/AdminPanel';
import NewsTicker from './components/NewsTicker';
import AuthScreen from './components/AuthScreen';
import Leaderboard from './components/Leaderboard';
import StatsProfile from './components/StatsProfile';
import CasinoPanel from './components/CasinoPanel';
import { generateCompanyName, generateMarketEvent } from './services/geminiService';
import { Terminal, Globe, LogOut, User as UserIcon, RefreshCcw, Dices } from 'lucide-react';
import { formatNumber } from './utils';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('GAME');

  // Game State (Loaded from User)
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // Derived Values
  const [incomePerSecond, setIncomePerSecond] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  
  // UI State
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [marketEvent, setMarketEvent] = useState<MarketEvent>({ 
    message: "Welcome to Neon Tycoon. Market is stable.", 
    effect: 'NONE', 
    multiplier: 1.0, 
    duration: 0 
  });
  
  // Refs for loops & state access
  const lastTickRef = useRef<number>(Date.now());
  const requestRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(gameState);

  // Keep ref in sync with state for the interval to access latest data without re-triggering
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // --- Handlers Defined Before Effects ---
  const handleLogin = (user: User) => {
    // Merge loaded state with defaults for new fields (like manualClicks, blackjackWins)
    const mergedState = { ...INITIAL_STATE, ...user.gameState };
    setCurrentUser({ ...user, gameState: mergedState });
    setGameState(mergedState);
    
    // Set Session Persistence
    localStorage.setItem('neonTycoonSession', user.username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('GAME');
    localStorage.removeItem('neonTycoonSession');
  };

  // --- Effects ---

  // Check for persistent session on mount
  useEffect(() => {
    const sessionUsername = localStorage.getItem('neonTycoonSession');
    if (sessionUsername && !currentUser) {
       const usersStr = localStorage.getItem('neonTycoonUsers');
       if (usersStr) {
         const users: User[] = JSON.parse(usersStr);
         const foundUser = users.find(u => u.username === sessionUsername);
         if (foundUser) {
           handleLogin(foundUser);
         }
       }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // --- Calculations ---
  
  const calculateDerivedStats = useCallback(() => {
    let baseIps = 0;
    
    // Calculate base IPS from upgrades
    INITIAL_UPGRADES.forEach(u => {
      const count = gameState.upgrades[u.id] || 0;
      baseIps += u.baseIncome * count;
    });

    // Apply Prestige Multiplier
    let totalIps = baseIps * gameState.prestigeMultiplier;

    // Apply Market Event Multiplier
    totalIps *= marketEvent.multiplier;

    setIncomePerSecond(totalIps);
    
    // Click Value is typically a % of IPS or a base value + upgrades
    // For this simple tycoon: Base 1 + 5% of IPS
    let clickVal = (1 + (totalIps * 0.05)) * gameState.prestigeMultiplier * marketEvent.multiplier;
    setClickValue(clickVal);

  }, [gameState.upgrades, gameState.prestigeMultiplier, marketEvent.multiplier]);


  // Recalculate stats when state changes
  useEffect(() => {
    calculateDerivedStats();
  }, [calculateDerivedStats]);

  // Persist State to LocalStorage (User DB)
  // CRITICAL FIX: This effect now uses gameStateRef and only depends on currentUser.
  useEffect(() => {
    if (!currentUser) return;

    const saveGame = () => {
      const currentState = gameStateRef.current;
      
      // 1. Get DB
      const usersStr = localStorage.getItem('neonTycoonUsers');
      let users: User[] = usersStr ? JSON.parse(usersStr) : [];
      
      // Check if current user still exists in DB
      const userIndex = users.findIndex(u => u.username === currentUser.username);

      if (userIndex >= 0) {
        // Update existing
        users[userIndex] = { ...users[userIndex], gameState: currentState };
      } else {
        // Re-insert if missing
        users.push({
          username: currentUser.username,
          password: currentUser.password,
          gameState: currentState
        });
      }

      // 3. Save
      localStorage.setItem('neonTycoonUsers', JSON.stringify(users));
    };

    // Save periodically
    const saveInterval = setInterval(saveGame, 1000); 

    // Also save on unmount/page hide
    const handleUnload = () => saveGame();
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleUnload);
      saveGame(); // Save one last time on cleanup
    };
  }, [currentUser]);

  // Initial Setup (Company Name)
  useEffect(() => {
    if (currentUser && gameState.companyName.endsWith('Corp')) {
      // Only generate if it looks like the default formatted name
      generateCompanyName().then(name => {
        setGameState(prev => ({ ...prev, companyName: name }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Run once per login

  // Game Loop
  const gameLoop = useCallback(() => {
    if (!currentUser) return; // Don't run loop if not logged in

    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    
    if (delta > 0.1) { // Throttle updates slightly to 10fps for state updates
      setGameState(prev => {
        return {
          ...prev,
          money: prev.money + (incomePerSecond * delta),
          totalLifetimeMoney: prev.totalLifetimeMoney + (incomePerSecond * delta)
        };
      });
      lastTickRef.current = now;
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [incomePerSecond, currentUser]);

  useEffect(() => {
    if (currentUser) {
      lastTickRef.current = Date.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop, currentUser]);

  // Market Event Generator Loop
  useEffect(() => {
    if (!currentUser) return;
    const timer = setInterval(async () => {
       const event = await generateMarketEvent(gameState.money);
       setMarketEvent({
         message: event.message,
         effect: event.multiplier > 1 ? 'BOOST' : event.multiplier < 1 ? 'CRASH' : 'NONE',
         multiplier: event.multiplier,
         duration: 60
       });
    }, 45000); 
    return () => clearInterval(timer);
  }, [gameState.money, currentUser]);

  // Keyboard Shortcuts (Admin Panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
        setShowAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Handlers (Remaining) ---

  const handleManualClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + clickValue,
      totalLifetimeMoney: prev.totalLifetimeMoney + clickValue,
      manualClicks: (prev.manualClicks || 0) + 1
    }));

    const id = Date.now();
    const x = e.clientX + (Math.random() * 40 - 20);
    const y = e.clientY - 20 + (Math.random() * 40 - 20);
    setFloatingTexts(prev => [...prev, { id, x, y, text: `+$${formatNumber(clickValue)}` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 1000);
  };

  const buyUpgrade = (id: string) => {
    const upgrade = INITIAL_UPGRADES.find(u => u.id === id);
    if (!upgrade) return;

    // Requirement Check
    if (upgrade.requiredRebirths && gameState.rebirths < upgrade.requiredRebirths) {
      return;
    }

    const currentCount = gameState.upgrades[id] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentCount));

    if (gameState.money >= cost) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - cost,
        upgrades: {
          ...prev.upgrades,
          [id]: currentCount + 1
        }
      }));
    }
  };

  const handleRebirth = () => {
    const nextRebirthCost = REBIRTH_COST * Math.pow(REBIRTH_SCALING, gameState.rebirths);
    if (gameState.money >= nextRebirthCost) {
       setGameState(prev => ({
         ...INITIAL_STATE, 
         companyName: prev.companyName, 
         rebirths: prev.rebirths + 1,
         prestigeMultiplier: prev.prestigeMultiplier + 0.5,
         startTime: Date.now(),
         manualClicks: prev.manualClicks, // Keep lifetime clicks
         blackjackWins: prev.blackjackWins // Keep casino wins
       }));
       setCurrentView('GAME'); // Go back to game after rebirth
    }
  };

  // State update from Admin Panel or Casino
  const updateState = (newState: GameState) => {
    setGameState(newState);
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Navigation / Header */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
           <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mr-4">
             NEON TYCOON
           </div>
           
           <nav className="flex gap-1">
             <button 
               onClick={() => setCurrentView('GAME')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                 ${currentView === 'GAME' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Terminal size={14} /> <span className="hidden sm:inline">Operation</span>
             </button>
             <button 
               onClick={() => setCurrentView('CASINO')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                 ${currentView === 'CASINO' ? 'bg-green-900/50 text-white border border-green-800' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Dices size={14} /> <span className="hidden sm:inline">Casino</span>
             </button>
             <button 
               onClick={() => setCurrentView('REBIRTH')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                 ${currentView === 'REBIRTH' ? 'bg-purple-900/50 text-white border border-purple-800' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <RefreshCcw size={14} /> <span className="hidden sm:inline">Ascension</span>
             </button>
             <button 
               onClick={() => setCurrentView('STATS')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                 ${currentView === 'STATS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <UserIcon size={14} /> <span className="hidden sm:inline">Profile</span>
             </button>
             <button 
               onClick={() => setCurrentView('LEADERBOARD')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
                 ${currentView === 'LEADERBOARD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <Globe size={14} /> <span className="hidden sm:inline">Network</span>
             </button>
           </nav>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="text-xs text-slate-500 font-mono hidden md:inline">Logged in as {currentUser.username}</span>
           <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
             <LogOut size={18} />
           </button>
        </div>
      </div>

      {currentView === 'GAME' && (
        <>
          <NewsTicker 
            message={`${marketEvent.message} (Income x${marketEvent.multiplier})`} 
            isPositive={marketEvent.multiplier >= 1} 
          />
          
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            <div className="flex-1 relative">
              <ClickerArea 
                money={gameState.money} 
                clickValue={clickValue}
                incomePerSecond={incomePerSecond}
                onManualClick={handleManualClick}
                companyName={gameState.companyName}
              />
              {floatingTexts.map(ft => (
                <div
                  key={ft.id}
                  className="float-text text-2xl font-bold text-green-400"
                  style={{ left: ft.x, top: ft.y }}
                >
                  {ft.text}
                </div>
              ))}
            </div>

            <div className="w-full md:w-[450px] flex flex-col border-l border-slate-800 bg-slate-900 z-10 shadow-2xl">
              <UpgradesPanel 
                money={gameState.money}
                upgrades={INITIAL_UPGRADES}
                owned={gameState.upgrades}
                buyUpgrade={buyUpgrade}
                prestigeMultiplier={gameState.prestigeMultiplier}
                rebirths={gameState.rebirths}
              />
            </div>
          </div>
        </>
      )}

      {currentView === 'CASINO' && (
        <CasinoPanel 
          gameState={gameState} 
          onUpdateState={updateState} 
        />
      )}

      {currentView === 'REBIRTH' && (
        <RebirthPanel 
          money={gameState.money}
          rebirths={gameState.rebirths}
          onRebirth={handleRebirth}
          prestigeMultiplier={gameState.prestigeMultiplier}
        />
      )}

      {currentView === 'STATS' && (
        <StatsProfile gameState={gameState} username={currentUser.username} onUpdateState={updateState} />
      )}

      {currentView === 'LEADERBOARD' && (
        <Leaderboard />
      )}

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)} 
        currentUser={currentUser}
        onUpdateCurrentUserState={updateState}
      />
      
      {/* Version overlay only */}
      <div className="fixed bottom-4 left-4 text-slate-700 text-[10px] pointer-events-none select-none z-0">
        v1.6.0
      </div>
    </div>
  );
};

export default App;