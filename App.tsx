import { useState, useEffect, useRef, useCallback } from "react";

import backLifeImg from "@assets/nude_Back_-_Life_1782465761007.png";
import backLoveImg from "@assets/nude_Back_-_Love_1782465761008.png";
import logoImg from "@assets/nude_logo_nude_1782465761009.png";

import life1 from "@assets/nude_life_1_1782465767551.png";
import life2 from "@assets/nude_life2_1782465767562.png";
import life3 from "@assets/nude_life3_1782465767562.png";
import life4 from "@assets/nude_life_4_1782465767560.png";
import life5 from "@assets/nude_life_5_1782465767561.png";
import life6 from "@assets/nude_life_6_1782465767561.png";
import life7 from "@assets/nude_life_7_1782465767561.png";
import life8 from "@assets/nude_life_8_1782465767561.png";
import life9 from "@assets/nude_life_9_1782465767561.png";

import loveAdventurer from "@assets/nude_The_Adventurer_1782468216742.png";
import loveCEO from "@assets/nude_The_CEO_1782468216750.png";
import loveGentleman from "@assets/nude_The_Gentleman_1782468216751.png";
import loveGoldenChild from "@assets/nude_The_Golden_Child_1782468216751.png";
import loveGoldenRetriever from "@assets/nude_The_Golden_Retriever_1782468216751.png";
import loveHighMaintenance from "@assets/nude_The_High-Maintenance_Man_1782468216752.png";
import loveKeptMan from "@assets/nude_The_Kept_Man_1782468216752.png";
import loveProvider from "@assets/nude_The_Provider_1782468216753.png";
import loveRomantic from "@assets/nude_The_Romantic_1782468216753.png";

const LIFE_CARDS = [life1, life2, life3, life4, life5, life6, life7, life8, life9];
const LOVE_CARDS = [loveAdventurer, loveCEO, loveGentleman, loveGoldenChild, loveGoldenRetriever, loveHighMaintenance, loveKeptMan, loveProvider, loveRomantic];

type Screen = "choose" | "shuffle" | "result";
type Category = "LIFE" | "LOVE" | null;

interface CardState {
  id: number;
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
  transitioning: boolean;
}

function Choose({ onSelect }: { onSelect: (cat: Category) => void }) {
  return (
    <div className="screen choose-screen">
      <div className="choose-header">
        <img src={logoImg} alt="nude." className="brand-logo" draggable={false} />
        <p className="choose-question">What would you like<br />to explore today?</p>
      </div>

      <div className="choose-cards">
        <button className="choose-card-btn" onClick={() => onSelect("LIFE")} aria-label="Choose LIFE">
          <img src={backLifeImg} alt="LIFE" className="choose-card-img" draggable={false} />
          <span className="choose-label">LIFE</span>
        </button>
        <button className="choose-card-btn" onClick={() => onSelect("LOVE")} aria-label="Choose LOVE">
          <img src={backLoveImg} alt="LOVE" className="choose-card-img" draggable={false} />
          <span className="choose-label">LOVE</span>
        </button>
      </div>

      <div className="choose-footer">✦ TRUST YOUR INTUITION ✦</div>
    </div>
  );
}

const CARD_COUNT = 9;

