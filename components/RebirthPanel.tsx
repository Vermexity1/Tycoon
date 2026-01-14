import React from 'react';
import { RefreshCcw, TrendingUp, AlertTriangle, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';
import { REBIRTH_COST, REBIRTH_SCALING } from '../constants';
import { formatNumber } from '../utils';

interface RebirthPanelProps {
  money: number;
  rebirths: number;
  onRebirth: () => void;
  prestigeMultiplier: number;
}

const RebirthPanel: React.FC<RebirthPanelProps> = ({
  money,
  rebirths,
  onRebirth,
  prestigeMultiplier
}) => {
  const nextRebirthCost = REBIRTH_COST * Math.pow(REBIRTH_SCALING, rebirths);
  const canRebirth = money >= nextRebirthCost;
  const nextMultiplier = prestigeMultiplier + 0.5;
  const percentageGain = ((nextMultiplier - prestigeMultiplier) / prestigeMultiplier) * 100;

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 overflow-y-auto custom-scrollbar relative flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4 animate-pulse">
            <Rocket className="text-purple-400" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Corporate Ascension</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Dissolve your current corporation to restructure at a higher level of efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          {/* Current State */}
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RefreshCcw size={120} />
            </div>
            <h3 className="text-slate-500 font-mono text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <ShieldCheck size={16} /> Current Status
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-slate-400 text-sm mb-1">Current Multiplier</div>
                <div className="text-3xl font-mono text-white">{prestigeMultiplier.toFixed(1)}x</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Rebirth Count</div>
                <div className="text-3xl font-mono text-purple-400">{rebirths}</div>
              </div>
            </div>
          </div>

          {/* Next State */}
          <div className={`border p-8 rounded-2xl relative overflow-hidden transition-all duration-500
            ${canRebirth 
              ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
              : 'bg-slate-900/30 border-slate-800 opacity-70 grayscale'}`}
          >
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            <h3 className="text-purple-400 font-mono text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <Rocket size={16} /> Ascension Preview
            </h3>

            <div className="space-y-6">
              <div>
                <div className="text-slate-400 text-sm mb-1">New Multiplier</div>
                <div className="flex items-center gap-3">
                   <span className="text-3xl font-mono text-white">{nextMultiplier.toFixed(1)}x</span>
                   <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold">
                     +{percentageGain.toFixed(0)}% Boost
                   </span>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Next Rebirth Cost</div>
                <div className={`text-2xl font-mono ${canRebirth ? 'text-green-400' : 'text-red-400'}`}>
                  ${formatNumber(nextRebirthCost)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-lg mx-auto text-center">
          <div className="bg-red-950/30 border border-red-900/30 p-4 rounded-lg mb-6 flex items-start gap-3 text-left">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-red-200/80">
              <span className="font-bold text-red-400">Warning:</span> Rebirthing will reset your Money and Upgrades. 
              You keep your Company Name, Lifetime Earnings, and Manual Click stats.
            </div>
          </div>

          <button
            onClick={onRebirth}
            disabled={!canRebirth}
            className={`w-full py-6 rounded-xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-300
              ${canRebirth 
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:shadow-[0_0_60px_rgba(147,51,234,0.7)] scale-100 hover:scale-105' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
          >
            {canRebirth ? (
              <>
                Ascend Now <ArrowRight size={24} />
              </>
            ) : (
              <>
                Need ${formatNumber(nextRebirthCost)} to Ascend
              </>
            )}
          </button>
          
          {!canRebirth && (
            <p className="mt-4 text-slate-500 text-sm">
              Earn more money to unlock the next level of corporate evolution.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default RebirthPanel;