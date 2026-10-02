import { QUESTIONS_POOL, FORMULA_SUMMARY } from '../data/questions';

export function generateSingleHtmlSource(): string {
  const jsonQuestions = JSON.stringify(QUESTIONS_POOL, null, 2);
  const jsonFormulas = JSON.stringify(FORMULA_SUMMARY, null, 2);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đập Chuột Ôn Tập Công Thức Lượng Giác - Toán 11 KNTT</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
  <!-- KaTeX for Standard Mathematical Typography -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>

  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --gold: #d97706;
      --gold-light: #fef3c7;
      --danger: #dc2626;
      --success: #16a34a;
      --bg: #fefce8;
      --board-bg: #15803d;
      --hole-border: #166534;
      --hole-depth: #052e16;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      user-select: none;
      -webkit-user-select: none;
    }

    /* Math formula font override for KaTeX */
    .katex {
      font-size: 1.1em;
      text-rendering: optimizeLegibility;
    }
    .katex-display {
      margin: 0.5em 0;
    }

    body {
      background: radial-gradient(circle at 50% 20%, #fef9c3 0%, #fef08a 60%, #fde047 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 16px;
      color: #1e293b;
    }

    /* Custom Hammer Cursor */
    .game-active {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="rotate(-30 24 24)"><rect x="22" y="16" width="6" height="26" rx="3" fill="%23854d0e"/><rect x="14" y="6" width="22" height="14" rx="4" fill="%23475569"/><rect x="12" y="8" width="4" height="10" rx="2" fill="%2394a3b8"/><rect x="34" y="8" width="4" height="10" rx="2" fill="%2394a3b8"/></g></svg>') 12 12, auto !important;
    }
    .game-active:active {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="rotate(-5 24 24)"><rect x="22" y="16" width="6" height="26" rx="3" fill="%23854d0e"/><rect x="14" y="6" width="22" height="14" rx="4" fill="%23e11d48"/><rect x="12" y="8" width="4" height="10" rx="2" fill="%23fb7185"/><rect x="34" y="8" width="4" height="10" rx="2" fill="%23fb7185"/></g></svg>') 20 20, auto !important;
    }

    .container {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    /* Header */
    header {
      text-align: center;
      background: white;
      border: 3px solid #facc15;
      box-shadow: 0 10px 25px -5px rgba(202, 138, 4, 0.2);
      border-radius: 20px;
      padding: 16px 24px;
      width: 100%;
    }

    .badge-sub {
      display: inline-block;
      font-size: 13px;
      font-weight: 700;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
    }

    /* Scoreboard */
    .dashboard {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      width: 100%;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: transform 0.15s ease;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-time.warning {
      color: #dc2626;
      animation: pulse 0.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    /* Legend */
    .legend-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      font-size: 13px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 30px;
      padding: 8px 18px;
      border: 1px solid #e2e8f0;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* Mole Grid */
    .game-arena {
      background: linear-gradient(180deg, #15803d 0%, #166534 100%);
      border: 8px solid #bbf7d0;
      border-radius: 28px;
      padding: 24px;
      width: 100%;
      box-shadow: 0 20px 35px -10px rgba(22, 101, 52, 0.35), inset 0 2px 8px rgba(0,0,0,0.2);
      position: relative;
    }

    .grid-3x3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .hole-wrapper {
      position: relative;
      aspect-ratio: 1 / 0.85;
      background: #052e16;
      border-radius: 50% / 40%;
      overflow: hidden;
      box-shadow: inset 0 16px 20px rgba(0, 0, 0, 0.8);
      border-bottom: 6px solid #16a34a;
    }

    .mole {
      position: absolute;
      bottom: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      transition: bottom 0.22s cubic-bezier(0.18, 0.89, 0.32, 1.28);
      cursor: pointer;
    }

    .mole.up {
      bottom: 0;
    }

    .mole.hit {
      animation: moleWhacked 0.3s forwards;
    }

    @keyframes moleWhacked {
      0% { transform: scale(1); filter: brightness(1.3); }
      50% { transform: scale(0.85) rotate(-15deg); }
      100% { transform: scale(0.6) translateY(40px); opacity: 0; }
    }

    .mole svg {
      width: 85%;
      height: 85%;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
      pointer-events: none;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }

    .modal-overlay.active {
      display: flex;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-card {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 640px;
      max-height: 92vh;
      overflow-y: auto;
      padding: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 3px solid #facc15;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 12px;
    }

    .modal-badge {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-knowledge {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-gold {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde047;
    }

    .question-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
    }

    .math-callout {
      background: #eff6ff;
      border: 2px solid #bfdbfe;
      padding: 14px 16px;
      border-radius: 16px;
      font-size: 19px;
      font-weight: 600;
      color: #1e3a8a;
      text-align: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-btn {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 16px;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.15s ease;
    }

    .option-btn:hover:not(:disabled) {
      background: #eff6ff;
      border-color: #3b82f6;
      transform: translateY(-1px);
    }

    .option-prefix {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      color: #475569;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;
      overflow-x: auto;
      padding: 2px 0;
    }

    .option-btn.correct {
      background: #dcfce7 !important;
      border-color: #22c55e !important;
      color: #15803d !important;
    }
    .option-btn.correct .option-prefix {
      background: #22c55e;
      color: white;
    }

    .option-btn.wrong {
      background: #fee2e2 !important;
      border-color: #ef4444 !important;
      color: #b91c1c !important;
    }
    .option-btn.wrong .option-prefix {
      background: #ef4444;
      color: white;
    }

    .feedback-box {
      border-radius: 14px;
      padding: 14px 16px;
      font-size: 14px;
      line-height: 1.6;
      display: none;
    }

    .feedback-box.correct {
      display: block;
      background: #f0fdf4;
      border: 2px solid #86efac;
      color: #166534;
    }

    .feedback-box.wrong {
      display: block;
      background: #fef2f2;
      border: 2px solid #fca5a5;
      color: #991b1b;
    }

    .btn-action {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 22px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s ease;
    }
    .btn-action:hover {
      background: #1d4ed8;
    }

    .center-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      text-align: center;
      z-index: 20;
    }

    .bomb-alert {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: #dc2626;
      color: white;
      padding: 10px 20px;
      border-radius: 30px;
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
      z-index: 50;
    }

    .bomb-alert.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    @media (max-width: 640px) {
      .dashboard { grid-template-columns: repeat(2, 1fr); }
      h1 { font-size: 20px; }
      .game-arena { padding: 12px; }
      .grid-3x3 { gap: 10px; }
    }
  </style>
</head>
<body class="game-active">

  <div class="container">
    <!-- Header -->
    <header>
      <div class="badge-sub">Toán 11 · Sách Kết nối tri thức với cuộc sống (Chương trình GDPT 2018)</div>
      <h1>Đập Chuột Ôn Tập: CÔNG THỨC LƯỢNG GIÁC</h1>
      <p style="font-size: 14px; color: #64748b; margin-top: 4px;">Chuẩn hóa font công thức toán học (KaTeX LaTeX typesetting)</p>
    </header>

    <!-- Scoreboard -->
    <div class="dashboard">
      <div class="stat-card">
        <span class="stat-label">Thời gian</span>
        <span class="stat-value stat-time" id="val-time">60s</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Điểm số</span>
        <span class="stat-value" id="val-score" style="color: #2563eb;">0</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Câu Đúng</span>
        <span class="stat-value" id="val-correct" style="color: #16a34a;">0</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Sai / Bom</span>
        <span class="stat-value" id="val-wrong" style="color: #dc2626;">0</span>
      </div>
    </div>

    <!-- Legend bar -->
    <div class="legend-bar">
      <div class="legend-item">
        <div class="legend-dot" style="background: #3b82f6;"></div>
        <span>Chuột Kiến Thức (+10đ)</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #eab308;"></div>
        <span>Chuột Vàng (+20đ · Vận dụng)</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #dc2626;"></div>
        <span>Chuột Bom (-10đ · Cẩn thận!)</span>
      </div>
    </div>

    <!-- 3x3 Mole Arena -->
    <div class="game-arena" id="arena">
      <div class="bomb-alert" id="bomb-alert">💥 TRÚNG BOM! Bị trừ 10 điểm!</div>

      <div class="grid-3x3" id="holes-grid">
        <!-- 9 holes injected by JS -->
      </div>

      <!-- Start Overlay -->
      <div class="center-overlay" id="overlay-start">
        <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 8px;">Sẵn Sàng Ôn Tập Lượng Giác?</h2>
        <p style="font-size: 15px; color: #64748b; max-width: 480px; line-height: 1.5; margin-bottom: 20px;">
          Đập trúng <strong>Chuột Kiến Thức</strong> (+10đ) hoặc <strong>Chuột Vàng</strong> (+20đ) để giải bài tập công thức chuẩn. Tránh xa <strong>Chuột Bom</strong> nhé!
        </p>
        <button class="btn-action" id="btn-start" style="font-size: 17px; padding: 14px 32px;">
          Bắt đầu chơi ngay (60s)
        </button>
      </div>

      <!-- End Summary Overlay -->
      <div class="center-overlay" id="overlay-end" style="display: none; max-height: 95%; overflow-y: auto;">
        <h2 style="font-size: 24px; color: #1e293b;">Hết Giờ! Tổng Kết Lượt Chơi</h2>
        <div style="margin: 12px 0; font-size: 18px; font-weight: 700; color: #2563eb;" id="end-rank">
          Đang tính kết quả...
        </div>
        <p style="font-size: 14px; color: #475569; margin-bottom: 16px;" id="end-stats">
          Điểm: 0 · Đúng: 0 · Sai: 0
        </p>

        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
            📚 Tổng hợp công thức trọng tâm cần nhớ:
          </h3>
          <div id="end-formulas-box" style="background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.7;">
            <!-- Formulas injected with KaTeX -->
          </div>
        </div>

        <button class="btn-action" id="btn-restart">
          Chơi lại lượt mới
        </button>
      </div>
    </div>
  </div>

  <!-- Question Modal -->
  <div class="modal-overlay" id="question-modal">
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-badge" id="modal-badge">Chuột Kiến Thức (+10đ)</span>
        <span style="font-size: 13px; font-weight: 700; color: #64748b;" id="modal-topic">Công thức cộng</span>
      </div>

      <div class="question-title" id="modal-question">Nội dung câu hỏi...</div>

      <div class="math-callout" id="modal-math" style="display: none;"></div>

      <div class="options-grid" id="modal-options">
        <!-- 4 options with KaTeX -->
      </div>

      <!-- Feedback -->
      <div class="feedback-box" id="modal-feedback">
        <div style="font-weight: 800; font-size: 15px; margin-bottom: 4px;" id="feedback-title">Chính xác!</div>
        <div id="feedback-text">Lời giải thích chi tiết...</div>
      </div>

      <div style="text-align: right; margin-top: 8px;">
        <button class="btn-action" id="btn-continue" style="display: none;">
          Tiếp tục chơi ➔
        </button>
      </div>
    </div>
  </div>

  <script>
    const QUESTIONS = ${jsonQuestions};
    const FORMULAS = ${jsonFormulas};

    // --- STANDARD LATEX RENDER HELPER (KaTeX) ---
    function renderLatex(latex, isDisplay = false) {
      if (window.katex) {
        try {
          return window.katex.renderToString(latex, {
            throwOnError: false,
            displayMode: isDisplay,
            output: 'htmlAndMathml'
          });
        } catch(e) {}
      }
      return '<span style="font-style:italic;">' + latex + '</span>';
    }

    function renderRichText(text) {
      return text.replace(/\\$([^$]+)\\$/g, (match, formula) => {
        return renderLatex(formula, false);
      });
    }

    // --- SOUND EFFECTS (Web Audio API Synthesizer) ---
    class SoundFX {
      constructor() { this.ctx = null; }
      init() {
        if (!this.ctx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.ctx = new AudioContextClass();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }
      pop() {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } catch(e) {}
      }
      hit() {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        } catch(e) {}
      }
      bomb() {
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const bufferSize = this.ctx.sampleRate * 0.4;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, now);
          filter.frequency.linearRampToValueAtTime(60, now + 0.35);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          noise.start(now);
          noise.stop(now + 0.4);
        } catch(e) {}
      }
      correct() {
        try {
          this.init();
          if (!this.ctx) return;
          const notes = [523.25, 659.25, 783.99, 1046.5];
          const now = this.ctx.currentTime;
          notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.06;
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
          });
        } catch(e) {}
      }
      wrong() {
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.setValueAtTime(120, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } catch(e) {}
      }
    }
    const sfx = new SoundFX();

    // --- SVG MOLE GRAPHICS ---
    const SVG_MOLES = {
      knowledge: \`<svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="65" rx="35" ry="32" fill="#8d5b4c"/>
        <ellipse cx="50" cy="67" rx="24" ry="22" fill="#fde68a"/>
        <circle cx="24" cy="40" r="14" fill="#8d5b4c"/>
        <circle cx="24" cy="40" r="8" fill="#fda4af"/>
        <circle cx="76" cy="40" r="14" fill="#8d5b4c"/>
        <circle cx="76" cy="40" r="8" fill="#fda4af"/>
        <circle cx="38" cy="56" r="8" fill="none" stroke="#0f172a" stroke-width="2.5"/>
        <circle cx="62" cy="56" r="8" fill="none" stroke="#0f172a" stroke-width="2.5"/>
        <line x1="46" y1="56" x2="54" y2="56" stroke="#0f172a" stroke-width="2.5"/>
        <circle cx="39" cy="56" r="3.5" fill="#0f172a"/>
        <circle cx="63" cy="56" r="3.5" fill="#0f172a"/>
        <ellipse cx="50" cy="66" rx="6" ry="4" fill="#1e293b"/>
        <polygon points="50,14 86,25 50,36 14,25" fill="#1e3a8a"/>
        <polygon points="50,36 38,43 62,43" fill="#1d4ed8"/>
        <line x1="76" y1="28" x2="80" y2="42" stroke="#facc15" stroke-width="2.5"/>
        <circle cx="80" cy="44" r="3" fill="#facc15"/>
      </svg>\`,
      gold: \`<svg viewBox="0 0 100 100">
        <circle cx="50" cy="55" r="44" fill="#fef08a" opacity="0.35"/>
        <ellipse cx="50" cy="65" rx="35" ry="32" fill="#d97706"/>
        <ellipse cx="50" cy="67" rx="24" ry="22" fill="#fef3c7"/>
        <circle cx="24" cy="40" r="14" fill="#d97706"/>
        <circle cx="24" cy="40" r="8" fill="#fbbf24"/>
        <circle cx="76" cy="40" r="14" fill="#d97706"/>
        <circle cx="76" cy="40" r="8" fill="#fbbf24"/>
        <circle cx="38" cy="56" r="4" fill="#451a03"/>
        <circle cx="39.5" cy="54.5" r="1.5" fill="white"/>
        <circle cx="62" cy="56" r="4" fill="#451a03"/>
        <circle cx="63.5" cy="54.5" r="1.5" fill="white"/>
        <ellipse cx="50" cy="66" rx="6" ry="4" fill="#451a03"/>
        <path d="M26,34 L36,16 L50,28 L64,16 L74,34 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2.5"/>
        <circle cx="36" cy="16" r="3.5" fill="#ef4444"/>
        <circle cx="50" cy="27" r="3.5" fill="#3b82f6"/>
        <circle cx="64" cy="16" r="3.5" fill="#22c55e"/>
      </svg>\`,
      bomb: \`<svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="65" rx="35" ry="32" fill="#334155"/>
        <ellipse cx="50" cy="67" rx="22" ry="20" fill="#64748b"/>
        <circle cx="24" cy="40" r="13" fill="#334155"/>
        <circle cx="76" cy="40" r="13" fill="#334155"/>
        <path d="M30,53 L44,57" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        <path d="M70,53 L56,57" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        <circle cx="38" cy="56" r="3" fill="#dc2626"/>
        <circle cx="62" cy="56" r="3" fill="#dc2626"/>
        <ellipse cx="50" cy="66" rx="5" ry="3" fill="#0f172a"/>
        <circle cx="50" cy="28" r="15" fill="#0f172a"/>
        <rect x="46" y="10" width="8" height="5" fill="#475569"/>
        <path d="M50,10 Q58,3 64,6" fill="none" stroke="#f97316" stroke-width="2.5"/>
        <circle cx="65" cy="6" r="4" fill="#eab308"/>
        <circle cx="65" cy="6" r="2" fill="#ef4444"/>
      </svg>\`
    };

    // --- GAME STATE ---
    let score = 0;
    let timeLeft = 60;
    let correctCount = 0;
    let wrongCount = 0;
    let isPlaying = false;
    let isPaused = false;
    let gameTimer = null;
    let moleTimer = null;
    let activeHole = -1;
    let currentMoleType = 'knowledge';
    let availableQuestions = [];
    let currentQuestion = null;

    // DOM Elements
    const valTime = document.getElementById('val-time');
    const valScore = document.getElementById('val-score');
    const valCorrect = document.getElementById('val-correct');
    const valWrong = document.getElementById('val-wrong');
    const holesGrid = document.getElementById('holes-grid');
    const overlayStart = document.getElementById('overlay-start');
    const overlayEnd = document.getElementById('overlay-end');
    const bombAlert = document.getElementById('bomb-alert');
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');

    const questionModal = document.getElementById('question-modal');
    const modalBadge = document.getElementById('modal-badge');
    const modalTopic = document.getElementById('modal-topic');
    const modalQuestion = document.getElementById('modal-question');
    const modalMath = document.getElementById('modal-math');
    const modalOptions = document.getElementById('modal-options');
    const modalFeedback = document.getElementById('modal-feedback');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-text');
    const btnContinue = document.getElementById('btn-continue');
    const endFormulasBox = document.getElementById('end-formulas-box');

    function initBoard() {
      holesGrid.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole-wrapper';
        hole.dataset.index = i;

        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.dataset.index = i;
        mole.addEventListener('click', (e) => onMoleClick(i, e));

        hole.appendChild(mole);
        holesGrid.appendChild(hole);
      }
    }

    function shuffle(arr) {
      return [...arr].sort(() => Math.random() - 0.5);
    }

    function startGame() {
      score = 0;
      timeLeft = 60;
      correctCount = 0;
      wrongCount = 0;
      isPlaying = true;
      isPaused = false;
      availableQuestions = shuffle(QUESTIONS);

      updateDashboard();
      overlayStart.style.display = 'none';
      overlayEnd.style.display = 'none';

      clearInterval(gameTimer);
      gameTimer = setInterval(tickSecond, 1000);

      spawnNextMole();
    }

    function tickSecond() {
      if (isPaused) return;
      timeLeft--;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endGame();
      }
      updateDashboard();
    }

    function updateDashboard() {
      valTime.textContent = timeLeft + 's';
      if (timeLeft <= 15) {
        valTime.classList.add('warning');
      } else {
        valTime.classList.remove('warning');
      }
      valScore.textContent = score;
      valCorrect.textContent = correctCount;
      valWrong.textContent = wrongCount;
    }

    function spawnNextMole() {
      if (!isPlaying || isPaused) return;

      let nextHole;
      do {
        nextHole = Math.floor(Math.random() * 9);
      } while (nextHole === activeHole && 9 > 1);

      const rand = Math.random();
      if (rand < 0.60) {
        currentMoleType = 'knowledge';
      } else if (rand < 0.80) {
        currentMoleType = 'gold';
      } else {
        currentMoleType = 'bomb';
      }

      activeHole = nextHole;
      const moleEl = document.querySelector(\`.mole[data-index="\${nextHole}"]\`);
      if (!moleEl) return;

      moleEl.innerHTML = SVG_MOLES[currentMoleType];
      moleEl.classList.remove('hit');
      moleEl.classList.add('up');
      sfx.pop();

      const stayDuration = Math.floor(Math.random() * 600) + 1400;

      clearTimeout(moleTimer);
      moleTimer = setTimeout(() => {
        if (moleEl.classList.contains('up') && !moleEl.classList.contains('hit')) {
          moleEl.classList.remove('up');
          activeHole = -1;
          const waitNext = Math.floor(Math.random() * 400) + 400;
          moleTimer = setTimeout(spawnNextMole, waitNext);
        }
      }, stayDuration);
    }

    function onMoleClick(holeIdx, event) {
      if (!isPlaying || isPaused) return;
      if (holeIdx !== activeHole) return;

      const moleEl = document.querySelector(\`.mole[data-index="\${holeIdx}"]\`);
      if (!moleEl || !moleEl.classList.contains('up')) return;

      moleEl.classList.remove('up');
      moleEl.classList.add('hit');

      if (currentMoleType === 'bomb') {
        sfx.bomb();
        score = Math.max(0, score - 10);
        wrongCount++;
        updateDashboard();
        triggerBombAlert();

        activeHole = -1;
        moleTimer = setTimeout(spawnNextMole, 800);
      } else {
        sfx.hit();
        openQuestionModal(currentMoleType);
      }
    }

    function triggerBombAlert() {
      bombAlert.classList.add('show');
      setTimeout(() => {
        bombAlert.classList.remove('show');
      }, 1500);
    }

    function openQuestionModal(type) {
      isPaused = true;

      let q = availableQuestions.find(item => item.category === type);
      if (!q) {
        availableQuestions = shuffle(QUESTIONS);
        q = availableQuestions.find(item => item.category === type) || availableQuestions[0];
      }
      availableQuestions = availableQuestions.filter(item => item.id !== q.id);
      currentQuestion = q;

      if (type === 'gold') {
        modalBadge.textContent = 'Chuột Vàng (+20đ · Vận dụng cao)';
        modalBadge.className = 'modal-badge badge-gold';
      } else {
        modalBadge.textContent = 'Chuột Kiến Thức (+10đ · Nhận biết/Thông hiểu)';
        modalBadge.className = 'modal-badge badge-knowledge';
      }

      modalTopic.textContent = q.topic;
      modalQuestion.innerHTML = renderRichText(q.question);

      if (q.mathFormula) {
        modalMath.style.display = 'block';
        modalMath.innerHTML = renderLatex(q.mathFormula, true);
      } else {
        modalMath.style.display = 'none';
      }

      // Render options with standard KaTeX
      modalOptions.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = \`<span class="option-prefix">\${letters[idx]}</span><span class="option-text">\${renderLatex(opt, false)}</span>\`;
        btn.onclick = () => submitAnswer(idx);
        modalOptions.appendChild(btn);
      });

      modalFeedback.className = 'feedback-box';
      modalFeedback.style.display = 'none';
      btnContinue.style.display = 'none';

      questionModal.classList.add('active');
    }

    function submitAnswer(chosenIdx) {
      const allButtons = modalOptions.querySelectorAll('.option-btn');
      allButtons.forEach(btn => btn.disabled = true);

      const isCorrect = chosenIdx === currentQuestion.correctIndex;
      allButtons[currentQuestion.correctIndex].classList.add('correct');

      if (isCorrect) {
        sfx.correct();
        score += currentQuestion.points;
        correctCount++;
        feedbackTitle.textContent = \`🎉 Tuyệt vời! Bạn trả lời hoàn toàn chính xác! (+\${currentQuestion.points} điểm)\`;
        modalFeedback.className = 'feedback-box correct';
      } else {
        sfx.wrong();
        wrongCount++;
        allButtons[chosenIdx].classList.add('wrong');
        feedbackTitle.textContent = '💡 Chưa chính xác! Hãy cùng xem lời giải dưới đây:';
        modalFeedback.className = 'feedback-box wrong';
      }

      feedbackText.innerHTML = \`<strong>Lời giải:</strong> \${renderRichText(currentQuestion.explanation)}\` + 
        (currentQuestion.tip ? \`<br><em style="color:#b45309; font-size:13px;">👉 Mẹo nhớ: \${currentQuestion.tip}</em>\` : '');

      modalFeedback.style.display = 'block';
      btnContinue.style.display = 'inline-flex';
      updateDashboard();
    }

    function closeModalAndResume() {
      questionModal.classList.remove('active');
      isPaused = false;
      activeHole = -1;
      moleTimer = setTimeout(spawnNextMole, 500);
    }

    function endGame() {
      isPlaying = false;
      isPaused = false;
      clearInterval(gameTimer);
      clearTimeout(moleTimer);

      document.querySelectorAll('.mole').forEach(m => m.classList.remove('up'));

      let rank = '🌟 Tân binh Lượng giác';
      if (score >= 80) rank = '👑 Đại Kiện Tướng Lượng Giác';
      else if (score >= 50) rank = '🔥 Chuyên Gia Công Thức';
      else if (score >= 30) rank = '📚 Học Sinh Chăm Chỉ';

      document.getElementById('end-rank').textContent = rank;
      document.getElementById('end-stats').innerHTML = 
        \`Tổng điểm: <strong>\${score} điểm</strong> · Số câu Đúng: <strong style="color:#16a34a">\${correctCount}</strong> · Số câu Sai / Bom: <strong style="color:#dc2626">\${wrongCount}</strong>\`;

      // Render summary formulas with KaTeX
      let htmlFormulas = '';
      FORMULAS.forEach(cat => {
        htmlFormulas += \`<div style="margin-bottom:8px;"><strong>\${cat.title}:</strong><ul style="margin-left:18px; margin-top:4px;">\`;
        cat.items.forEach(it => {
          htmlFormulas += \`<li style="margin-bottom:4px;">\${it.name}: \${renderLatex(it.latex, false)}</li>\`;
        });
        htmlFormulas += '</ul></div>';
      });
      endFormulasBox.innerHTML = htmlFormulas;

      overlayEnd.style.display = 'flex';
      sfx.correct();
    }

    // Events
    btnStart.addEventListener('click', startGame);
    btnRestart.addEventListener('click', startGame);
    btnContinue.addEventListener('click', closeModalAndResume);

    initBoard();
  </script>
</body>
</html>`;
}
