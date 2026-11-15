import { BOARD_ROWS } from "../../constants";
import type { IBoardContext, IPawn } from "../types";
import { PieceType } from "../types";

export class Pawn implements IPawn {
  private board: IBoardContext;

  constructor(board: IBoardContext) {
    this.board = board;
  }

  private pawnCalculation(rowIdx: number, colIdx: number) {
    const currentCell = this.board.cells[rowIdx][colIdx];
    const side = currentCell.side;
    let row = rowIdx;
    const isInitial = side === "black" ? rowIdx === 1 : rowIdx === 6;
    const forward = side === "black" ? 1 : -1;
    const step = isInitial ? 2 * forward : 1 * forward;
    let walkingStep = Math.abs(step);
    while (row >= 0 && row < BOARD_ROWS && walkingStep > 0) {
      const nextCell = this.board.cells[row + forward][colIdx];
      if (nextCell.isEmpty) {
        nextCell.isHighLighted = true;
      } else {
        break;
      }
      row += forward;
      walkingStep--;
    }
    if (this.board.isValidPosition(rowIdx + forward, colIdx - 1)) {
      const adjacentCell = this.board.cells[rowIdx + forward][colIdx - 1];
      if (!adjacentCell.isEmpty && adjacentCell.side !== side) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }
    if (this.board.isValidPosition(rowIdx + forward, colIdx + 1)) {
      const adjacentCell = this.board.cells[rowIdx + forward][colIdx + 1];
      if (!adjacentCell.isEmpty && adjacentCell.side !== side) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }

    //enPassantChecks
    //Left side check -> Same Row and a row behind
    if (this.board.isValidPosition(rowIdx, colIdx - 1)) {
      const adjacentCell = this.board.cells[rowIdx][colIdx - 1];
      if (adjacentCell.piece === PieceType.PAWN) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }
    if (this.board.isValidPosition(rowIdx + forward * -1, colIdx - 1)) {
      const adjacentCell = this.board.cells[rowIdx + forward * -1][colIdx - 1];
      if (adjacentCell.piece === PieceType.PAWN) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }

    //Right side check -> Same Row and a row ahead
    if (this.board.isValidPosition(rowIdx + forward * -1, colIdx + 1)) {
      const adjacentCell = this.board.cells[rowIdx + forward * -1][colIdx + 1];
      if (adjacentCell.piece === PieceType.PAWN) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }
    if (this.board.isValidPosition(rowIdx, colIdx + 1)) {
      const adjacentCell = this.board.cells[rowIdx][colIdx + 1];
      if (adjacentCell.piece === PieceType.PAWN) {
        this.board.setCaptureable(adjacentCell, currentCell);
      }
    }
  }

  public callPawn(rowIdx: number, colIdx: number) {
    this.pawnCalculation(rowIdx, colIdx);
  }
}
