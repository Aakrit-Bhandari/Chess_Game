import { BOARD_COLUMNS, BOARD_ROWS } from "../../constants";
import type { IBoardContext, IRook } from "../types";

export class Rook implements IRook {
  private board: IBoardContext;

  constructor(board: IBoardContext) {
    this.board = board;
  }

  private moveBottomDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (let i = rowIdx + 1; i < BOARD_ROWS; i++) {
      const cell = this.board.cells[i][colIdx];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveTopDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (let i = rowIdx - 1; i >= 0; i--) {
      const cell = this.board.cells[i][colIdx];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveLeftDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (let i = colIdx - 1; i >= 0; i--) {
      const cell = this.board.cells[rowIdx][i];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  private moveRightDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    for (let i = colIdx + 1; i < BOARD_COLUMNS; i++) {
      const cell = this.board.cells[rowIdx][i];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.board.setCaptureable(cell, currentCell);
        break;
      }
    }
  }

  public callRook(rowIdx: number, colIdx: number): void {
    this.moveBottomDirection(rowIdx, colIdx);
    this.moveTopDirection(rowIdx, colIdx);
    this.moveRightDirection(rowIdx, colIdx);
    this.moveLeftDirection(rowIdx, colIdx);
  }
}
