import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Star, Clock, Pause, Play, RotateCcw, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { sounds } from '../utils/audio';
import { HOME_ROW_KEYS, TOP_ROW_KEYS, BOTTOM_ROW_KEYS, GameStats } from '../types/game';

const CUTE_MONSTER_IMG = '/src/assets/images/cute_baby_monster_1792599577763.jpg';

interface GamePlayProps {
  onGameOver: (stats: GameStats) => void;
  onExitToMenu: () => void;
  currentHighScore: number;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  onGameOver,
  onExitToMenu,
  currentHighScore,
}) => {
  // Game metrics
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  // Standard Target Key
  const [targetKey, setTargetKey] = useState('A');
  const [lastFeedback, setLastFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('Hãy tìm phím A và nhấn nhé!');
  const [lastWrongKey, setLastWrongKey] = useState<string | null>(null);
  const [lastCorrectKey, setLastCorrectKey] = useState<string | null>(null);
  
  // Monster Encounter State
  const [isMonsterEvent, setIsMonsterEvent] = useState(false);
  const [monsterHitsLeft, setMonsterHitsLeft] = useState(10);
  const [monsterTimeLeft, setMonsterTimeLeft] = useState(10);
  const [monsterShake, setMonsterShake] = useState(false);
  const [monsterDefeated, setMonsterDefeated] = useState(false);
  const [monsterEscaped, setMonsterEscaped] = useState(false);
  const [keysSinceMonster, setKeysSinceMonster] = useState(0);

  // Star particle animations when typing correctly
  const [starBurst, setStarBurst] = useState<{ id: number; text: string }[]>([]);

  // Sound and state refs for interval cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const monsterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = 30;

  // Pick next letter
  const getNextLetter = useCallback((currentScore: number, exclude: string): string => {
    let pool: string[];
    if (currentScore < 50) {
      pool = HOME_ROW_KEYS;
    } else if (currentScore < 120) {
      pool = [...HOME_ROW_KEYS, ...TOP_ROW_KEYS];
    } else {
      pool = [...HOME_ROW_KEYS, ...TOP_ROW_KEYS, ...BOTTOM_ROW_KEYS];
    }

    const available = pool.filter((k) => k !== exclude);
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex] || 'A';
  }, []);

  // Initialize first key
  useEffect(() => {
    const firstKey = HOME_ROW_KEYS[Math.floor(Math.random() * HOME_ROW_KEYS.length)];
    setTargetKey(firstKey);
    setFeedbackMessage(`Hãy tìm phím ${firstKey} và nhấn nhé!`);
  }, []);

  // Main countdown timer (paused during monster events so child doesn't feel rushed)
  useEffect(() => {
    if (isPaused || isMonsterEvent) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isMonsterEvent]);

  // Monster battle countdown timer
  useEffect(() => {
    if (!isMonsterEvent || isPaused || monsterDefeated || monsterEscaped) {
      if (monsterTimerRef.current) clearInterval(monsterTimerRef.current);
      return;
    }

    monsterTimerRef.current = setInterval(() => {
      setMonsterTimeLeft((prev) => {
        if (prev <= 1) {
          if (monsterTimerRef.current) clearInterval(monsterTimerRef.current);
          setMonsterEscaped(true);
          sounds.playTryAgain();
          setTimeout(() => {
            setIsMonsterEvent(false);
            setMonsterEscaped(false);
            setMonsterHitsLeft(10);
            setMonsterTimeLeft(10);
            setFeedbackMessage(`Quái vật đã chạy mất rồi! Hãy tìm phím ${targetKey} nhé!`);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (monsterTimerRef.current) clearInterval(monsterTimerRef.current);
    };
  }, [isMonsterEvent, isPaused, monsterDefeated, monsterEscaped, targetKey]);

  // Handle game completion when main time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isMonsterEvent) {
      const totalPresses = correctCount + wrongCount;
      const accuracy = totalPresses > 0 ? Math.round((correctCount / totalPresses) * 100) : 0;
      const isNewRecord = score > currentHighScore;

      sounds.playVictory();

      onGameOver({
        score,
        correctKeys: correctCount,
        wrongKeys: wrongCount,
        accuracy,
        highestStreak: maxStreak,
        isNewRecord,
      });
    }
  }, [timeLeft, isMonsterEvent, correctCount, wrongCount, score, maxStreak, currentHighScore, onGameOver]);

  // Trigger Monster Event
  const triggerMonsterEncounter = useCallback(() => {
    setIsMonsterEvent(true);
    setMonsterHitsLeft(10);
    setMonsterTimeLeft(10);
    setMonsterDefeated(false);
    setMonsterEscaped(false);
    setKeysSinceMonster(0);
    sounds.playMonsterAppear();
  }, []);

  // Process hit on monster
  const handleMonsterAttack = useCallback(() => {
    if (!isMonsterEvent || monsterDefeated || monsterEscaped || isPaused) return;

    setMonsterHitsLeft((prev) => {
      const nextHits = prev - 1;
      const currentHitIndex = 10 - nextHits;

      // Play rising cheerful hit sound
      sounds.playMonsterHit(currentHitIndex);

      // Monster shake animation
      setMonsterShake(true);
      setTimeout(() => setMonsterShake(false), 200);

      // Pop hit star
      const starId = Date.now();
      setStarBurst((s) => [...s, { id: starId, text: `BỐP! ${currentHitIndex}/10` }]);
      setTimeout(() => {
        setStarBurst((s) => s.filter((item) => item.id !== starId));
      }, 600);

      if (nextHits <= 0) {
        // Monster Defeated!
        setMonsterDefeated(true);
        sounds.playMonsterDefeated();
        try {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#A855F7', '#FBBF24', '#38BDF8'],
          });
        } catch {
          // safe
        }

        // Reward: +50 bonus points
        setScore((sc) => sc + 50);
        setCorrectCount((c) => c + 10);

        setTimeout(() => {
          setIsMonsterEvent(false);
          setMonsterDefeated(false);
          setMonsterHitsLeft(10);
          setMonsterTimeLeft(10);
          setFeedbackMessage(`🎉 Giỏi quá! Đã đuổi quái vật (+50 điểm)! Giờ tìm phím ${targetKey} nhé!`);
        }, 1500);

        return 0;
      }

      return nextHits;
    });
  }, [isMonsterEvent, monsterDefeated, monsterEscaped, isPaused, targetKey]);

  // Standard key processing logic
  const processKeyInput = useCallback(
    (pressedKey: string) => {
      if (isPaused) return;

      // When Monster event is active, any SPACE key or direct tap attacks the monster!
      if (isMonsterEvent) {
        if (pressedKey.toUpperCase() === 'SPACE' || pressedKey === ' ') {
          handleMonsterAttack();
        }
        return;
      }

      if (timeLeft <= 0) return;

      const upper = pressedKey.toUpperCase();

      if (upper === targetKey) {
        // GÕ ĐÚNG
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }

        // Points: +10 base + streak bonus
        const earnedPoints = 10 + (newStreak >= 3 ? 5 : 0);
        setScore((prev) => prev + earnedPoints);
        setCorrectCount((prev) => prev + 1);

        // Visual & audio feedback
        sounds.playCorrect(newStreak);
        setLastFeedback('CORRECT');
        setLastCorrectKey(upper);
        setLastWrongKey(null);

        // Star burst pop effect
        const starId = Date.now();
        setStarBurst((prev) => [...prev, { id: starId, text: `+${earnedPoints}` }]);
        setTimeout(() => {
          setStarBurst((prev) => prev.filter((s) => s.id !== starId));
        }, 800);

        // Check if monster should appear ("lâu lâu có con quái vật chạy qua")
        // Triggers every 6 correct keys or at score 50/100
        const newKeysCount = keysSinceMonster + 1;
        setKeysSinceMonster(newKeysCount);

        if (newKeysCount >= 6 && timeLeft > 8) {
          triggerMonsterEncounter();
        } else {
          // Pick next key
          const next = getNextLetter(score + earnedPoints, targetKey);
          setTargetKey(next);
          setFeedbackMessage(
            newStreak >= 3 ? `🌟 Tuyệt vời! Hãy nhấn phím ${next} nhé!` : `Hãy tìm phím ${next} và nhấn nhé!`
          );
        }

        setTimeout(() => {
          setLastCorrectKey(null);
        }, 300);
      } else {
        // GÕ SAI: Lời nhắc nhẹ nhàng
        setStreak(0);
        setWrongCount((prev) => prev + 1);
        sounds.playTryAgain();
        setLastFeedback('WRONG');
        setLastWrongKey(upper);
        setFeedbackMessage(`Thử lại nhé! Hãy tìm phím ${targetKey} màu vàng.`);

        setTimeout(() => {
          setLastWrongKey(null);
        }, 500);
      }
    },
    [isPaused, isMonsterEvent, timeLeft, targetKey, streak, maxStreak, score, keysSinceMonster, triggerMonsterEncounter, getNextLetter, handleMonsterAttack]
  );

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        processKeyInput('SPACE');
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }
      if (e.key === 'Escape') {
        setIsPaused((p) => !p);
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        processKeyInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [processKeyInput]);

  const handleRestart = () => {
    sounds.playClick();
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(30);
    setIsPaused(false);
    setIsMonsterEvent(false);
    setMonsterDefeated(false);
    setMonsterEscaped(false);
    setMonsterHitsLeft(10);
    setKeysSinceMonster(0);
    const firstKey = HOME_ROW_KEYS[Math.floor(Math.random() * HOME_ROW_KEYS.length)];
    setTargetKey(firstKey);
    setFeedbackMessage(`Hãy tìm phím ${firstKey} và nhấn nhé!`);
  };

  const togglePause = () => {
    sounds.playClick();
    setIsPaused((p) => !p);
  };

  const progressPercent = Math.max(0, (timeLeft / totalDuration) * 100);

  return (
    <div className="h-full max-h-full flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full px-2 sm:px-4 py-1 overflow-hidden">
      {/* Top HUD: Score, Time & Controls */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-sm border border-sky-100 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Score Badge */}
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
            <span className="text-lg sm:text-xl font-black text-amber-900 tabular-nums">
              {score}
            </span>
            <span className="text-[11px] text-amber-700 font-bold hidden sm:inline">điểm</span>
          </div>

          {/* Time Badge with Clock icon */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
            isMonsterEvent ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-sky-50 border-sky-200'
          }`}>
            <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isMonsterEvent ? 'text-purple-600' : timeLeft <= 5 ? 'text-rose-500 animate-spin' : 'text-sky-600'
            }`} />
            <span className="text-lg sm:text-xl font-black tabular-nums">
              {isMonsterEvent ? `${monsterTimeLeft}s` : timeLeft}
            </span>
            <span className="text-[11px] font-bold">
              {isMonsterEvent ? 'quái vật' : 'giây'}
            </span>
          </div>

          {/* Controls: Pause & Restart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={togglePause}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
              <span className="hidden sm:inline">{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              title="Chơi lại từ đầu"
            >
              <RotateCcw className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Chơi lại</span>
            </button>
          </div>
        </div>

        {/* Small Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isMonsterEvent
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : timeLeft <= 5
                ? 'bg-rose-500'
                : timeLeft <= 10
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-sky-400 to-emerald-400'
            }`}
            style={{ width: `${isMonsterEvent ? (monsterHitsLeft / 10) * 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Focus Zone */}
      <div className="relative my-auto flex flex-col items-center justify-center shrink-0 py-1">
        {/* Floating popups */}
        {starBurst.map((star) => (
          <div
            key={star.id}
            className="absolute -top-6 text-purple-600 font-black text-xl sm:text-2xl animate-bounce pointer-events-none flex items-center gap-1 z-30"
          >
            <span>⭐</span>
            <span>{star.text}</span>
          </div>
        ))}

        {/* MONSTER EVENT VIEW */}
        {isMonsterEvent ? (
          <div className="flex flex-col items-center">
            {/* Monster Alert Banner */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 border border-purple-200 rounded-full text-xs sm:text-sm font-black mb-2 animate-bounce">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <span>👾 ÔI! QUÁI VẬT XUẤT HIỆN! ĐÁNH 10 LẦN!</span>
            </div>

            {/* Cute Monster Character Card with Hit Animation */}
            <div
              onClick={handleMonsterAttack}
              className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-b from-purple-100 to-pink-100 shadow-xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 select-none ${
                monsterDefeated
                  ? 'scale-125 border-amber-400 ring-8 ring-amber-200 rotate-12'
                  : monsterShake
                  ? 'border-purple-500 ring-6 ring-pink-300 scale-95 shake-animation'
                  : 'border-purple-300 hover:scale-105 ring-4 ring-purple-100'
              }`}
              title="Chạm vào quái vật hoặc bấm PHÍM CÁCH liên tiếp!"
            >
              <img
                src={CUTE_MONSTER_IMG}
                alt="Quái vật dễ thương"
                className={`w-20 h-20 sm:w-28 sm:h-28 object-contain transition-transform ${
                  monsterDefeated ? 'animate-spin opacity-50' : ''
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Monster Hits Remaining Badge */}
              <div className="absolute -bottom-2 bg-purple-600 text-white font-black text-xs sm:text-sm px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>Còn {monsterHitsLeft} lần!</span>
              </div>
            </div>

            {/* Monster Instructions & Big Tap Trigger */}
            <div className="mt-3 text-center">
              {monsterDefeated ? (
                <p className="text-base sm:text-xl font-black text-emerald-700 animate-pulse">
                  🎉 BÉ ĐÃ ĐUỔI ĐƯỢC QUÁI VẬT! THƯỞNG +50 ĐIỂM! 🌟
                </p>
              ) : monsterEscaped ? (
                <p className="text-base sm:text-lg font-bold text-slate-600">
                  Quái vật đã chạy mất rồi! Bé tiếp tục luyện nhé!
                </p>
              ) : (
                <>
                  <p className="text-sm sm:text-lg font-black text-purple-900">
                    Bé gõ liên tiếp <span className="text-amber-800 underline decoration-amber-400">PHÍM CÁCH (SPACE)</span> hoặc chạm quái vật!
                  </p>
                  <button
                    type="button"
                    onClick={handleMonsterAttack}
                    className="mt-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                  >
                    <span>🥊 BẤM ĐÂY HOẶC PHÍM SPACE ({10 - monsterHitsLeft}/10)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* STANDARD LETTER DISPLAY */
          <div className="flex flex-col items-center">
            {/* Giant Letter Card */}
            <div
              className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-white shadow-md flex items-center justify-center border-4 transition-all duration-200 select-none ${
                lastFeedback === 'CORRECT'
                  ? 'border-emerald-400 ring-6 ring-emerald-100 scale-105'
                  : lastFeedback === 'WRONG'
                  ? 'border-amber-300 ring-4 ring-amber-100 shake-animation'
                  : 'border-sky-200 hover:border-amber-300'
              }`}
            >
              <span className="text-5xl sm:text-7xl font-black text-sky-950 tracking-wide font-sans">
                {targetKey}
              </span>
              <span className="absolute top-1.5 right-1.5 text-base select-none opacity-60">🐾</span>
            </div>

            {/* Friendly Prompt / Reminder for the child */}
            <div className="mt-2 text-center">
              <p
                className={`text-base sm:text-xl font-black transition-colors ${
                  lastFeedback === 'WRONG'
                    ? 'text-amber-800'
                    : lastFeedback === 'CORRECT'
                    ? 'text-emerald-700'
                    : 'text-sky-900'
                }`}
              >
                {feedbackMessage}
              </p>
              {streak >= 3 && (
                <p className="text-[11px] sm:text-xs font-extrabold text-amber-600 mt-0.5">
                  🔥 Bé đang gõ đúng {streak} phím liên tiếp! Cố lên nhé!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Visual Keyboard */}
      <div className="w-full shrink-0">
        <VirtualKeyboard
          targetKey={isMonsterEvent ? 'SPACE' : targetKey}
          onKeyPress={processKeyInput}
          lastWrongKey={lastWrongKey}
          lastCorrectKey={lastCorrectKey}
        />
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-200">
            <h3 className="text-2xl font-black text-sky-950 mb-3">
              ⏸ TRÒ CHƠI ĐANG DỪNG
            </h3>
            <p className="text-slate-600 text-sm font-semibold mb-6">
              Bé nghỉ ngơi một chút rồi tiếp tục nhé!
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={togglePause}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-amber-950" />
                TIẾP TỤC CHƠI
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-3 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-base rounded-2xl cursor-pointer"
              >
                Chơi lại ván này
              </button>

              <button
                type="button"
                onClick={onExitToMenu}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                Về Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
