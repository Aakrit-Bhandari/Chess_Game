import { useMemo, useState } from "react";
import { ChessBoard } from "../class/chessBoard/ChessBoard";
import type { IPlayerTurn } from "../class/types";
import { BOARD_COLUMNS, BOARD_ROWS } from "../constants";
import styles from "./Board.module.css";
import { getCellData } from "./utils";
export default function BoardComponent() {
  const board = useMemo(() => ChessBoard.getInstance(), []);
  const [playerTurn, setPlayerTurn] = useState<IPlayerTurn>("white");
  const [, forceRender] = useState(0);

  const performCalculation = (
    rowIdx: number,
    colIdx: number,
    side: IPlayerTurn,
  ): void => {
    const cell = board.cells[rowIdx][colIdx];
    if (side && side !== playerTurn && !cell.isCaptureable) return;
    if (board.performCalculation(rowIdx, colIdx)) {
      setPlayerTurn(playerTurn === "white" ? "black" : "white");
    }
    forceRender((prev) => prev + 1);
  };

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
              onClick={() => performCalculation(rowIndex, colIndex, side)}
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
              onClick={() => performCalculation(rowIndex, colIndex, side)}
              className={`${styles.cell} ${highLighted ? styles.highLighted : ""} ${darkCell ? styles.darkCell : ""}`}
              key={`${rowIndex}-${colIndex}`}
            />
          );
        }),
      )}
    </div>
  );
}
