import React from 'react';
import { Play, BookOpen, Trophy, Sparkles, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

// Mascot image generated specifically for this game
const CAT_MASCOT_HAPPY = '/src/assets/images/cat_mascot_happy_1792598738177.jpg';

interface MainMenuProps {
  playerName: string;
  highScore: number;
  onStartGame: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onEditName: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  playerName,
  highScore,
  onStartGame,
  onOpenTutorial,
  onOpenLeaderboard,
  onEditName,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-md mx-auto w-full text-center overflow-hidden">
      {/* Decorative floating clouds & stars */}
      <div className="absolute top-12 left-6 text-sky-200 pointer-events-none select-none opacity-80 hidden lg:block">
        <svg className="w-20 h-10 fill-current" viewBox="0 0 100 60">
          <path d="M20,40 a15,15 0 0,1 25,-10 a20,20 0 0,1 35,5 a15,15 0 0,1 15,15 a15,15 0 0,1 -15,15 l-60,0 a15,15 0 0,1 0,-25 z" />
        </svg>
      </div>
      <div className="absolute top-14 right-8 text-amber-300 pointer-events-none select-none opacity-80 hidden lg:block">
        <Star className="w-8 h-8 fill-amber-300 animate-spin-slow" />
      </div>

      {/* Greeting */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-100/80 text-sky-800 rounded-full text-sm sm:text-base font-bold mb-2 shadow-xs shrink-0">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Xin chào bạn nhỏ {playerName ? `"${playerName}"` : ''}!</span>
      </div>

      {/* Cute Main Mascot in Circle */}
      <div className="relative mb-2 group shrink-0">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-amber-200 via-sky-200 to-yellow-200 shadow-lg border-4 border-white flex items-center justify-center transition-transform duration-300 hover:scale-105">
          <img
            src={CAT_MASCOT_HAPPY}
            alt="Mèo con vui vẻ luyện gõ phím"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Playful Floating Badge */}
        <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow-md animate-bounce">
          🐾
        </span>
      </div>

      {/* Game Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-sky-950 tracking-tight mb-1 drop-shadow-xs shrink-0">
        BÉ VUI GÕ PHÍM
      </h1>
      <p className="text-slate-600 font-semibold text-xs sm:text-sm max-w-xs mx-auto mb-3 shrink-0">
        Học gõ các chữ cái thật nhanh và dễ dàng cùng mèo con!
      </p>

      {/* 3 Main Action Buttons as strictly required */}
      <div className="w-full max-w-sm space-y-2.5 mb-3 shrink-0">
        {/* Primary Big Start Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onStartGame();
          }}
          className="w-full py-3 sm:py-3.5 px-6 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-600 text-amber-950 font-black text-xl sm:text-2xl rounded-2xl shadow-lg shadow-amber-300/40 active:translate-y-1 transition-all cursor-pointer border-b-4 border-amber-600 flex items-center justify-center gap-2.5 group"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-950 group-hover:scale-110 transition-transform" />
          <span>START GAME</span>
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenTutorial();
            }}
            className="py-2.5 px-3 bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-xs border-2 border-sky-200 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>CÁCH CHƠI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="py-2.5 px-3 bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-xs border-2 border-amber-200 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>XẾP HẠNG</span>
          </button>
        </div>
      </div>

      {/* Small Record Line */}
      <div className="text-xs font-bold text-sky-700/80 flex items-center gap-1.5 bg-sky-50/80 px-3.5 py-1 rounded-full border border-sky-100 shrink-0">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
        <span>Kỷ lục cao nhất:</span>
        <span className="text-amber-800 font-black">{highScore} điểm</span>
      </div>
    </div>
  );
};
