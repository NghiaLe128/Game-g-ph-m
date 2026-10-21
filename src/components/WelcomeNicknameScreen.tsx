import React, { useState } from 'react';
import { Sparkles, ArrowRight, Smile } from 'lucide-react';
import { sounds } from '../utils/audio';

const CAT_MASCOT_HAPPY = '/src/assets/images/cat_mascot_happy_1792598738177.jpg';

const QUICK_NAMES = ['Bé Bông', 'Bé Bo', 'Thỏ Con', 'Minh Anh', 'Bắp Non'];

interface WelcomeNicknameScreenProps {
  onConfirmName: (name: string) => void;
}

export const WelcomeNicknameScreen: React.FC<WelcomeNicknameScreenProps> = ({
  onConfirmName,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim().slice(0, 16) || 'Bé Yêu';
    sounds.playClick();
    onConfirmName(finalName);
  };

  const handleSelectQuickName = (selected: string) => {
    sounds.playClick();
    setName(selected);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-md mx-auto w-full text-center overflow-hidden">
      {/* Greeting Tag */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-sm sm:text-base font-extrabold mb-2 shadow-xs shrink-0">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Xin chào bạn nhỏ!</span>
      </div>

      {/* Mascot in circle */}
      <div className="relative mb-2 shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-amber-200 via-sky-200 to-yellow-200 shadow-lg border-4 border-white mx-auto flex items-center justify-center">
          <img
            src={CAT_MASCOT_HAPPY}
            alt="Mèo con chào bạn"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow-md animate-bounce">
          🐾
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight mb-1 shrink-0">
        Bé tên là gì nào?
      </h1>
      <p className="text-slate-600 font-semibold text-xs sm:text-sm mb-3 shrink-0">
        Hãy nhập tên để mèo con lưu bảng vàng cho bé nhé!
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bé vào đây..."
            maxLength={14}
            autoFocus
            className="w-full text-center text-lg sm:text-xl font-black px-4 py-3 rounded-2xl border-3 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/60 outline-hidden bg-white shadow-inner text-sky-950 placeholder:text-slate-400 placeholder:font-bold placeholder:text-sm sm:placeholder:text-base"
          />
        </div>

        {/* Quick Suggestion Chips for 1st graders */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            <span>Hoặc bé chọn nhanh tên dưới đây:</span>
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {QUICK_NAMES.map((qName) => (
              <button
                key={qName}
                type="button"
                onClick={() => handleSelectQuickName(qName)}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  name === qName
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                }`}
              >
                {qName}
              </button>
            ))}
          </div>
        </div>

        {/* Big Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-xl rounded-2xl shadow-lg shadow-amber-200/50 active:scale-98 transition-all cursor-pointer border-b-4 border-amber-500 flex items-center justify-center gap-2"
        >
          <span>VÀO CHƠI THÔI</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
