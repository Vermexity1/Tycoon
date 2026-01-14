import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Terminal, Users, Trash2, RotateCcw, Save, Zap, Settings, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { User, GameState } from '../types';
import { INITIAL_UPGRADES } from '../constants';
import { formatNumber } from '../utils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateCurrentUserState: (newState: GameState) => void;
}

const ADMIN_PASSWORD = "X9#mK2$pL5"; // Random simulated password

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onUpdateCurrentUserState 
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsAuthenticated(false);
      setError('');
      setExpandedUser(null);
    }
  }, [isOpen]);

  // Load users for management
  useEffect(() => {
    if (isAuthenticated) {
      const load = () => {
        const s = localStorage.getItem('neonTycoonUsers');
        if (s) setUsersList(JSON.parse(s));
      };
      load();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Access Denied: Invalid Credentials');
    }
  };

  const saveDatabase = (updatedList: User[]) => {
    localStorage.setItem('neonTycoonUsers', JSON.stringify(updatedList));
    setUsersList(updatedList);
  };

  const handleAction = (targetUsername: string, action: 'RESET_MONEY' | 'STEAL_REBIRTH' | 'RESET_UPGRADES' | 'ADD_MONEY' | 'GRANT_TECH') => {
    const updatedList = usersList.map(u => {
      if (u.username !== targetUsername) return u;

      // Create a deep copy of the user to modify
      const updatedUser = { ...u, gameState: { ...u.gameState, upgrades: { ...u.gameState.upgrades } } };

      switch (action) {
        case 'RESET_MONEY':
          updatedUser.gameState.money = 0;
          break;
        case 'RESET_UPGRADES':
          updatedUser.gameState.upgrades = {};
          break;
        case 'STEAL_REBIRTH':
          updatedUser.gameState.rebirths = Math.max(0, updatedUser.gameState.rebirths - 1);
          updatedUser.gameState.prestigeMultiplier = Math.max(1.0, updatedUser.gameState.prestigeMultiplier - 0.5);
          break;
        case 'ADD_MONEY':
          updatedUser.gameState.money += 1000000000;
          break;
        case 'GRANT_TECH':
          INITIAL_UPGRADES.forEach(upgrade => {
            updatedUser.gameState.upgrades[upgrade.id] = (updatedUser.gameState.upgrades[upgrade.id] || 0) + 5;
          });
          break;
      }
      return updatedUser;
    });

    saveDatabase(updatedList);

    if (currentUser && currentUser.username === targetUsername) {
      const me = updatedList.find(u => u.username === currentUser.username);
      if (me) onUpdateCurrentUserState(me.gameState);
    }
  };

  const handleIndividualUpgrade = (targetUsername: string, upgradeId: string, delta: number) => {
    const updatedList = usersList.map(u => {
      if (u.username !== targetUsername) return u;
      
      const updatedUser = { ...u, gameState: { ...u.gameState, upgrades: { ...u.gameState.upgrades } } };
      const currentCount = updatedUser.gameState.upgrades[upgradeId] || 0;
      updatedUser.gameState.upgrades[upgradeId] = Math.max(0, currentCount + delta);
      
      return updatedUser;
    });

    saveDatabase(updatedList);

    if (currentUser && currentUser.username === targetUsername) {
      const me = updatedList.find(u => u.username === currentUser.username);
      if (me) onUpdateCurrentUserState(me.gameState);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-red-900/50 w-full max-w-5xl max-h-[90vh] rounded-lg shadow-2xl shadow-red-900/20 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-red-950/30 p-4 flex justify-between items-center border-b border-red-900/30 shrink-0">
          <h2 className="text-red-500 font-mono font-bold flex items-center gap-2 text-lg">
            <ShieldAlert size={20} />
            SYSTEM ADMINISTRATOR
          </h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {!isAuthenticated ? (
            <div className="max-w-xs mx-auto mt-10 md:mt-20">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-slate-500 font-bold tracking-wider">Passcode Required</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-mono bg-red-950/30 p-2 rounded border border-red-900/50">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-200 border border-red-800 rounded py-3 font-mono text-sm transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  AUTHENTICATE
                </button>
                <p className="text-[10px] text-slate-600 text-center pt-2">Hint: check constants or source code</p>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 text-green-500 font-mono text-xs border-b border-green-900/30 pb-4">
                <Terminal size={14} />
                <span>ROOT PRIVILEGES ACTIVE. MONITORING {usersList.length} ENTITIES.</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-slate-400 font-mono text-sm uppercase flex items-center gap-2">
                  <Users size={16} /> User Registry
                </h3>
                
                <div className="grid gap-4">
                  {usersList.map(user => {
                    const isExpanded = expandedUser === user.username;
                    return (
                      <div key={user.username} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col group hover:border-slate-600 transition-colors gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-lg">{user.username}</span>
                              {currentUser?.username === user.username && <span className="text-[10px] bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded border border-blue-800">YOU</span>}
                              <span className="text-xs text-slate-500 truncate max-w-[200px]">{user.gameState.companyName}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-1 flex flex-wrap gap-3">
                              <span className="text-green-400/80">Money: ${formatNumber(user.gameState.money)}</span>
                              <span className="text-purple-400/80">Rebirths: {user.gameState.rebirths}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                             <button
                              onClick={() => setExpandedUser(isExpanded ? null : user.username)}
                              className={`flex-1 lg:flex-none p-2 rounded text-xs border flex items-center justify-center gap-1 transition-colors whitespace-nowrap
                                ${isExpanded ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'}`}
                            >
                              <Settings size={14} /> {isExpanded ? 'Close Edit' : 'Edit Tech'}
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            <button
                              onClick={() => handleAction(user.username, 'ADD_MONEY')}
                              className="flex-1 lg:flex-none p-2 bg-slate-800 hover:bg-green-900/50 text-green-400 rounded text-xs border border-slate-700 hover:border-green-500 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                              title="Inject Funds"
                            >
                              <Save size={14} /> +$1B
                            </button>
                            
                            <button
                              onClick={() => handleAction(user.username, 'GRANT_TECH')}
                              className="flex-1 lg:flex-none p-2 bg-slate-800 hover:bg-blue-900/50 text-blue-400 rounded text-xs border border-slate-700 hover:border-blue-500 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                              title="Grant All Upgrades (+5)"
                            >
                              <Zap size={14} /> +All 5
                            </button>

                            <button
                              onClick={() => handleAction(user.username, 'RESET_MONEY')}
                              className="flex-1 lg:flex-none p-2 bg-slate-800 hover:bg-yellow-900/50 text-yellow-400 rounded text-xs border border-slate-700 hover:border-yellow-500 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                              title="Bankrupt (Reset Money)"
                            >
                              <Trash2 size={14} /> $0
                            </button>
                            
                            <button
                              onClick={() => handleAction(user.username, 'RESET_UPGRADES')}
                              className="flex-1 lg:flex-none p-2 bg-slate-800 hover:bg-orange-900/50 text-orange-400 rounded text-xs border border-slate-700 hover:border-orange-500 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                              title="Seize Assets (Reset Upgrades)"
                            >
                              <RotateCcw size={14} /> Reset
                            </button>
                          </div>
                        </div>

                        {/* Detailed Upgrade Editor */}
                        {isExpanded && (
                          <div className="mt-2 bg-black/40 p-4 rounded-lg border border-slate-800 animate-slide-in">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Settings size={12} /> Granular Upgrade Control
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {INITIAL_UPGRADES.map(upgrade => {
                                const count = user.gameState.upgrades[upgrade.id] || 0;
                                return (
                                  <div key={upgrade.id} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800/50 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="text-lg">{upgrade.icon}</span>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-xs text-slate-300 font-bold truncate">{upgrade.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">Lvl {count}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <button 
                                        onClick={() => handleIndividualUpgrade(user.username, upgrade.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center bg-red-900/30 text-red-400 hover:bg-red-900/60 rounded text-xs border border-red-900/50"
                                        title="-1"
                                      >
                                        <Minus size={10} />
                                      </button>
                                      <button 
                                        onClick={() => handleIndividualUpgrade(user.username, upgrade.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center bg-green-900/30 text-green-400 hover:bg-green-900/60 rounded text-xs border border-green-900/50"
                                        title="+1"
                                      >
                                        <Plus size={10} />
                                      </button>
                                      <button 
                                        onClick={() => handleIndividualUpgrade(user.username, upgrade.id, 10)}
                                        className="w-8 h-6 flex items-center justify-center bg-blue-900/30 text-blue-400 hover:bg-blue-900/60 rounded text-xs border border-blue-900/50 font-mono"
                                        title="+10"
                                      >
                                        +10
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;