function Shuffle({
  category,
  backImg,
  onCardPick,
  onBack,
}: {
  category: Category;
  backImg: string;
  onCardPick: (cardImg: string) => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "choosing">("idle");
  const [cards, setCards] = useState<CardState[]>(() =>
    Array.from({ length: CARD_COUNT }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      rotate: 0,
      zIndex: i,
      transitioning: false,
    }))
  );
  const [clickable, setClickable] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const shuffleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getGridPosition = (index: number) => {
    const cols = 3;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cardW = 90;
    const cardH = 130;
    const gapX = 20;
    const gapY = 22;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const totalH = 3 * cardH + 2 * gapY;
    const startX = -totalW / 2 + cardW / 2;
    const startY = -totalH / 2 + cardH / 2;
    return {
      x: startX + col * (cardW + gapX),
      y: startY + row * (cardH + gapY),
    };
  };

  useEffect(() => {
    const arranged = cards.map((c, i) => {
      const pos = getGridPosition(i);
      return { ...c, x: pos.x, y: pos.y, rotate: 0, transitioning: true };
    });
    setCards(arranged);

    const t1 = setTimeout(() => {
      setPhase("shuffling");
      doShuffle();
    }, 400);

    return () => {
      clearTimeout(t1);
      if (shuffleRef.current) clearTimeout(shuffleRef.current);
    };
  }, []);

  const doShuffle = useCallback(() => {
    let count = 0;
    const maxIterations = 7;

    const step = () => {
      count++;
      setCards((prev) => {
        const next = [...prev];
        const swaps = Math.floor(Math.random() * 2) + 2;
        for (let s = 0; s < swaps; s++) {
          const a = Math.floor(Math.random() * CARD_COUNT);
          const b = Math.floor(Math.random() * CARD_COUNT);
          if (a !== b) {
            const posA = { x: next[a].x, y: next[a].y };
            const posB = { x: next[b].x, y: next[b].y };
            next[a] = {
              ...next[a],
              x: posB.x,
              y: posB.y,
              rotate: (Math.random() - 0.5) * 7,
              zIndex: CARD_COUNT + s,
              transitioning: true,
            };
            next[b] = {
              ...next[b],
              x: posA.x,
              y: posA.y,
              rotate: (Math.random() - 0.5) * 7,
              zIndex: CARD_COUNT + s + 1,
              transitioning: true,
            };
          }
        }
        return next;
      });

      if (count < maxIterations) {
        shuffleRef.current = setTimeout(step, 320);
      } else {
        shuffleRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => {
              const pos = getGridPosition(i);
              return { ...c, x: pos.x, y: pos.y, rotate: 0, zIndex: i, transitioning: true };
            })
          );
          setTimeout(() => {
            setPhase("choosing");
            setTimeout(() => setClickable(true), 300);
          }, 750);
        }, 400);
      }
    };

    shuffleRef.current = setTimeout(step, 150);
  }, []);

  const handleCardClick = (cardId: number) => {
    if (!clickable) return;
    setClickable(false);
    const pool = category === "LOVE" ? LOVE_CARDS : LIFE_CARDS;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, y: c.y - 22, zIndex: 999, transitioning: true }
          : { ...c, transitioning: true }
      )
    );

    setTimeout(() => {
      onCardPick(picked);
    }, 420);
  };

  return (
    <div className="screen shuffle-screen">
      <div className="shuffle-header">
        <img src={logoImg} alt="nude." className="brand-logo small" draggable={false} />
        <div className="shuffle-category-badge">{category}</div>
      </div>

      <div className="shuffle-arena">
        <div className="cards-container">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`shuffle-card ${clickable ? "clickable" : ""} ${hoveredCard === card.id ? "hovered" : ""}`}
              style={{
                transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
                zIndex: card.zIndex,
                transition: card.transitioning
                  ? "transform 0.48s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              }}
              onClick={() => handleCardClick(card.id)}
              onMouseEnter={() => clickable && setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={!clickable}
              aria-label={`Card ${card.id + 1}`}
            >
              <img
                src={backImg}
                alt="card back"
                className="shuffle-card-img"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="shuffle-text-area">
        {phase === "shuffling" && (
          <p className="shuffle-msg animate-pulse-soft">Shuffling your reading...</p>
        )}
        {phase === "choosing" && (
          <div className="choosing-msg">
            <p className="intuition-line">Trust your intuition.</p>
            <p className="choose-hint">Choose the card that catches your eye.</p>
          </div>
        )}
      </div>

      <button className="back-btn" onClick={onBack}>← Back</button>
    </div>
  );
}

function Result({
  cardImg,
  category,
  onDrawAgain,
  onBack,
}: {
  cardImg: string;
  category: Category;
  onDrawAgain: () => void;
  onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [bounced, setBounced] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setVisible(true); setGlowing(true); }, 80);
    const t2 = setTimeout(() => { setFlipped(true); setGlowing(false); }, 650);
    const t3 = setTimeout(() => setBounced(true), 1650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const backImg = category === "LOVE" ? backLoveImg : backLifeImg;

  return (
    <div className="screen result-screen">
      <div className="result-header">
        <img src={logoImg} alt="nude." className="brand-logo small" draggable={false} />
      </div>

      <div className={`result-card-wrap ${visible ? "visible" : ""}`}>
        <div className={`card-glow-wrap ${glowing ? "glowing" : ""}`}>
          <div className={`flip-card ${flipped ? "flipped" : ""}`}>
            <div className={`flip-card-inner ${bounced ? "bounced" : ""}`}>
              <div className="flip-face flip-front">
                <img src={backImg} alt="card back" className="result-card-img" draggable={false} />
              </div>
              <div className="flip-face flip-back">
                <img src={cardImg} alt="your card" className="result-card-img" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`result-actions ${flipped ? "actions-visible" : ""}`}>
        <button className="action-btn primary" onClick={onDrawAgain}>
          Draw Again
        </button>
        <button className="action-btn ghost" onClick={onBack}>
          ← Back to Categories
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("choose");
  const [category, setCategory] = useState<Category>(null);
  const [resultCard, setResultCard] = useState<string | null>(null);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setScreen("shuffle");
  };

  const handleCardPick = (img: string) => {
    setResultCard(img);
    setScreen("result");
  };

  const handleDrawAgain = () => {
    setResultCard(null);
    setScreen("shuffle");
  };

  const handleBack = () => {
    setResultCard(null);
    setCategory(null);
    setScreen("choose");
  };

  const backImg = category === "LOVE" ? backLoveImg : backLifeImg;

  return (
    <div className="app-root">
      {screen === "choose" && <Choose onSelect={handleCategorySelect} />}
      {screen === "shuffle" && category && (
        <Shuffle
          key={String(resultCard)}
          category={category}
          backImg={backImg}
          onCardPick={handleCardPick}
          onBack={handleBack}
        />
      )}
      {screen === "result" && resultCard && (
        <Result
          key={resultCard}
          cardImg={resultCard}
          category={category}
          onDrawAgain={handleDrawAgain}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
