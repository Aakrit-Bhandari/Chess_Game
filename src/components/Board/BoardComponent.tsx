import { useCallback, useMemo, useState } from "react";
import { BOARD_COLUMNS, BOARD_ROWS } from "../constants";
import styles from "./Board.module.css";
import { ChessBoard } from "./ChessBoard";
import { getCellData } from "./utils";
export default function BoardComponent() {
  const board = useMemo(() => new ChessBoard(), []);
  const [, forceRender] = useState(0);

  const performCalculation = useCallback(
    (rowIdx: number, colIdx: number): void => {
      board.performCalculation(rowIdx, colIdx);
      forceRender((prev) => prev + 1);
    },
    [board],
  );

  return (
    <div className={styles.chessBoard}>
      {Array.from({ length: BOARD_ROWS }, (_, rowIndex) =>
        Array.from({ length: BOARD_COLUMNS }, (_, colIndex) => {
          const {
            side,
            piece,
            highLighted,
            isCaptureable,
            darkCell,
            selected,
          } = getCellData(board.cells[rowIndex][colIndex]);
          return side ? (
            <div
              className={`${styles.cell} ${isCaptureable ? styles.captureable : ""} ${darkCell ? styles.darkCell : ""} ${selected ? styles.selected : ""}`}
              key={`${rowIndex}-${colIndex}`}
              onClick={() => performCalculation(rowIndex, colIndex)}
            >
              <div
                className={styles.piece}
                style={{
                  backgroundImage: `url(${new URL(`../../assets/${side}_${piece}.png`, import.meta.url).href})`,
                }}
              />
            </div>
          ) : (
            <div
              className={`${styles.cell} ${highLighted ? styles.highLighted : ""} ${darkCell ? styles.darkCell : ""}`}
              key={`${rowIndex}-${colIndex}`}
            />
          );
        }),
      )}
    </div>
  );
}
