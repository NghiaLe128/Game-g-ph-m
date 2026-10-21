import React from 'react';
import { Trophy, Medal, X, Sparkles, Smartphone } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { sounds } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentRecord: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentRecord,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl" title="Hạng 1">🥇</span>;
    if (rank === 2) return <span className="text-2xl" title="Hạng 2">🥈</span>;
    if (rank === 3) return <span className="text-2xl" title="Hạng 3">🥉</span>;
    return (
      <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-sm flex items-center justify-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-sky-200 flex flex-col max-h-[94vh]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3 shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-2xl text-amber-600 mb-1 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sky-950">
            🏆 BẢNG XẾP HẠNG
          </h2>
          {currentRecord > 0 && (
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-0.5">
              ⭐ Kỷ lục cao nhất của bé: <span className="text-amber-800 font-black">{currentRecord}</span> điểm
            </p>
          )}
        </div>

        {/* Leaderboard content */}
        <div className="flex-1 overflow-y-auto px-1 space-y-2.5 my-2">
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4 bg-sky-50/60 rounded-2xl border border-sky-100">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-pulse" />
              <p className="text-lg font-bold text-sky-900 mb-1">
                Chưa có điểm nào được lưu!
              </p>
              <p className="text-sky-700 font-medium text-sm">
                Bé hãy nhấn <span className="font-bold text-amber-700">START GAME</span> để là người đầu tiên lên bảng vàng nhé! 🌟
              </p>
            </div>
          ) : (
            <div className="divide-y divide-sky-100 bg-sky-50/40 rounded-2xl border border-sky-100 p-2">
              <div className="grid grid-cols-12 text-xs font-bold text-slate-500 px-3 py-2 uppercase">
                <span className="col-span-2 text-center">Hạng</span>
                <span className="col-span-5">Tên bé</span>
                <span className="col-span-3 text-right">Điểm</span>
                <span className="col-span-2 text-right">Đúng</span>
              </div>
              {entries.slice(0, 10).map((entry, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <div
                    key={entry.id || index}
                    className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-xl transition-colors ${
                      isTop3 ? 'bg-amber-50/80 font-bold' : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="col-span-2 flex justify-center items-center">
                      {getRankBadge(rank)}
                    </div>
                    <div className="col-span-5 font-bold text-slate-800 truncate pr-2">
                      {entry.name || 'Bé Nhỏ'}
                    </div>
                    <div className="col-span-3 text-right font-black text-amber-700 text-base">
                      {entry.score}
                    </div>
                    <div className="col-span-2 text-right text-xs font-semibold text-emerald-600">
                      {entry.accuracy}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Note on local device persistence as requested */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
          <Smartphone className="w-4 h-4 text-sky-500" />
          <span>Bảng xếp hạng được lưu trên thiết bị này của bé.</span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="w-full mt-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg rounded-2xl shadow-md transition-colors cursor-pointer"
        >
          ĐÓNG
        </button>
      </div>
    </div>
  );
};
