import React, { useEffect, useState } from 'react';
import { GameState, User } from '../types';
import { formatNumber } from '../utils';
import { User as UserIcon, Clock, MousePointer2, TrendingUp, Trophy, Calendar, Dices, Edit2, Check, X, Wand2, Loader2 } from 'lucide-react';
import { generateCompanyName } from '../services/geminiService';

interface StatsProfileProps {
  gameState: GameState;
  username: string;
  onUpdateState: (newState: GameState) => void;
}

const StatsProfile: React.FC<StatsProfileProps> = ({ gameState, username, onUpdateState }) => {
  const [rank, setRank] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [timePlayed, setTimePlayed] = useState<string>('');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isGeneratingName, setIsGeneratingName] = useState(false);

  useEffect(() => {
    // Calculate Rank
    const usersStr = localStorage.getItem('neonTycoonUsers');
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      setTotalUsers(users.length);
      
      // Sort logic same as leaderboard (default money/rebirth)
      users.sort((a, b) => {
        if (b.gameState.rebirths !== a.gameState.rebirths) {
          return b.gameState.rebirths - a.gameState.rebirths;
        }
        return b.gameState.money - a.gameState.money;
      });

      const myRank = users.findIndex(u => u.username === username) + 1;
      setRank(myRank > 0 ? myRank : null);
    }
  }, [username, gameState.money, gameState.rebirths]);

  useEffect(() => {
    // Format Time Played
    const start = gameState.startTime || Date.now();
    const diff = Date.now() - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let timeStr = '';
    if (hours > 0) timeStr += `${hours}h `;
    timeStr += `${minutes}m`;
    if (hours === 0 && minutes === 0) timeStr = '< 1m';
    
    setTimePlayed(timeStr);
  }, [gameState.startTime]);

  const startEditing = () => {
    setEditedName(gameState.companyName);
    setIsEditing(true);
  };

  const saveName = () => {
    if (editedName.trim()) {
      onUpdateState({ ...gameState, companyName: editedName.trim() });
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleAiGenerate = async () => {
    setIsGeneratingName(true);
    try {
      const name = await generateCompanyName();
      setEditedName(name);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingName(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 overflow-y-auto custom-scrollbar relative flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
            <span className="text-3xl font-bold text-white">{username.charAt(0).toUpperCase()}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xl font-bold text-white focus:border-blue-500 focus:outline-none w-full max-w-[300px]"
                  placeholder="Company Name"
                  autoFocus
                />
                <button onClick={handleAiGenerate} disabled={isGeneratingName} className="p-2 bg-purple-900/50 hover:bg-purple-800/50 rounded border border-purple-700 text-purple-300" title="Generate with AI">
                   {isGeneratingName ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                </button>
                <button onClick={saveName} className="p-2 bg-green-900/50 hover:bg-green-800/50 rounded border border-green-700 text-green-400">
                  <Check size={20} />
                </button>
                <button onClick={cancelEditing} className="p-2 bg-red-900/50 hover:bg-red-800/50 rounded border border-red-700 text-red-400">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-3xl font-bold text-white truncate">{gameState.companyName}</h1>
                <button onClick={startEditing} className="text-slate-600 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-400 font-mono text-sm mt-1">
              <UserIcon size={14} />
              CEO: {username}
            </div>
          </div>

          <div className="ml-auto text-right hidden sm:block">
             <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Global Rank</div>
             <div className="text-4xl font-black text-white flex items-center justify-end gap-2">
                <Trophy size={24} className={rank === 1 ? 'text-yellow-500' : 'text-slate-600'} />
                #{rank ?? '-'}
             </div>
             <div className="text-xs text-slate-600">Top {(rank && totalUsers) ? Math.max(1, Math.floor((rank/totalUsers)*100)) : 100}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Net Worth Card */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
               <div className="flex items-center gap-3 mb-2 text-green-400">
                  <TrendingUp size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Current Net Worth</span>
               </div>
               <div className="text-3xl font-mono text-white">${formatNumber(gameState.money)}</div>
               <div className="text-xs text-slate-500 mt-2">Available funds for investment</div>
            </div>

            {/* Lifetime Earnings */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
               <div className="flex items-center gap-3 mb-2 text-blue-400">
                  <TrendingUp size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Lifetime Earnings</span>
               </div>
               <div className="text-3xl font-mono text-white">${formatNumber(gameState.totalLifetimeMoney)}</div>
               <div className="text-xs text-slate-500 mt-2">Total generated value since inception</div>
            </div>

             {/* Rebirths */}
             <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
               <div className="flex items-center gap-3 mb-2 text-purple-400">
                  <Trophy size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Rebirths</span>
               </div>
               <div className="text-3xl font-mono text-white">{gameState.rebirths}</div>
               <div className="text-xs text-slate-500 mt-2">Prestige Multiplier: <span className="text-purple-300">{gameState.prestigeMultiplier}x</span></div>
            </div>

            {/* Manual Clicks */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors">
               <div className="flex items-center gap-3 mb-2 text-orange-400">
                  <MousePointer2 size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Manual Clicks</span>
               </div>
               <div className="text-3xl font-mono text-white">{formatNumber(gameState.manualClicks || 0)}</div>
               <div className="text-xs text-slate-500 mt-2">Total manual interactions</div>
            </div>
            
             {/* Casino Wins */}
             <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors md:col-span-2">
               <div className="flex items-center gap-3 mb-2 text-red-400">
                  <Dices size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Casino Blackjacks Won</span>
               </div>
               <div className="text-3xl font-mono text-white">{formatNumber(gameState.blackjackWins || 0)}</div>
               <div className="text-xs text-slate-500 mt-2">Total successful hands</div>
            </div>

            {/* Time Played */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-colors md:col-span-2">
               <div className="flex items-center gap-3 mb-2 text-slate-400">
                  <Clock size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Time Active</span>
               </div>
               <div className="text-2xl font-mono text-white">{timePlayed}</div>
               <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                  <Calendar size={12} />
                  Started: {new Date(gameState.startTime || Date.now()).toLocaleDateString()}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsProfile;