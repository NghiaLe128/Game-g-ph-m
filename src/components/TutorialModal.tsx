import React from 'react';
import { Sparkles, Eye, Search, Award, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: (startGame?: boolean) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    sounds.playClick();
    onClose(true);
  };

  const handleClose = () => {
    sounds.playClick();
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-sky-200 text-center max-h-[96vh] flex flex-col justify-between">
        {/* Close button in top corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header icon and title */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-2xl text-amber-600 mb-2 shadow-inner mx-auto shrink-0">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-sky-900 mb-2 shrink-0">
          🎮 CÁCH CHƠI THẬT DỄ
        </h2>

        {/* Visual instruction steps */}
        <div className="space-y-2 text-left mb-3 shrink-0">
          <div className="flex items-center gap-2.5 p-2 sm:p-2.5 bg-sky-50 rounded-2xl border border-sky-100">
            <span className="shrink-0 w-7 h-7 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-sm">
              1
            </span>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm sm:text-base">
              <Eye className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Nhìn chữ cái to trên màn hình.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 sm:p-2.5 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
              2
            </span>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm sm:text-base">
              <Search className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tìm chữ cái đó trên bàn phím.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 sm:p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
              3
            </span>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm sm:text-base">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Nhấn đúng phím để nhận sao và ghi điểm!</span>
            </div>
          </div>
        </div>

        {/* Cute encouragement note with monster tip */}
        <div className="p-2 bg-yellow-50/90 rounded-xl text-amber-900 text-xs sm:text-[13px] font-bold mb-3 border border-yellow-200 shrink-0">
          👾 <span className="text-purple-700">Bật mí:</span> Khi quái vật xuất hiện, hãy gõ liên tiếp <span className="text-amber-800 underline">PHÍM CÁCH (SPACE)</span> 10 lần để đuổi quái vật và nhận thêm 50 điểm nhé!
        </div>

        {/* Big Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3 px-5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-lg rounded-2xl shadow-md shadow-amber-200/60 active:scale-98 transition-transform cursor-pointer border-b-4 border-amber-500 shrink-0"
        >
          ĐÃ HIỂU! CHƠI THÔI 🚀
        </button>
      </div>
    </div>
  );
};
