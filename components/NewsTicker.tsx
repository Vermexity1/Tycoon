import React from 'react';
import { Radio } from 'lucide-react';

interface NewsTickerProps {
  message: string;
  isPositive: boolean;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ message, isPositive }) => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 h-10 flex items-center overflow-hidden relative">
      <div className="bg-slate-900 h-full px-4 flex items-center gap-2 z-10 border-r border-slate-800">
        <Radio size={16} className={isPositive ? "text-green-500 animate-pulse" : "text-red-500 animate-pulse"} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">NEWS</span>
      </div>
      
      <div className="whitespace-nowrap overflow-hidden flex-1 relative h-full flex items-center">
         <div className="animate-marquee inline-block text-sm font-mono px-4 text-slate-300">
            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
               {message}
            </span>
         </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 15s linear infinite;
          padding-left: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;