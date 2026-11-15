import { BOARD_COLUMNS, BOARD_ROWS } from "../../constants";
import type { IBoardContext, IBishop } from "../types";

export class Bishop implements IBishop {
  private board: IBoardContext;

  constructor(board: IBoardContext) {
    this.board = board;
  }

  private moveLeftTopDiagonalDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (let i = rowIdx - 1, j = colIdx - 1; i >= 0 && j >= 0; i--, j--) {
      const cell = this.board.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveLeftBottomDiagonalDirection(
    rowIdx: number,
    colIdx: number,
  ): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (
      let i = rowIdx + 1, j = colIdx - 1;
      i < BOARD_ROWS && j >= 0;
      i++, j--
    ) {
      const cell = this.board.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveRightBottomDiagonalDirection(
    rowIdx: number,
    colIdx: number,
  ): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (
      let i = rowIdx + 1, j = colIdx + 1;
      i < BOARD_ROWS && j < BOARD_COLUMNS;
      i++, j++
    ) {
      const cell = this.board.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveRightTopDiagonalDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (
      let i = rowIdx - 1, j = colIdx + 1;
      i >= 0 && j < BOARD_COLUMNS;
      i--, j++
    ) {
      const cell = this.board.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  public callBishop(rowIdx: number, colIdx: number): void {
    this.moveLeftTopDiagonalDirection(rowIdx, colIdx);
    this.moveLeftBottomDiagonalDirection(rowIdx, colIdx);
    this.moveRightTopDiagonalDirection(rowIdx, colIdx);
    this.moveRightBottomDiagonalDirection(rowIdx, colIdx);
  }
}
