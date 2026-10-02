import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Trophy,
  Clock,
  RotateCcw,
  FileCode,
  CheckCircle2,
  XCircle,
  Download,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';
import { QUESTIONS_POOL, FORMULA_SUMMARY, Question } from './data/questions';
import { sounds } from './utils/audio';
import { generateSingleHtmlSource } from './utils/singleHtmlExport';
import { MathView, RichMathText } from './components/MathView';

type MoleType = 'knowledge' | 'gold' | 'bomb';

interface ActiveMole {
  holeIndex: number;
  type: MoleType;
  id: number;
}

export default function App() {
  // Game states
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'QUESTION' | 'GAME_OVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Active mole
  const [activeMole, setActiveMole] = useState<ActiveMole | null>(null);
  const [whackedHole, setWhackedHole] = useState<number | null>(null);

  // Bomb alert toast & screen shake
  const [bombHitAlert, setBombHitAlert] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Question modal state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionCategory, setQuestionCategory] = useState<'knowledge' | 'gold'>('knowledge');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Single HTML Modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [singleHtmlCode, setSingleHtmlCode] = useState('');

  // Formula cheatsheet modal / drawer
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Question deck
  const questionDeckRef = useRef<Question[]>([]);
  const moleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleSpawnIdRef = useRef(0);

  // Keep sound mute state synced
  const toggleMute = () => {
    sounds.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Shuffle question pool
  const shuffleDeck = () => {
    questionDeckRef.current = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  };

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setActiveMole(null);
    setWhackedHole(null);
    setBombHitAlert(false);
    shuffleDeck();
    setGameState('PLAYING');
    sounds.playPop();
  };

  // 1-second Countdown timer loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      countdownTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [gameState]);

  // When timeLeft reaches 0 -> GAME_OVER
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'PLAYING') {
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      setActiveMole(null);
      setGameState('GAME_OVER');
      sounds.playVictory();
    }
  }, [timeLeft, gameState]);

  // Spawn Next Mole logic
  const spawnMole = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // Pick random hole 0..8 different from current
    let hole = Math.floor(Math.random() * 9);
    if (activeMole && hole === activeMole.holeIndex) {
      hole = (hole + 1) % 9;
    }

    // Determine type: 60% knowledge, 20% gold, 20% bomb
    const rand = Math.random();
    let type: MoleType = 'knowledge';
    if (rand < 0.60) {
      type = 'knowledge';
    } else if (rand < 0.80) {
      type = 'gold';
    } else {
      type = 'bomb';
    }

    const spawnId = ++moleSpawnIdRef.current;
    setActiveMole({ holeIndex: hole, type, id: spawnId });
    setWhackedHole(null);
    sounds.playPop();

    // Mole stays up for 1.3s to 2.0s
    const stayTime = Math.floor(Math.random() * 700) + 1300;

    moleTimerRef.current = setTimeout(() => {
      setActiveMole((curr) => {
        if (curr && curr.id === spawnId) {
          // Delay slightly before next spawn
          const delayNext = Math.floor(Math.random() * 400) + 400;
          moleTimerRef.current = setTimeout(spawnMole, delayNext);
          return null;
        }
        return curr;
      });
    }, stayTime);
  }, [gameState, activeMole]);

  // Trigger mole spawn when entering PLAYING state
  useEffect(() => {
    if (gameState === 'PLAYING' && !activeMole) {
      const timer = setTimeout(spawnMole, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState, activeMole, spawnMole]);

  // Whack mole handler
  const handleWhackMole = (index: number) => {
    if (gameState !== 'PLAYING' || !activeMole || activeMole.holeIndex !== index) return;

    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    const moleType = activeMole.type;
    setWhackedHole(index);
    setActiveMole(null);

    if (moleType === 'bomb') {
      // Hit a bomb!
      sounds.playBomb();
      setIsShaking(true);
      setBombHitAlert(true);
      setScore((prev) => Math.max(0, prev - 10));
      setWrongCount((prev) => prev + 1);
      setStreak(0);

      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setBombHitAlert(false), 1600);

      // Continue game after delay
      moleTimerRef.current = setTimeout(spawnMole, 900);
    } else {
      // Knowledge or Gold mole -> Trigger Question Modal (PAUSE countdown)
      sounds.playHit();
      setGameState('QUESTION');
      setQuestionCategory(moleType);

      // Select next question
      let nextQ = questionDeckRef.current.find((q) => q.category === moleType);
      if (!nextQ) {
        shuffleDeck();
        nextQ = questionDeckRef.current.find((q) => q.category === moleType) || questionDeckRef.current[0];
      }
      // Remove used question from deck
      questionDeckRef.current = questionDeckRef.current.filter((q) => q.id !== nextQ!.id);

      setCurrentQuestion(nextQ);
      setSelectedOption(null);
      setHasAnswered(false);
      setIsAnswerCorrect(false);
    }
  };

  // Submit Answer
  const handleOptionSelect = (optionIdx: number) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      sounds.playCorrect();
      setScore((prev) => prev + currentQuestion.points);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      sounds.playWrong();
      setWrongCount((prev) => prev + 1);
      setStreak(0);
    }
  };

  // Resume game after modal
  const handleContinuePlaying = () => {
    setGameState('PLAYING');
    setCurrentQuestion(null);
    setSelectedOption(null);
    setHasAnswered(false);
    moleTimerRef.current = setTimeout(spawnMole, 500);
  };

  // Open Single HTML Modal
  const handleOpenCodeModal = () => {
    const code = generateSingleHtmlSource();
    setSingleHtmlCode(code);
    setShowCodeModal(true);
  };

  // Copy Single HTML Code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(singleHtmlCode);
      setHasCopiedCode(true);
      setTimeout(() => setHasCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  // Download Single HTML File
  const handleDownloadHtml = () => {
    const code = singleHtmlCode || generateSingleHtmlSource();
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dap-chuot-on-tap-luong-giac-toan-11.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut listener for options (1,2,3,4 or A,B,C,D, or Enter/Space to continue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'QUESTION') {
        if (!hasAnswered) {
          const key = e.key.toLowerCase();
          if (key === '1' || key === 'a') handleOptionSelect(0);
          if (key === '2' || key === 'b') handleOptionSelect(1);
          if (key === '3' || key === 'c') handleOptionSelect(2);
          if (key === '4' || key === 'd') handleOptionSelect(3);
        } else if (hasAnswered && (e.key === 'Enter' || e.key === ' ')) {
          handleContinuePlaying();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hasAnswered, currentQuestion]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-amber-50 via-amber-100/50 to-orange-50 text-slate-800 flex flex-col items-center p-3 sm:p-6 select-none ${isShaking ? 'animate-shake' : ''}`}>
      {/* Top Navigation & App Title */}
      <header className="w-full max-w-4xl bg-white/90 backdrop-blur-md border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-lg shadow-amber-900/5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/30 text-2xl flex-shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <span>Toán 11 · Bài: Công thức lượng giác</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">Kết nối tri thức</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Đập Chuột Ôn Tập Công Thức Lượng Giác
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCheatSheet(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs sm:text-sm border border-blue-200 transition-colors shadow-sm cursor-pointer"
            title="Xem bảng công thức"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Bảng công thức</span>
          </button>

          <button
            onClick={handleOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs sm:text-sm border border-emerald-200 transition-colors shadow-sm cursor-pointer"
            title="Tải hoặc xem mã nguồn 1 File HTML hoàn chỉnh"
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Xuất 1 File HTML</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-sm"
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-4">
        {/* Score & Time Dashboard */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Time Countdown */}
          <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${timeLeft <= 15 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Thời gian</div>
              <div className={`text-2xl font-black font-mono leading-none ${timeLeft <= 15 ? 'text-red-600' : 'text-slate-800'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Current Score */}
          <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Điểm số</div>
              <div className="text-2xl font-black font-mono text-amber-600 leading-none">
                {score}
              </div>
            </div>
          </div>

          {/* Correct Count */}
          <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Câu Đúng</div>
              <div className="text-2xl font-black font-mono text-emerald-600 leading-none">
                {correctCount}
              </div>
            </div>
          </div>

          {/* Incorrect / Bomb count */}
          <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sai / Bom</div>
              <div className="text-2xl font-black font-mono text-rose-600 leading-none">
                {wrongCount}
              </div>
            </div>
          </div>
        </div>

        {/* Legend / Guide Bar */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 bg-white/70 border border-amber-200/80 rounded-2xl py-2 px-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm"></span>
            <span><strong>Chuột Thường:</strong> Nhận biết (+10đ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm"></span>
            <span><strong>Chuột Vàng:</strong> Vận dụng (+20đ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm"></span>
            <span><strong>Chuột Bom:</strong> Trừ điểm (-10đ)</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-amber-700 font-extrabold animate-bounce">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Chuỗi đúng {streak} câu!</span>
            </div>
          )}
        </div>

        {/* 3x3 Whack-a-Mole Arena */}
        <div className="relative w-full aspect-square max-w-[580px] bg-gradient-to-b from-green-700 via-green-800 to-emerald-950 p-4 sm:p-6 rounded-[36px] shadow-2xl border-8 border-green-600/60 flex items-center justify-center overflow-hidden">
          {/* Grass decoration background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a7f3d0_2px,transparent_2px)] [background-size:24px_24px]"></div>

          {/* Bomb alert toast */}
          {bombHitAlert && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white px-5 py-2.5 rounded-full font-black text-sm sm:text-base shadow-xl flex items-center gap-2 animate-bounce border-2 border-yellow-300">
              <span>💥 TRÚNG BOM! BỊ TRỪ 10 ĐIỂM!</span>
            </div>
          )}

          {/* 3x3 Grid */}
          <div className="w-full h-full grid grid-cols-3 gap-3 sm:gap-5 z-10">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isCurrentActive = activeMole?.holeIndex === idx;
              const isWhacked = whackedHole === idx;
              const moleType = isCurrentActive ? activeMole.type : null;

              return (
                <div
                  key={idx}
                  onClick={() => handleWhackMole(idx)}
                  className="relative w-full h-full rounded-[40%] bg-emerald-950 shadow-[inset_0_16px_25px_rgba(0,0,0,0.85)] border-b-4 border-green-600 overflow-hidden cursor-pointer active:scale-95 transition-transform flex flex-col justify-end items-center group"
                >
                  {/* Dirt rim highlight */}
                  <div className="absolute inset-x-2 top-0 h-4 bg-emerald-900/60 rounded-full blur-[2px]"></div>

                  {/* Mole Actor */}
                  <div
                    className={`absolute bottom-0 w-full h-full flex items-end justify-center transition-all duration-200 ease-out pointer-events-auto ${
                      isCurrentActive
                        ? 'translate-y-0 opacity-100 scale-100'
                        : isWhacked
                        ? 'translate-y-8 scale-75 opacity-0'
                        : 'translate-y-[105%] opacity-0'
                    }`}
                  >
                    {moleType === 'knowledge' && (
                      <div className="w-[82%] h-[82%] relative flex items-center justify-center drop-shadow-xl animate-bounce-short">
                        {/* Scholar Mole SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <ellipse cx="50" cy="65" rx="35" ry="32" fill="#8d5b4c" />
                          <ellipse cx="50" cy="67" rx="24" ry="22" fill="#fde68a" />
                          <circle cx="24" cy="40" r="14" fill="#8d5b4c" />
                          <circle cx="24" cy="40" r="8" fill="#fda4af" />
                          <circle cx="76" cy="40" r="14" fill="#8d5b4c" />
                          <circle cx="76" cy="40" r="8" fill="#fda4af" />
                          {/* Glasses */}
                          <circle cx="38" cy="56" r="8" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                          <circle cx="62" cy="56" r="8" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                          <line x1="46" y1="56" x2="54" y2="56" stroke="#0f172a" strokeWidth="2.5" />
                          <circle cx="39" cy="56" r="3.5" fill="#0f172a" />
                          <circle cx="63" cy="56" r="3.5" fill="#0f172a" />
                          {/* Nose */}
                          <ellipse cx="50" cy="66" rx="6" ry="4" fill="#1e293b" />
                          {/* Graduation Cap */}
                          <polygon points="50,14 86,25 50,36 14,25" fill="#1e3a8a" />
                          <polygon points="50,36 38,43 62,43" fill="#1d4ed8" />
                          <line x1="76" y1="28" x2="80" y2="42" stroke="#facc15" strokeWidth="2.5" />
                          <circle cx="80" cy="44" r="3" fill="#facc15" />
                        </svg>
                        <div className="absolute -top-1 bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow border border-blue-300">
                          +10đ
                        </div>
                      </div>
                    )}

                    {moleType === 'gold' && (
                      <div className="w-[85%] h-[85%] relative flex items-center justify-center drop-shadow-2xl">
                        {/* Golden Royal Mole SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="55" r="44" fill="#fef08a" opacity="0.35" />
                          <ellipse cx="50" cy="65" rx="35" ry="32" fill="#d97706" />
                          <ellipse cx="50" cy="67" rx="24" ry="22" fill="#fef3c7" />
                          <circle cx="24" cy="40" r="14" fill="#d97706" />
                          <circle cx="24" cy="40" r="8" fill="#fbbf24" />
                          <circle cx="76" cy="40" r="14" fill="#d97706" />
                          <circle cx="76" cy="40" r="8" fill="#fbbf24" />
                          <circle cx="38" cy="56" r="4" fill="#451a03" />
                          <circle cx="39.5" cy="54.5" r="1.5" fill="white" />
                          <circle cx="62" cy="56" r="4" fill="#451a03" />
                          <circle cx="63.5" cy="54.5" r="1.5" fill="white" />
                          <ellipse cx="50" cy="66" rx="6" ry="4" fill="#451a03" />
                          {/* Crown */}
                          <path d="M26,34 L36,16 L50,28 L64,16 L74,34 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
                          <circle cx="36" cy="16" r="3.5" fill="#ef4444" />
                          <circle cx="50" cy="27" r="3.5" fill="#3b82f6" />
                          <circle cx="64" cy="16" r="3.5" fill="#22c55e" />
                        </svg>
                        <div className="absolute -top-1 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow border border-yellow-200 animate-pulse">
                          ⭐ +20đ
                        </div>
                      </div>
                    )}

                    {moleType === 'bomb' && (
                      <div className="w-[82%] h-[82%] relative flex items-center justify-center drop-shadow-xl">
                        {/* Bomb Mole SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <ellipse cx="50" cy="65" rx="35" ry="32" fill="#334155" />
                          <ellipse cx="50" cy="67" rx="22" ry="20" fill="#64748b" />
                          <circle cx="24" cy="40" r="13" fill="#334155" />
                          <circle cx="76" cy="40" r="13" fill="#334155" />
                          {/* Menacing eyes */}
                          <path d="M30,53 L44,57" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                          <path d="M70,53 L56,57" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="38" cy="56" r="3" fill="#dc2626" />
                          <circle cx="62" cy="56" r="3" fill="#dc2626" />
                          <ellipse cx="50" cy="66" rx="5" ry="3" fill="#0f172a" />
                          {/* Bomb */}
                          <circle cx="50" cy="28" r="15" fill="#0f172a" />
                          <rect x="46" y="10" width="8" height="5" fill="#475569" />
                          <path d="M50,10 Q58,3 64,6" fill="none" stroke="#f97316" strokeWidth="2.5" />
                          <circle cx="65" cy="6" r="4" fill="#eab308" />
                          <circle cx="65" cy="6" r="2" fill="#ef4444" />
                        </svg>
                        <div className="absolute -top-1 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow border border-red-300">
                          💣 -10đ
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Idle Start Overlay */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-amber-500/40 mb-3 animate-bounce">
                🔨
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 text-amber-300">
                Sẵn Sàng Ôn Tập Lượng Giác!
              </h2>
              <p className="text-slate-200 text-sm max-w-sm mb-6 leading-relaxed">
                Đập trúng <strong>Chuột Kiến Thức</strong> hoặc <strong>Chuột Vàng</strong> để trả lời câu hỏi trắc nghiệm. Tránh xa <strong>Chuột Bom</strong> nhé!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Bắt đầu chơi ngay (60s)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center text-white overflow-y-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-lg mb-2">
                🏆
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mb-1">
                Hết Giờ! Tổng Kết Lượt Chơi
              </h2>

              {/* Performance Rank */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm font-bold mb-4">
                <Award className="w-4 h-4 text-amber-300" />
                <span>
                  {score >= 80
                    ? 'Đại Kiện Tướng Lượng Giác 👑'
                    : score >= 50
                    ? 'Chuyên Gia Công Thức 🔥'
                    : score >= 20
                    ? 'Học Sinh Chăm Chỉ 📚'
                    : 'Cần Ôn Lại Bài Học 🌱'}
                </span>
              </div>

              {/* Scorecard */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs bg-white/10 rounded-2xl p-3 mb-4 border border-white/10 text-center">
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Tổng Điểm</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">{score}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Số Câu Đúng</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{correctCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-bold">Sai / Bom</div>
                  <div className="text-2xl font-black text-rose-400 font-mono">{wrongCount}</div>
                </div>
              </div>

              {/* Review formulas summary */}
              <div className="w-full max-w-md bg-white/10 rounded-2xl p-3 mb-5 border border-white/10 text-left text-xs leading-relaxed text-slate-200">
                <div className="font-extrabold text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Kiến thức trọng tâm cần nhớ:</span>
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li><strong>Công thức cộng:</strong> sin(a±b) = sin a cos b ± cos a sin b; cos(a±b) = cos a cos b ∓ sin a sin b.</li>
                  <li><strong>Công thức nhân đôi:</strong> sin 2a = 2sin a cos a; cos 2a = 2cos²a - 1 = 1 - 2sin²a.</li>
                  <li><strong>Công thức hạ bậc:</strong> sin²a = (1 - cos 2a)/2; cos²a = (1 + cos 2a)/2.</li>
                  <li><strong>Tích ↔ Tổng:</strong> cos a cos b = ½[cos(a-b) + cos(a+b)].</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại lượt mới</span>
                </button>

                <button
                  onClick={() => setShowCheatSheet(true)}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Xem trọn bộ công thức</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* QUESTION MODAL */}
      {gameState === 'QUESTION' && currentQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border-4 border-amber-300 flex flex-col gap-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                {questionCategory === 'gold' ? (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Chuột Vàng (+20đ · Vận dụng)
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    Chuột Kiến Thức (+10đ)
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-500">{currentQuestion.topic}</span>
            </div>

            {/* Question Text */}
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                <RichMathText text={currentQuestion.question} />
              </h3>
              {currentQuestion.mathFormula && (
                <div className="mt-3 p-3.5 bg-blue-50/80 rounded-2xl border-2 border-blue-200/80 text-blue-900 overflow-x-auto text-center shadow-inner">
                  <MathView math={currentQuestion.mathFormula} displayMode={true} className="text-xl font-bold" />
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="flex flex-col gap-2.5 pt-1">
              {currentQuestion.options.map((opt, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let btnStyle = 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 text-slate-800';
                let prefixStyle = 'bg-slate-200 text-slate-700';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    prefixStyle = 'bg-emerald-500 text-white';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                    prefixStyle = 'bg-rose-500 text-white';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left font-semibold text-base flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${prefixStyle}`}>
                      {letters[idx]}
                    </span>
                    <span className="flex-1 overflow-x-auto py-0.5">
                      <MathView math={opt} displayMode={false} className="text-[17px]" />
                    </span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Feedback */}
            {hasAnswered && (
              <div
                className={`p-4 rounded-2xl border-2 text-sm leading-relaxed animate-fadeIn ${
                  isAnswerCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="font-extrabold text-base mb-1 flex items-center gap-1.5">
                  {isAnswerCorrect ? (
                    <>
                      <span>🎉 Xuất sắc! Bạn đã trả lời hoàn toàn chính xác! (+{currentQuestion.points}đ)</span>
                    </>
                  ) : (
                    <>
                      <span>💡 Chưa chính xác! Hãy cùng xem lời giải chuẩn để nhớ lâu nhé:</span>
                    </>
                  )}
                </div>
                <div className="mt-1 text-slate-800 text-[15px]">
                  <strong>Lời giải:</strong> <RichMathText text={currentQuestion.explanation} />
                </div>
                {currentQuestion.tip && (
                  <p className="mt-1.5 text-amber-800 font-semibold text-xs">
                    👉 <em>Mẹo ghi nhớ: {currentQuestion.tip}</em>
                  </p>
                )}
              </div>
            )}

            {/* Footer action */}
            {hasAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleContinuePlaying}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <span>Tiếp tục đập chuột ➔</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORMULA CHEATSHEET MODAL */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border-2 border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Hệ Thống Công Thức Lượng Giác - Toán 11 (KNTT)
                </h3>
              </div>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {FORMULA_SUMMARY.map((sec, sIdx) => (
                <div key={sIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-3 text-blue-700">
                    {sec.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {sec.items.map((item, iIdx) => (
                      <div key={iIdx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1.5 shadow-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{item.name}</span>
                        <div className="overflow-x-auto py-1">
                          <MathView math={item.latex} displayMode={false} className="text-[15px] font-semibold text-slate-900" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mẹo thơ vui */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <div className="font-black text-sm text-amber-800 mb-1 flex items-center gap-1.5">
                  <span>💡 Bài thơ mẹo nhớ công thức lượng giác:</span>
                </div>
                <p className="italic">
                  "Sin thì sin cos cos sin, dấu cùng một lối chớ quên hỡi người.<br />
                  Cos thì cos cos sin sin, coi chừng đổi dấu kẻo cười uổng công!"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCheatSheet(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE FILE HTML MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border-2 border-emerald-300 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Mã Nguồn Một File HTML Duy Nhất
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chứa toàn bộ HTML, CSS và JavaScript inline, chạy độc lập trên mọi trình duyệt mà không cần cài đặt gì thêm.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {hasCopiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedCode ? 'Đã sao chép!' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={handleDownloadHtml}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải file .html về máy</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="relative bg-slate-900 rounded-2xl p-4 overflow-hidden text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto border border-slate-800">
              <pre className="whitespace-pre-wrap select-text">{singleHtmlCode}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Đầy đủ 10+ câu hỏi, 3 loại chuột, âm thanh tổng hợp Web Audio API.</span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
