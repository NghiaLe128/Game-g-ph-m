import React from 'react';
import { Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  playerName: string;
  onEditName: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onHomeClick?: () => void;
  showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  playerName,
  onEditName,
  isMuted,
  onToggleMute,
  onHomeClick,
  showHomeButton,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 shrink-0">
      {/* Zone 1: Brand Wordmark */}
      <div
        onClick={onHomeClick}
        className={`flex items-center gap-1.5 select-none ${onHomeClick ? 'cursor-pointer' : ''}`}
      >
        <span className="text-xl sm:text-2xl">🐱</span>
        <span className="text-lg sm:text-xl font-black tracking-tight text-sky-900 whitespace-nowrap">
          BÉ VUI GÕ PHÍM
        </span>
      </div>

      {/* Zone 2: Player nickname preview & quick change */}
      {playerName && playerName !== 'Bé Yêu' && (
        <div className="hidden sm:flex items-center gap-2 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-sky-100 shadow-xs">
          <User className="w-4 h-4 text-sky-500" />
          <span className="text-xs text-slate-500 font-medium">Bé yêu:</span>
          <button
            type="button"
            onClick={onEditName}
            className="text-sm font-bold text-sky-800 hover:text-sky-950 underline decoration-sky-300 underline-offset-2 cursor-pointer whitespace-nowrap"
            title="Bấm để đổi tên"
          >
            {playerName}
          </button>
        </div>
      )}

      {/* Zone 3: Audio Toggle & Quick Nav */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-white text-sky-700 border-sky-200 shadow-xs hover:bg-sky-50'
          }`}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {showHomeButton && onHomeClick && (
          <button
            type="button"
            onClick={onHomeClick}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold text-sky-800 bg-white/90 hover:bg-white rounded-2xl border border-sky-200 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            🏠 Về Menu
          </button>
        )}
      </div>
    </header>
  );
};
