const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const GameHeader = ({
  score,
  moves,
  matches,
  mistakes,
  combo,
  elapsed,
  difficulty,
  totalPairs,
  sound,
  onToggleSound,
  onReset,
  onExit,
}) => (
  <header className="game-header">
    <div className="header-top">
      <button
        className="icon-btn back-btn"
        onClick={onExit}
        aria-label="Exit game"
      >
        ←
      </button>
      <div className="game-title-wrap">
        <div className="game-logo">🧠</div>
        <div>
          <p className="eyebrow">MEMORY QUEST</p>
          <h1>
            {difficulty} <span>mode</span>
          </h1>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={onToggleSound}
          aria-label={sound ? "Mute sounds" : "Enable sounds"}
        >
          {sound ? "🔊" : "🔇"}
        </button>
        <button
          className="icon-btn restart-btn"
          onClick={onReset}
          aria-label="New game"
        >
          ↻
        </button>
      </div>
    </div>

    <div className="stats-row">
      <div className="stat stat-time">
        <span>⏱ TIME</span>
        <strong>{formatTime(elapsed)}</strong>
      </div>
      <div className="stat">
        <span>🎯 MOVES</span>
        <strong>{moves}</strong>
      </div>
      <div className="stat">
        <span>🧩 PAIRS</span>
        <strong>
          {matches}/{totalPairs}
        </strong>
      </div>
      <div className="stat">
        <span>💥 MISS</span>
        <strong>{mistakes}</strong>
      </div>
      <div className="stat score-stat">
        <span>⭐ SCORE</span>
        <strong>{score}</strong>
      </div>
    </div>

    <div className="progress-row">
      <div className="progress-track">
        <span style={{ width: `${(matches / totalPairs) * 100}%` }} />
      </div>
      {combo > 1 && <div className="combo-pill">🔥 {combo} STREAK!</div>}
    </div>
  </header>
);
