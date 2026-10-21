import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Star, CheckCircle2, Target } from 'lucide-react';
import { GameStats } from '../types/game';
import { sounds } from '../utils/audio';

const CAT_MASCOT_STAR = '/src/assets/images/cat_mascot_star_1792598737579.jpg';

interface ResultScreenProps {
  stats: GameStats;
  playerName: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stats,
  playerName,
  onPlayAgain,
  onGoHome,
}) => {
  useEffect(() => {
    // Fire a gentle cheerful confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#38BDF8', '#34D399', '#F472B6'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-1 max-w-md mx-auto w-full text-center overflow-hidden">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-sky-950 tracking-tight mb-1 drop-shadow-xs shrink-0">
        🎉 GIỎI LẮM!
      </h2>

      {/* New Record Banner if achieved */}
      {stats.isNewRecord ? (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black rounded-full text-xs sm:text-sm mb-2 shadow-xs animate-pulse shrink-0">
          <Trophy className="w-4 h-4 fill-amber-950" />
          <span>KỶ LỤC MỚI CỦA BÉ!</span>
        </div>
      ) : (
        <p className="text-sky-700 font-bold text-xs sm:text-sm mb-2 shrink-0">
          Chúc mừng {playerName || 'bé'} đã hoàn thành bài tập!
        </p>
      )}

      {/* Mascot Card */}
      <div className="relative mb-2 shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-amber-200 via-sky-200 to-yellow-200 shadow-md border-4 border-white mx-auto flex items-center justify-center">
          <img
            src={CAT_MASCOT_STAR}
            alt="Mèo con chúc mừng bạn nhỏ"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Big Score Display */}
      <div className="w-full bg-white/95 rounded-2xl p-3 sm:p-4 shadow-md border border-sky-100 mb-3 space-y-2 shrink-0">
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tổng điểm
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
            <span className="text-4xl sm:text-5xl font-black text-amber-900 tabular-nums">
              {stats.score}
            </span>
          </div>
        </div>

        {/* Breakdown row: Keys typed & Accuracy */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2 bg-sky-50 rounded-xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-sky-700 font-bold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Phím gõ đúng</span>
            </div>
            <span className="text-xl font-black text-sky-950 tabular-nums">
              {stats.correctKeys}
            </span>
          </div>

          <div className="p-2 bg-emerald-50 rounded-xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mb-0.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>Độ chính xác</span>
            </div>
            <span className="text-xl font-black text-emerald-950 tabular-nums">
              {stats.accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* 2 Big Action Buttons */}
      <div className="w-full space-y-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onPlayAgain();
          }}
          className="w-full py-3 px-5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-lg sm:text-xl rounded-2xl shadow-md shadow-amber-200/50 active:scale-98 transition-all cursor-pointer border-b-4 border-amber-500 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI LẠI</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className="w-full py-2.5 px-5 bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-base sm:text-lg rounded-2xl shadow-xs border-2 border-sky-200 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4 text-sky-600" />
          <span>VỀ TRANG CHỦ</span>
        </button>
      </div>
    </div>
  );
};
