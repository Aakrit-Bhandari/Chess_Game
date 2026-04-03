import type { IBoardContext, IChessCell, IKnight } from "../types";

export class Knight implements IKnight {
  private board: IBoardContext;

  constructor(board: IBoardContext) {
    this.board = board;
  }

  private knightCommonCalculation(
    rowIdx: number,
    colIdx: number,
    attackerCell: IChessCell,
  ): void {
    if (this.board.isValidPosition(rowIdx, colIdx)) {
      const attackedCell = this.board.cells[rowIdx][colIdx];
      if (attackedCell.isEmpty) {
        attackedCell.isHighLighted = true;
      }
      this.board.captureCell(attackedCell, attackerCell);
    }
  }

  private moveKnightBottomLeftDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.board.cells[rowIdx][colIdx];

    const firstBottom = rowIdx + dir[0];
    const secondBottom = rowIdx + dir[1];

    const firstLeft = colIdx + dir[3];
    const secondLeft = colIdx + dir[2];
    this.knightCommonCalculation(firstBottom, firstLeft, currentCell);
    this.knightCommonCalculation(secondBottom, secondLeft, currentCell);
  }

  private moveKnightBottomRightDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.board.cells[rowIdx][colIdx];
    const firstBottom = rowIdx + dir[0];
    const secondBottom = rowIdx + dir[1];

    const firstRight = colIdx + dir[1];
    const seconRight = colIdx + dir[0];

    this.knightCommonCalculation(firstBottom, firstRight, currentCell);
    this.knightCommonCalculation(secondBottom, seconRight, currentCell);
  }

  private moveKnightTopLeftDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.board.cells[rowIdx][colIdx];
    const firstTop = rowIdx + dir[2];
    const secondTop = rowIdx + dir[3];

    const firstLeft = colIdx + dir[3];
    const secondLeft = colIdx + dir[2];
    this.knightCommonCalculation(firstTop, firstLeft, currentCell);
    this.knightCommonCalculation(secondTop, secondLeft, currentCell);
  }

  private moveKnightTopRightDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.board.cells[rowIdx][colIdx];
    const firstTop = rowIdx + dir[2];
    const secondTop = rowIdx + dir[3];

    const firstRight = colIdx + dir[1];
    const secondRight = colIdx + dir[0];
    this.knightCommonCalculation(firstTop, firstRight, currentCell);
    this.knightCommonCalculation(secondTop, secondRight, currentCell);
  }

  public callKnight(rowIdx: number, colIdx: number): void {
    this.moveKnightBottomLeftDirection(rowIdx, colIdx);
    this.moveKnightBottomRightDirection(rowIdx, colIdx);
    this.moveKnightTopLeftDirection(rowIdx, colIdx);
    this.moveKnightTopRightDirection(rowIdx, colIdx);
  }
}
