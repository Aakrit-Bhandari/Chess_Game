import { AdvancedPiece } from "../constants";
import styles from "./SelectPiece.module.css";

export interface ISelectPieceProps {
  rowIndex: number; // real board row of the pawn
  colIndex: number; // real board column of the pawn
  side: "white" | "black"; // colour of the pawn being promoted
  flipped: boolean; // is the board shown from black's side?
}

export default function SelectPiece({
  rowIndex,
  colIndex,
  side,
  flipped,
}: ISelectPieceProps) {
  const upgradePawn = (piece: string) => {
    window.dispatchEvent(
      new CustomEvent("upgradePawn", {
        detail: { rowIdx: rowIndex, colIdx: colIndex, piece },
      }),
    );
  };

  // Where the square sits on screen decides which edge the strip hangs from.
  const displayRow = flipped ? 7 - rowIndex : rowIndex;
  const displayCol = flipped ? 7 - colIndex : colIndex;
  const atTop = displayRow === 0;

  return (
    <div
      className={styles.promotionShade}
      role="dialog"
      aria-label="Promote pawn"
    >
      <div
        className={`${styles.promotionList} ${atTop ? styles.opensDownward : styles.opensUpward}`}
        style={{ left: `${displayCol * 12.5}%` }}
      >
        {AdvancedPiece.map((piece, i) => (
          <button
            key={piece}
            className={styles.promotionChoice}
            aria-label={`Promote to ${piece}`}
            autoFocus={i === 0}
            onClick={() => upgradePawn(piece)}
          >
            <span
              className={styles.piecePicture}
              style={{
                backgroundImage: `url(${new URL(`../../assets/${side}_${piece}.png`, import.meta.url).href})`,
              }}
            />
          </button>
        ))}
      </div>
      <div className={`${styles.promotionHint} ${atTop ? "" : styles.hintAtTop}`}>
        Choose a piece for your pawn
      </div>
    </div>
  );
}
