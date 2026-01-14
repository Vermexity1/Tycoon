import React, { useRef, useState } from 'react';
import { MousePointer2, Zap } from 'lucide-react';
import { formatNumber } from '../utils';

interface ClickerAreaProps {
  money: number;
  clickValue: number;
  incomePerSecond: number;
  onManualClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  companyName: string;
}

const ClickerArea: React.FC<ClickerAreaProps> = ({ 
  money, 
  clickValue, 
  incomePerSecond, 
  onManualClick,
  companyName
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(1);

  const handlePointerDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add a programmatic pop effect
    setScale(0.92);
    setTimeout(() => setScale(1), 100);
    onManualClick(e);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-950 border-r border-slate-800 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl blob opacity-50"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl blob animation-delay-2000 opacity-50"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl blob animation-delay-4000 opacity-50"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="z-10 text-center mb-12 relative w-full px-4">
        <h2 className="text-slate-400 text-sm font-mono tracking-[0.2em] uppercase mb-2 animate-pulse truncate">{companyName}</h2>
        
        <div className="relative inline-block max-w-full">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] break-words">
            ${formatNumber(money)}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-mono font-bold">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm shadow-lg">
            <Zap size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-slate-300">${formatNumber(incomePerSecond)}/sec</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm shadow-lg">
            <MousePointer2 size={16} className="text-blue-400 fill-blue-400" />
            <span className="text-slate-300">${formatNumber(clickValue)}/click</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Glow effect behind button */}
        <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-[40px] animate-pulse"></div>
        
        <button
          ref={buttonRef}
          onMouseDown={handlePointerDown}
          style={{ transform: `scale(${scale})` }}
          className="relative group w-56 h-56 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border-4 border-slate-700 
                     transition-transform duration-75 ease-out
                     shadow-[0_0_30px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.1)] 
                     hover:border-blue-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]
                     btn-glow overflow-hidden z-20 outline-none select-none cursor-pointer"
        >
          {/* Internal Shimmer */}
          <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-blue-100 pointer-events-none">
            <MousePointer2 size={64} className="mb-3 group-hover:text-blue-400 transition-colors drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="font-bold text-xl tracking-widest text-shadow">GENERATE</span>
          </div>
          
          {/* Ripple effect container */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none mix-blend-overlay">
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-radial-gradient from-white to-transparent opacity-0 group-active:opacity-30 group-active:scale-100 scale-50 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          </div>
        </button>
      </div>

      <div className="mt-16 text-center text-slate-500 text-xs max-w-sm opacity-60">
        <p>Market fluctuates rapidly. Spend efficiently to dominate the sector.</p>
      </div>
    </div>
  );
};

export default ClickerArea;