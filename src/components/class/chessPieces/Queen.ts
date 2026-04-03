import type { IBishop, IQueen, IRook } from "../types";

export class Queen implements IQueen {
  public callQueen(
    rowIdx: number,
    colIdx: number,
    rook: IRook,
    bishop: IBishop,
  ): void {
    rook.callRook(rowIdx, colIdx);
    bishop.callBishop(rowIdx, colIdx);
  }
}
