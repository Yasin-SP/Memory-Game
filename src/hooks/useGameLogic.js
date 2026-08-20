import { useCallback, useEffect, useRef, useState } from "react";

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const playTone = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const settings = {
      flip: [420, 0.045, "sine"],
      match: [720, 0.11, "triangle"],
      miss: [170, 0.09, "sine"],
      win: [880, 0.16, "triangle"],
    }[type];
    oscillator.frequency.value = settings[0];
    oscillator.type = settings[2];
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(settings[1], ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 300);
  } catch {
    // Sound is an enhancement; gameplay must never depend on it.
  }
};

export const useGameLogic = (cardValues, { enabled = true, sound = true } = {}) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const timeoutRef = useRef(null);
  const wonRef = useRef(false);
  // Derived instead of stored in state: it's always recomputable from cards/matches,
  // so there's no need to sync it with a setState call inside an effect.
  const isComplete = cards.length > 0 && matches === cardValues.length / 2;

  const initializeGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCards(shuffle(cardValues).map((value, id) => ({ id, value, isFlipped: false, isMatched: false })));
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setMatches(0);
    setMistakes(0);
    setCombo(0);
    setElapsed(0);
    setIsLocked(false);
    wonRef.current = false;
  }, [cardValues]);

  // Intentional reset: (re)initializes the whole board whenever the game becomes enabled,
  // mirroring an external trigger (not derived state), so the setState-in-effect rule is
  // suppressed here deliberately rather than avoided.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (enabled) initializeGame();
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [enabled, initializeGame]);

  useEffect(() => {
    if (!enabled || isComplete) return undefined;
    const timer = setInterval(() => setElapsed((time) => time + 1), 1000);
    return () => clearInterval(timer);
  }, [enabled, isComplete]);

  const handleCardClick = useCallback((card) => {
    if (!enabled || isLocked || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    if (sound) playTone("flip");
    const nextFlipped = [...flippedCards, card.id];
    setCards((current) => current.map((item) => item.id === card.id ? { ...item, isFlipped: true } : item));
    setFlippedCards(nextFlipped);

    if (nextFlipped.length !== 2) return;

    setMoves((value) => value + 1);
    setIsLocked(true);
    const first = cards.find((item) => item.id === nextFlipped[0]);
    const isMatch = first?.value === card.value;

    if (isMatch) {
      setCombo((value) => value + 1);
      setMatches((value) => value + 1);
      setScore((value) => value + 100 + combo * 25);
      if (sound) playTone("match");
      timeoutRef.current = setTimeout(() => {
        setCards((current) => current.map((item) => nextFlipped.includes(item.id) ? { ...item, isMatched: true } : item));
        setFlippedCards([]);
        setIsLocked(false);
      }, 280);
    } else {
      setMistakes((value) => value + 1);
      setCombo(0);
      setScore((value) => Math.max(0, value - 20));
      if (sound) playTone("miss");
      timeoutRef.current = setTimeout(() => {
        setCards((current) => current.map((item) => nextFlipped.includes(item.id) ? { ...item, isFlipped: false } : item));
        setFlippedCards([]);
        setIsLocked(false);
      }, 750);
    }
  }, [cards, combo, enabled, flippedCards, isLocked, sound]);

  useEffect(() => {
    if (isComplete && !wonRef.current) {
      wonRef.current = true;
      if (sound) playTone("win");
    }
  }, [isComplete, sound]);

  return {
    cards,
    score,
    moves,
    matches,
    mistakes,
    combo,
    elapsed,
    isLocked,
    isGameComplete: isComplete,
    initializeGame,
    handleCardClick,
  };
};
