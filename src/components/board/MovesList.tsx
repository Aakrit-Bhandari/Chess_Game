import { useEffect, useRef } from "react";
import styles from "./MovesList.module.css";

export interface IMovesListProps {
  /** One entry per half-move, White first: ["e4", "e5", "Nf3", ...] */
  moves: string[];
}

export default function MovesList({ moves }: IMovesListProps) {
  const scroller = useRef<HTMLDivElement>(null);

  // keep the newest move in view without scrolling the page itself
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [moves.length]);

  const rows = Math.ceil(moves.length / 2);
  const last = moves.length - 1;

  return (
    <section className={styles.movePanel} aria-label="Move list">
      <header className={styles.moveHeader}>
        <h3 className={styles.moveTitle}>Moves</h3>
        <span className={styles.moveCount}>{moves.length}</span>
      </header>

      <div className={styles.moveScroller} ref={scroller} aria-live="polite">
        {moves.length === 0 ? (
          <p className={styles.emptyMessage}>
            No moves yet. Each move you make is added here.
          </p>
        ) : (
          <ol className={styles.moveList}>
            {Array.from({ length: rows }, (_, i) => (
              <li className={styles.moveRow} key={i}>
                <span className={styles.moveNumber}>{i + 1}.</span>
                {[i * 2, i * 2 + 1].map((idx) => (
                  <span
                    key={idx}
                    className={`${styles.playedMove} ${idx === last ? styles.currentMove : ""}`}
                  >
                    {moves[idx] ?? ""}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
