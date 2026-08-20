const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

export const WinMessage = ({
  moves,
  elapsed,
  mistakes,
  score,
  difficulty,
  onReplay,
  onChangeDifficulty,
}) => (
  <div
    className="win-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Game complete"
  >
    <div className="confetti confetti-a">🎉</div>
    <div className="confetti confetti-b">⭐</div>
    <div className="confetti confetti-c">✨</div>
    <div className="win-card">
      <div className="win-badge">🏆</div>
      <p className="eyebrow">LEVEL COMPLETE!</p>
      <h2>
        You nailed it! <span>🎉</span>
      </h2>
      <p className="win-copy">
        Every pair found. Your memory muscles are getting stronger!
      </p>

      <div className="result-grid">
        <div>
          <span>⏱ TIME</span>
          <strong>{formatTime(elapsed)}</strong>
        </div>
        <div>
          <span>🎯 MOVES</span>
          <strong>{moves}</strong>
        </div>
        <div>
          <span>💥 MISS</span>
          <strong>{mistakes}</strong>
        </div>
        <div>
          <span>⭐ SCORE</span>
          <strong>{score}</strong>
        </div>
      </div>

      <div className="win-actions">
        <button className="primary-btn" onClick={onReplay}>
          Play again 🎮
        </button>
        <button className="secondary-btn" onClick={onChangeDifficulty}>
          Change mode
        </button>
      </div>
      <p className="win-mode">{difficulty} mode · GG!</p>
    </div>
  </div>
);
