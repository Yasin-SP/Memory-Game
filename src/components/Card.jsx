export const Card = ({ card, onClick }) => {
  const revealed = card.isFlipped || card.isMatched;
  const color = card.id % 6;

  return (
    <button
      className={`card color-${color} ${revealed ? "revealed" : ""} ${card.isMatched ? "matched" : ""}`}
      onClick={() => onClick(card)}
      disabled={card.isMatched}
      aria-label={
        card.isMatched
          ? `Matched ${card.value}`
          : revealed
            ? `Card ${card.value}`
            : "Hidden memory card"
      }
    >
      <span className="card-inner">
        <span className="card-face card-front" aria-hidden="true">
          <span className="card-pattern">✦</span>
          <span className="card-question">?</span>
          <span className="card-spark">•</span>
        </span>
        <span className="card-face card-back" aria-hidden="true">
          <span className="card-sticker">
            <span className="card-emoji">{card.value}</span>
          </span>
        </span>
      </span>
    </button>
  );
};
