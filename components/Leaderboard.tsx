import React, { useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { Trophy, RefreshCcw, DollarSign, Crown, Medal, MousePointer2, Dices } from 'lucide-react';
import { formatNumber } from '../utils';

type SortCriteria = 'MONEY' | 'REBIRTHS' | 'CLICKS' | 'WINS';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortCriteria>('MONEY');

  const fetchData = useCallback((showSpinner: boolean) => {
    if (showSpinner) setIsRefreshing(true);
    
    const usersStr = localStorage.getItem('neonTycoonUsers');
    if (usersStr) {
      const parsedUsers: User[] = JSON.parse(usersStr);
      
      // Sort Logic
      parsedUsers.sort((a, b) => {
        switch (sortBy) {
          case 'MONEY':
            if (b.gameState.money !== a.gameState.money) return b.gameState.money - a.gameState.money;
            return b.gameState.rebirths - a.gameState.rebirths; // Tiebreaker
          case 'REBIRTHS':
            if (b.gameState.rebirths !== a.gameState.rebirths) return b.gameState.rebirths - a.gameState.rebirths;
            return b.gameState.money - a.gameState.money; // Tiebreaker
          case 'CLICKS':
            return (b.gameState.manualClicks || 0) - (a.gameState.manualClicks || 0);
          case 'WINS':
            return (b.gameState.blackjackWins || 0) - (a.gameState.blackjackWins || 0);
          default:
            return 0;
        }
      });
      
      setUsers(parsedUsers);
    }

    if (showSpinner) {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(false), 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3, 10); // Limit to top 10

  const getMetricIcon = () => {
    switch(sortBy) {
      case 'MONEY': return <DollarSign size={14} />;
      case 'REBIRTHS': return <RefreshCcw size={14} />;
      case 'CLICKS': return <MousePointer2 size={14} />;
      case 'WINS': return <Dices size={14} />;
    }
  };

  const getMetricValue = (user: User) => {
    switch(sortBy) {
      case 'MONEY': return `$${formatNumber(user.gameState.money)}`;
      case 'REBIRTHS': return user.gameState.rebirths;
      case 'CLICKS': return formatNumber(user.gameState.manualClicks || 0);
      case 'WINS': return formatNumber(user.gameState.blackjackWins || 0);
    }
  };

  // Helper for podium rendering
  const renderPodiumItem = (user: User, rank: number) => {
    let heightClass = 'h-32';
    let colorClass = 'bg-slate-800';
    let borderClass = 'border-slate-700';
    let icon = null;
    let rankColor = 'text-slate-500';

    if (rank === 1) {
      heightClass = 'h-48 md:h-56';
      colorClass = 'bg-yellow-500/20';
      borderClass = 'border-yellow-500';
      rankColor = 'text-yellow-400';
      icon = <Crown className="text-yellow-500 mb-2 animate-bounce" size={32} />;
    } else if (rank === 2) {
      heightClass = 'h-40 md:h-44';
      colorClass = 'bg-slate-400/20';
      borderClass = 'border-slate-400';
      rankColor = 'text-slate-300';
      icon = <Medal className="text-slate-400 mb-2" size={24} />;
    } else if (rank === 3) {
      heightClass = 'h-36 md:h-36';
      colorClass = 'bg-orange-700/20';
      borderClass = 'border-orange-700';
      rankColor = 'text-orange-400';
      icon = <Medal className="text-orange-600 mb-2" size={24} />;
    }

    return (
      <div className="flex flex-col items-center justify-end group w-1/3 max-w-[160px]">
         {/* Avatar/Icon area */}
         <div className="flex flex-col items-center mb-4 transition-transform group-hover:-translate-y-2 w-full">
            {icon}
            <div className="font-bold text-white text-sm md:text-lg text-center leading-tight truncate w-full px-1">
               {user.gameState.companyName}
            </div>
            <div className="text-[10px] md:text-xs text-slate-500 font-mono truncate max-w-full px-1">
               {user.username}
            </div>
             <div className="flex items-center gap-1 mt-1 text-green-400 font-mono text-[10px] md:text-sm bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-800">
                 {getMetricIcon()}
                 {getMetricValue(user)}
             </div>
         </div>
         
         {/* The Podium Box */}
         <div className={`w-full ${heightClass} ${colorClass} border-t-4 ${borderClass} rounded-t-lg flex items-start justify-center pt-4 relative backdrop-blur-md shadow-2xl`}>
             <span className={`text-3xl md:text-5xl font-black ${rankColor} opacity-30 select-none`}>#{rank}</span>
         </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 overflow-y-auto custom-scrollbar relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/10 p-4 rounded-full border border-yellow-500/20">
              <Trophy className="text-yellow-500" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Global Markets</h1>
              <p className="text-slate-400">Top corporations ranked by performance</p>
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all text-slate-300 hover:text-white group shadow-lg"
          >
            <RefreshCcw size={18} className={isRefreshing ? "animate-spin text-blue-400" : "group-hover:rotate-180 transition-transform duration-500"} />
            <span className="hidden md:inline font-mono text-sm">Refresh</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
           <button 
             onClick={() => setSortBy('MONEY')}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border
               ${sortBy === 'MONEY' ? 'bg-green-900/30 text-green-400 border-green-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'}`}
           >
             <DollarSign size={16} /> Net Worth
           </button>
           <button 
             onClick={() => setSortBy('REBIRTHS')}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border
               ${sortBy === 'REBIRTHS' ? 'bg-purple-900/30 text-purple-400 border-purple-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'}`}
           >
             <RefreshCcw size={16} /> Rebirths
           </button>
           <button 
             onClick={() => setSortBy('CLICKS')}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border
               ${sortBy === 'CLICKS' ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'}`}
           >
             <MousePointer2 size={16} /> Manual Clicks
           </button>
           <button 
             onClick={() => setSortBy('WINS')}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border
               ${sortBy === 'WINS' ? 'bg-red-900/30 text-red-400 border-red-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'}`}
           >
             <Dices size={16} /> Casino Wins
           </button>
        </div>

        {/* Podium Section */}
        {top3.length > 0 && (
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-16 min-h-[320px]">
            {/* 2nd Place */}
            <div className="order-1 flex justify-center w-1/3">
                {top3[1] ? renderPodiumItem(top3[1], 2) : <div className="w-32" />}
            </div>
            
            {/* 1st Place */}
            <div className="order-2 flex justify-center w-1/3 -mb-4 z-10">
                {top3[0] ? renderPodiumItem(top3[0], 1) : <div className="w-32" />}
            </div>
            
            {/* 3rd Place */}
            <div className="order-3 flex justify-center w-1/3">
                {top3[2] ? renderPodiumItem(top3[2], 3) : <div className="w-32" />}
            </div>
          </div>
        )}

        {/* List Section (Rank 4-10) */}
        {rest.length > 0 && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-slide-in">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4 font-mono w-16 text-center">Rank</th>
                    <th className="p-4 font-mono">Corporation</th>
                    <th className="p-4 font-mono text-right">
                       {sortBy === 'MONEY' && 'Net Worth'}
                       {sortBy === 'REBIRTHS' && 'Rebirths'}
                       {sortBy === 'CLICKS' && 'Manual Clicks'}
                       {sortBy === 'WINS' && 'Casino Wins'}
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                {rest.map((user, index) => {
                    const rank = index + 4;
                    return (
                    <tr key={user.username} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="p-4 font-mono text-slate-500 font-bold text-center group-hover:text-white transition-colors">#{rank}</td>
                        <td className="p-4">
                        <div className="font-bold text-white">{user.gameState.companyName}</div>
                        <div className="text-xs text-slate-500">CEO: {user.username}</div>
                        </td>
                        <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-300 font-mono">
                            {getMetricIcon()}
                            {getMetricValue(user)}
                        </div>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        )}

        {users.length === 0 && (
           <div className="text-center text-slate-500 py-20">
             No corporations found in the registry.
           </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;