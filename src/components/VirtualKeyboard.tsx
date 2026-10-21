import React from 'react';

interface VirtualKeyboardProps {
  targetKey: string;
  onKeyPress: (key: string) => void;
  lastWrongKey: string | null;
  lastCorrectKey: string | null;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetKey,
  onKeyPress,
  lastWrongKey,
  lastCorrectKey,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-2.5 bg-white/85 backdrop-blur-md rounded-2xl shadow-md border border-sky-100 flex flex-col gap-1.5 shrink-0">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center gap-1 sm:gap-1.5 ${
            rowIndex === 1 ? 'px-2 sm:px-4' : rowIndex === 2 ? 'px-4 sm:px-8' : ''
          }`}
        >
          {row.map((key) => {
            const isTarget = key === targetKey.toUpperCase();
            const isWrong = lastWrongKey === key;
            const isCorrect = lastCorrectKey === key;

            let keyStyle = 'bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs hover:bg-sky-50 active:translate-y-0.5';

            if (isTarget) {
              // Glowing soft warm yellow/amber highlight
              keyStyle = 'bg-amber-300 text-amber-950 border-amber-400 ring-3 ring-amber-200/90 shadow-sm font-extrabold scale-105 animate-pulse';
            } else if (isCorrect) {
              keyStyle = 'bg-emerald-300 text-emerald-950 border-emerald-400 ring-2 ring-emerald-200 font-bold';
            } else if (isWrong) {
              keyStyle = 'bg-rose-200 text-rose-900 border-rose-300 animate-bounce';
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                className={`flex-1 max-w-[48px] h-9 sm:h-11 rounded-xl flex flex-col items-center justify-center font-bold text-base sm:text-lg border-b-2 sm:border-b-3 transition-all duration-150 select-none cursor-pointer ${keyStyle}`}
                aria-label={`Phím ${key}`}
              >
                <span>{key}</span>
                {isTarget && (
                  <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Spacebar Row */}
      <div className="flex justify-center px-6 sm:px-16">
        <button
          type="button"
          onClick={() => onKeyPress('SPACE')}
          className={`w-full max-w-xs h-8 sm:h-9 rounded-xl font-extrabold text-xs sm:text-sm border-b-2 transition-all duration-150 select-none cursor-pointer flex items-center justify-center gap-2 ${
            targetKey === 'SPACE'
              ? 'bg-purple-500 text-white border-purple-700 ring-4 ring-purple-200 animate-pulse scale-105 shadow-md'
              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-sky-50'
          }`}
          aria-label="Phím Cách Space"
        >
          <span>␣ PHÍM CÁCH (SPACE)</span>
          {targetKey === 'SPACE' && <span className="text-base animate-bounce">👾</span>}
        </button>
      </div>

      <div className="text-center text-[11px] sm:text-xs text-sky-700/80 font-medium">
        💡 Bé gõ phím máy tính hoặc chạm vào phím màu vàng nhé!
      </div>
    </div>
  );
};
