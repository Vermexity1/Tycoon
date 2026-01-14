import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { formatNumber } from '../utils';
import { Dices, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface CasinoPanelProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
}

type CardSuit = '♠' | '♥' | '♦' | '♣';
type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
  suit: CardSuit;
  value: CardValue;
  isHidden?: boolean;
}

const SUITS: CardSuit[] = ['♠', '♥', '♦', '♣'];
const VALUES: CardValue[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const CasinoPanel: React.FC<CasinoPanelProps> = ({ gameState, onUpdateState }) => {
  const [betAmount, setBetAmount] = useState<string>('0');
  const [isPlaying, setIsPlaying] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameResult, setGameResult] = useState<'NONE' | 'WIN' | 'LOSE' | 'PUSH' | 'BLACKJACK'>('NONE');
  const [currentBet, setCurrentBet] = useState(0);

  // Deck generation and shuffling
  const createDeck = () => {
    const newDeck: Card[] = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        newDeck.push({ suit, value });
      });
    });
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (card: Card): number => {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
      if (!card.isHidden) {
        value += getCardValue(card);
        if (card.value === 'A') aces += 1;
      }
    });
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    return value;
  };

  const startGame = () => {
    const bet = parseFloat(betAmount.replace(/,/g, ''));
    if (isNaN(bet) || bet <= 0) return;
    if (bet > gameState.money) {
      // Auto max bet if input is too high
      setCurrentBet(gameState.money);
    } else {
      setCurrentBet(bet);
    }
    
    // Deduct money immediately
    const actualBet = bet > gameState.money ? gameState.money : bet;
    onUpdateState({ ...gameState, money: gameState.money - actualBet });
    setCurrentBet(actualBet);

    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, { ...newDeck.pop()!, isHidden: true }];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setIsPlaying(true);
    setGameResult('NONE');
  };

  // Check for immediate Blackjack
  useEffect(() => {
    if (isPlaying && playerHand.length === 2 && dealerHand.length === 2) {
      const pScore = calculateHandValue(playerHand);
      if (pScore === 21) {
        // Player Blackjack
        // Check dealer
        const dScore = calculateHandValue([dealerHand[0], { ...dealerHand[1], isHidden: false }]);
        if (dScore === 21) {
            endGame('PUSH');
        } else {
            endGame('BLACKJACK');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, playerHand]);

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeck(newDeck);

    if (calculateHandValue(newHand) > 21) {
      endGame('LOSE');
    }
  };

  const stand = async () => {
    // Reveal dealer card
    let currentDealerHand: Card[] = dealerHand.map(c => ({ ...c, isHidden: false }));
    setDealerHand(currentDealerHand);
    
    let dScore = calculateHandValue(currentDealerHand);
    let currentDeck = [...deck];

    // Dealer hits until 17
    while (dScore < 17) {
      // Small delay for visual effect could be added here with async/await
      await new Promise(r => setTimeout(r, 400));
      const card = currentDeck.pop()!;
      currentDealerHand = [...currentDealerHand, card];
      setDealerHand(currentDealerHand);
      dScore = calculateHandValue(currentDealerHand);
    }
    setDeck(currentDeck);

    const pScore = calculateHandValue(playerHand);

    if (dScore > 21) {
      endGame('WIN');
    } else if (dScore > pScore) {
      endGame('LOSE');
    } else if (dScore < pScore) {
      endGame('WIN');
    } else {
      endGame('PUSH');
    }
  };

  const endGame = (result: 'WIN' | 'LOSE' | 'PUSH' | 'BLACKJACK') => {
    setIsPlaying(false);
    setGameResult(result);
    
    // Reveal dealer cards if not already
    setDealerHand(prev => prev.map(c => ({ ...c, isHidden: false })));

    let payout = 0;
    let newWins = gameState.blackjackWins || 0;

    if (result === 'WIN') {
      payout = currentBet * 2;
      newWins++;
    } else if (result === 'BLACKJACK') {
      payout = currentBet * 2.5; // 1.5x payout + original bet returned
      newWins++;
    } else if (result === 'PUSH') {
      payout = currentBet;
    }

    if (payout > 0 || newWins !== gameState.blackjackWins) {
      onUpdateState({ 
        ...gameState, 
        money: gameState.money + payout, // Remember we deducted bet at start, so payout includes returning bet
        totalLifetimeMoney: gameState.totalLifetimeMoney + (payout > currentBet ? (payout - currentBet) : 0), // Only add profit to lifetime
        blackjackWins: newWins
      });
    }
  };

  const CardView: React.FC<{ card: Card }> = ({ card }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    if (card.isHidden) {
      return (
        <div className="w-16 h-24 md:w-24 md:h-36 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
          <div className="w-12 h-20 md:w-20 md:h-32 border border-slate-700/50 rounded flex items-center justify-center">
            <Dices className="text-slate-600" />
          </div>
        </div>
      );
    }
    return (
      <div className={`w-16 h-24 md:w-24 md:h-36 bg-slate-100 rounded-lg border-2 border-slate-300 flex flex-col items-center justify-between p-2 shadow-lg ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
        <div className="self-start font-bold font-mono text-sm md:text-xl">{card.value}</div>
        <div className="text-2xl md:text-4xl">{card.suit}</div>
        <div className="self-end font-bold font-mono text-sm md:text-xl rotate-180">{card.value}</div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-12 overflow-y-auto custom-scrollbar relative flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
            <Dices size={40} className="text-purple-400" /> 
            NEON CASINO
        </h1>
        <p className="text-slate-500 mb-8 font-mono">High Stakes Blackjack</p>

        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           {/* Table Felt Texture */}
           <div className="absolute inset-0 bg-green-900/20 pointer-events-none mix-blend-overlay"></div>
           
           {/* Dealer Area */}
           <div className="flex flex-col items-center mb-10 relative z-10 min-h-[160px]">
              <div className="text-slate-400 text-xs font-mono mb-2 uppercase tracking-widest">Dealer</div>
              <div className="flex gap-2 justify-center">
                 {dealerHand.map((card, i) => <CardView key={i} card={card} />)}
              </div>
              {!dealerHand.some(c => c.isHidden) && dealerHand.length > 0 && (
                 <div className="mt-2 text-white font-mono font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700">
                    {calculateHandValue(dealerHand)}
                 </div>
              )}
           </div>

           {/* Result Overlay */}
           {gameResult !== 'NONE' && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-float-up pointer-events-none">
                 <div className={`text-5xl md:text-7xl font-black uppercase text-shadow-lg transform -rotate-6
                    ${gameResult === 'WIN' || gameResult === 'BLACKJACK' ? 'text-green-400' : gameResult === 'LOSE' ? 'text-red-500' : 'text-yellow-400'}
                 `}>
                    {gameResult}
                 </div>
                 {gameResult === 'BLACKJACK' && <div className="text-center text-green-300 font-mono font-bold">PAYOUT 2.5x</div>}
             </div>
           )}

           {/* Player Area */}
           <div className="flex flex-col items-center mb-8 relative z-10 min-h-[160px]">
              <div className="text-slate-400 text-xs font-mono mb-2 uppercase tracking-widest">You</div>
              <div className="flex gap-2 justify-center">
                 {playerHand.map((card, i) => <CardView key={i} card={card} />)}
              </div>
              {playerHand.length > 0 && (
                 <div className="mt-2 text-white font-mono font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700">
                    {calculateHandValue(playerHand)}
                 </div>
              )}
           </div>
        </div>

        {/* Controls */}
        <div className="mt-8 w-full max-w-lg">
           {!isPlaying ? (
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-4">
                 <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Balance: <span className="text-green-400">${formatNumber(gameState.money)}</span></span>
                    <button onClick={() => setBetAmount(Math.floor(gameState.money).toString())} className="text-xs text-blue-400 hover:text-blue-300 underline">Max</button>
                 </div>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input 
                            type="number" 
                            value={betAmount} 
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white font-mono focus:border-purple-500 focus:outline-none"
                            placeholder="Bet Amount"
                        />
                    </div>
                    <button 
                        onClick={startGame}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                    >
                        DEAL
                    </button>
                 </div>
                 {gameResult === 'LOSE' && <p className="text-center text-red-400 text-sm flex items-center justify-center gap-2"><XCircle size={14}/> House Wins</p>}
                 {gameResult === 'WIN' && <p className="text-center text-green-400 text-sm flex items-center justify-center gap-2"><CheckCircle2 size={14}/> You Won ${formatNumber(currentBet * 2)}</p>}
                 {gameResult === 'BLACKJACK' && <p className="text-center text-green-400 text-sm flex items-center justify-center gap-2"><CheckCircle2 size={14}/> Blackjack! You Won ${formatNumber(currentBet * 2.5)}</p>}
                 {gameResult === 'PUSH' && <p className="text-center text-yellow-400 text-sm flex items-center justify-center gap-2"><AlertCircle size={14}/> Push - Money Returned</p>}
              </div>
           ) : (
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={hit}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl border border-blue-500 shadow-lg transition-all"
                 >
                    HIT
                 </button>
                 <button 
                    onClick={stand}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl border border-red-500 shadow-lg transition-all"
                 >
                    STAND
                 </button>
                 <div className="col-span-2 text-center text-slate-500 text-sm font-mono mt-2">
                    Current Bet: ${formatNumber(currentBet)}
                 </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default CasinoPanel;