import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeNicknameScreen } from './components/WelcomeNicknameScreen';
import { MainMenu } from './components/MainMenu';
import { GamePlay } from './components/GamePlay';
import { ResultScreen } from './components/ResultScreen';
import { TutorialModal } from './components/TutorialModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { NameEditModal } from './components/NameEditModal';
import { ScreenState, GameStats, LeaderboardEntry } from './types/game';
import { sounds } from './utils/audio';

const STORAGE_KEY_HIGHSCORE = 'be_vui_go_phim_high_score';
const STORAGE_KEY_LEADERBOARD = 'be_vui_go_phim_leaderboard';
const STORAGE_KEY_TUTORIAL_SEEN = 'be_vui_go_phim_has_seen_tutorial';

export default function App() {
  // Always start with 'NICKNAME' screen when entering or reloading page
  const [screen, setScreen] = useState<ScreenState>('NICKNAME');
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());

  // Player session starts fresh on every page reload
  const [playerName, setPlayerName] = useState<string>('');
  const [highScore, setHighScore] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  // Modals
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isNameEditOpen, setIsNameEditOpen] = useState(false);

  // Load existing device leaderboard and highscore (session name resets every reload)
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
      if (savedHighScore) setHighScore(Number(savedHighScore) || 0);

      const savedLeaderboard = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
      if (savedLeaderboard) {
        setLeaderboard(JSON.parse(savedLeaderboard));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  // Called when the child submits their nickname on initial entry / reload
  const handleConfirmInitialNickname = (name: string) => {
    setPlayerName(name);
    setScreen('MENU');

    // If child hasn't seen tutorial yet, show it once
    const hasSeenTutorial = localStorage.getItem(STORAGE_KEY_TUTORIAL_SEEN);
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    }
  };

  const handleSaveName = (newName: string) => {
    setPlayerName(newName);
    setIsNameEditOpen(false);
  };

  const handleStartGame = () => {
    setScreen('PLAYING');
  };

  const handleTutorialClose = (startGame = false) => {
    localStorage.setItem(STORAGE_KEY_TUTORIAL_SEEN, 'true');
    setIsTutorialOpen(false);
    if (startGame) {
      handleStartGame();
    }
  };

  const handleGameOver = (stats: GameStats) => {
    setLastStats(stats);

    // Check high score
    let newRecord = false;
    if (stats.score > highScore) {
      setHighScore(stats.score);
      localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(stats.score));
      newRecord = true;
    }

    // Save to device leaderboard
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: playerName || 'Bé Nhỏ',
      score: stats.score,
      accuracy: stats.accuracy,
      correctKeys: stats.correctKeys,
      date: new Date().toLocaleDateString('vi-VN'),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(updatedLeaderboard));

    // Update stats with record flag
    setLastStats({ ...stats, isNewRecord: newRecord });
    setScreen('RESULT');
  };

  const handleGoHome = () => {
    setScreen('MENU');
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-gradient-to-b from-sky-100/90 via-sky-50 to-[#FFFDF0] flex flex-col font-['Nunito',sans-serif] text-slate-800 select-none">
      {/* Top Header */}
      <Header
        playerName={playerName || 'Bé Yêu'}
        onEditName={() => setIsNameEditOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showHomeButton={screen !== 'MENU' && screen !== 'NICKNAME'}
        onHomeClick={handleGoHome}
      />

      {/* Main Content Area: Locked to viewport height without scrolling */}
      <main className="flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-1 overflow-hidden relative">
        {/* Step 1: Prompt for Nickname upon entry or page reload */}
        {screen === 'NICKNAME' && (
          <WelcomeNicknameScreen onConfirmName={handleConfirmInitialNickname} />
        )}

        {/* Step 2: Main Menu */}
        {screen === 'MENU' && (
          <MainMenu
            playerName={playerName}
            highScore={highScore}
            onStartGame={handleStartGame}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onEditName={() => setIsNameEditOpen(true)}
          />
        )}

        {/* Step 3: Game Play */}
        {screen === 'PLAYING' && (
          <GamePlay
            onGameOver={handleGameOver}
            onExitToMenu={handleGoHome}
            currentHighScore={highScore}
          />
        )}

        {/* Step 4: Result */}
        {screen === 'RESULT' && lastStats && (
          <ResultScreen
            stats={lastStats}
            playerName={playerName}
            onPlayAgain={handleStartGame}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Modals */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={handleTutorialClose}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        currentRecord={highScore}
      />

      <NameEditModal
        isOpen={isNameEditOpen}
        currentName={playerName || 'Bé Yêu'}
        onSave={handleSaveName}
        onClose={() => setIsNameEditOpen(false)}
      />
    </div>
  );
}
