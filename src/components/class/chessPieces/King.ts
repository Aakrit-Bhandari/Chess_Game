import type { IBoardContext, IKing } from "../types";

export class King implements IKing {
  private board: IBoardContext;

  constructor(board: IBoardContext) {
    this.board = board;
  }

  private moveKingLeftDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    const finalCol = colIdx - 1;
    this.board.commonCellValidation(currentCell, rowIdx, finalCol);
    this.board.commonCellValidation(currentCell, rowIdx + 1, finalCol);
    this.board.commonCellValidation(currentCell, rowIdx - 1, finalCol);
    if (!currentCell.hasMoved) {
      this.board.commonCellValidation(currentCell, rowIdx, finalCol - 1);
    }
  }

  private moveKingRightDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    const finalCol = colIdx + 1;
    this.board.commonCellValidation(currentCell, rowIdx, finalCol);
    this.board.commonCellValidation(currentCell, rowIdx + 1, finalCol);
    this.board.commonCellValidation(currentCell, rowIdx - 1, finalCol);
    if (!currentCell.hasMoved) {
      this.board.commonCellValidation(currentCell, rowIdx, finalCol + 1);
    }
  }

  private moveKingTopDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    this.board.commonCellValidation(currentCell, rowIdx - 1, colIdx);
  }

  private moveKingBottomDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.board.cells[rowIdx][colIdx];
    this.board.commonCellValidation(currentCell, rowIdx + 1, colIdx);
  }

  public callKing(rowIdx: number, colIdx: number) {
    this.moveKingBottomDirection(rowIdx, colIdx);
    this.moveKingLeftDirection(rowIdx, colIdx);
    this.moveKingRightDirection(rowIdx, colIdx);
    this.moveKingTopDirection(rowIdx, colIdx);
  }
}
