import React from 'react';
import { Upgrade } from '../types';
import { ArrowUpCircle, Lock, ShoppingCart, AlertOctagon } from 'lucide-react';
import { formatNumber } from '../utils';

interface UpgradesPanelProps {
  money: number;
  upgrades: Upgrade[];
  owned: Record<string, number>;
  buyUpgrade: (id: string) => void;
  prestigeMultiplier: number;
  rebirths: number;
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ 
  money, 
  upgrades, 
  owned, 
  buyUpgrade,
  prestigeMultiplier,
  rebirths
}) => {
  
  const calculateCost = (upgrade: Upgrade) => {
    const count = owned[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-md border-l border-slate-800/50 p-4 w-full md:w-[450px] shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="bg-blue-500/20 p-2 rounded-lg">
          <ShoppingCart className="text-blue-400" size={20} />
        </div>
        <span>Marketplace</span>
        <span className="text-xs ml-auto bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">
          {upgrades.filter(u => !u.requiredRebirths || rebirths >= u.requiredRebirths).length} / {upgrades.length} Unlocked
        </span>
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {upgrades.map((upgrade, index) => {
          const cost = calculateCost(upgrade);
          const count = owned[upgrade.id] || 0;
          const canAfford = money >= cost;
          // Income display accounts for prestige multiplier
          const incomeDisplay = formatNumber(upgrade.baseIncome * prestigeMultiplier);
          const isLocked = upgrade.requiredRebirths && rebirths < upgrade.requiredRebirths;

          // If locked, render a simplified locked state
          if (isLocked) {
             return (
               <div key={upgrade.id} className="w-full flex items-center p-3 rounded-xl border border-slate-800 bg-slate-900/50 opacity-60">
                  <div className="text-2xl mr-4 bg-slate-950 w-14 h-14 flex items-center justify-center rounded-lg border border-slate-800">
                    <Lock size={20} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-slate-500 font-bold text-sm mb-1">Locked Technology</h3>
                     <p className="text-xs text-red-400/80 font-mono flex items-center gap-1">
                        <AlertOctagon size={12} /> Requires {upgrade.requiredRebirths} Rebirths
                     </p>
                  </div>
               </div>
             );
          }

          return (
            <button
              key={upgrade.id}
              onClick={() => buyUpgrade(upgrade.id)}
              disabled={!canAfford}
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              className={`w-full flex items-center p-3 rounded-xl border transition-all duration-300 text-left group relative overflow-hidden animate-slide-in opacity-0
                ${canAfford 
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:bg-slate-750 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-0.5' 
                  : 'bg-slate-900 border-slate-800/50 opacity-50 grayscale hover:grayscale-0 transition-all'}`}
            >
              <div className="text-4xl mr-4 bg-slate-950 w-14 h-14 flex items-center justify-center rounded-lg shadow-inner border border-slate-800 group-hover:scale-110 transition-transform duration-300 shrink-0">
                {upgrade.icon}
              </div>
              
              <div className="flex-1 min-w-0 z-10">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <h3 className={`font-bold truncate text-sm md:text-base ${canAfford ? 'text-white' : 'text-slate-400'}`}>
                    {upgrade.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-1 rounded text-blue-400 border border-slate-800 shrink-0">
                    Lvl {count}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2 truncate pr-2 group-hover:text-slate-300 transition-colors">
                  {upgrade.description}
                </p>
                <div className="flex justify-between items-center bg-slate-950/50 rounded-lg p-1.5 px-2">
                  <span className={`text-sm font-bold font-mono ${canAfford ? 'text-green-400' : 'text-red-400 group-hover:text-red-300'}`}>
                    ${formatNumber(cost)}
                  </span>
                  <span className="text-xs text-blue-300/80 font-mono flex items-center gap-1">
                    <ArrowUpCircle size={10} />
                    +{incomeDisplay}/s
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        
        {/* Simplified footer instead of generic lock block, since we show locked items inline */}
        <div className="text-center text-xs text-slate-600 p-4 font-mono">
           --- END OF CATALOG ---
        </div>
      </div>
    </div>
  );
};

export default UpgradesPanel;