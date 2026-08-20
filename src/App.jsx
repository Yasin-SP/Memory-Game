import { useEffect, useMemo, useState } from "react";
import { Card } from "./components/Card";
import { GameHeader } from "./components/GameHeader";
import { WinMessage } from "./components/WinMessage";
import { useGameLogic } from "./hooks/useGameLogic";

const SYMBOLS = ["🍕", "🚀", "🦄", "🍩", "🎮", "🐸", "🌈", "🍉", "👾", "🛸", "🐼", "⚡"];
const DIFFICULTIES = {
  easy: { label: "Easy", pairs: 6, columns: 4, preview: "3 × 4", emoji: "🌱", vibe: "Warm-up" },
  classic: { label: "Classic", pairs: 8, columns: 4, preview: "4 × 4", emoji: "🎮", vibe: "Just right" },
  hard: { label: "Hard", pairs: 10, columns: 5, preview: "4 × 5", emoji: "🔥", vibe: "Bring it" },
  expert: { label: "Expert", pairs: 12, columns: 6, preview: "4 × 6", emoji: "💀", vibe: "No mercy" },
};

function App() {
  const [difficulty, setDifficulty] = useState("classic");
  const [started, setStarted] = useState(false);
  const [sound, setSound] = useState(true);
  const config = DIFFICULTIES[difficulty];
  const values = useMemo(() => SYMBOLS.slice(0, config.pairs).flatMap((symbol) => [symbol, symbol]), [config.pairs]);
  const { cards, score, moves, matches, mistakes, combo, elapsed, isLocked, isGameComplete, initializeGame, handleCardClick } = useGameLogic(values, { enabled: started, sound });
  // Read directly from localStorage on every render instead of mirroring it into state;
  // the component already re-renders on every score/isGameComplete change, so this stays in sync
  // without needing a redundant `setState` inside an effect.
  const bestScore = Number(localStorage.getItem(`memory-best-${difficulty}`) || 0);

  // Only re-initializes when `difficulty` changes (guarded by the current `started` value);
  // intentionally excluding `started`/`initializeGame` so switching difficulty mid-game doesn't
  // also re-run this on every start/stop toggle (that reset is already handled inside useGameLogic).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (started) initializeGame(); }, [difficulty]);
  useEffect(() => {
    if (!isGameComplete || score <= 0) return;
    const key = `memory-best-${difficulty}`;
    const saved = Number(localStorage.getItem(key) || 0);
    if (score > saved) localStorage.setItem(key, String(score));
  }, [difficulty, isGameComplete, score]);

  const startGame = () => { initializeGame(); setStarted(true); };
  const newGame = () => { initializeGame(); setStarted(true); };

  return (
    <main className="game-shell">
      <div className="floating-shape shape-one">✦</div><div className="floating-shape shape-two">●</div><div className="floating-shape shape-three">✚</div>
      <div className="floating-shape shape-four">★</div><div className="bubble bubble-one" /><div className="bubble bubble-two" />

      {!started ? (
        <section className="start-screen">
          <div className="hero-stickers"><span>🧠</span><span>✨</span><span>🎮</span></div>
          <div className="brand-row"><div className="brand-mark">🧠</div><div><p className="eyebrow">MEMORY QUEST</p><p className="mini-tag">MATCH • REMEMBER • WIN</p></div></div>
          <h1>Flip it.<br /><span>Match it!</span></h1>
          <p className="intro">Can your brain handle the chaos? Flip two cards, find the matching buddies, and build the biggest streak you can. 🚀</p>

          <div className="difficulty-grid" role="radiogroup" aria-label="Difficulty">
            {Object.entries(DIFFICULTIES).map(([key, item]) => (
              <button key={key} className={`difficulty-card ${difficulty === key ? "selected" : ""}`} onClick={() => setDifficulty(key)} role="radio" aria-checked={difficulty === key}>
                <span className="difficulty-emoji">{item.emoji}</span><span className="difficulty-copy"><strong>{item.label}</strong><small>{item.preview} · {item.vibe}</small></span>{difficulty === key && <b>✓</b>}
              </button>
            ))}
          </div>

          <button className="primary-btn" onClick={startGame}>LET'S PLAY! <span>🎲</span></button>
          <div className="best-row"><span>🏅 BEST SCORE</span><strong>{bestScore || "—"}</strong><span>GOOD LUCK! 🍀</span></div>
        </section>
      ) : (
        <section className="game-view">
          <GameHeader score={score} moves={moves} matches={matches} mistakes={mistakes} combo={combo} elapsed={elapsed} difficulty={config.label} totalPairs={config.pairs} sound={sound} onToggleSound={() => setSound((value) => !value)} onReset={newGame} onExit={() => setStarted(false)} />
          <div className="board-title"><span>{config.emoji} Find the pairs!</span>{combo > 1 && <b>🔥 Combo x{combo}</b>}</div>
          <div className={`cards-grid grid-${config.columns}`} aria-busy={isLocked} style={{ "--columns": config.columns }}>
            {cards.map((card) => <Card key={card.id} card={card} onClick={handleCardClick} />)}
          </div>
          <div className="game-footer"><span>💡 TIP: Remember where you saw each card!</span><span>{isLocked ? "👀 CHECKING..." : "TAP A CARD"}</span></div>
          {isGameComplete && <WinMessage moves={moves} elapsed={elapsed} mistakes={mistakes} score={score} difficulty={config.label} onReplay={newGame} onChangeDifficulty={() => setStarted(false)} />}
        </section>
      )}
    </main>
  );
}
export default App;
