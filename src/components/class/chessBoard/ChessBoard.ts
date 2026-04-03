import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  initLeaders,
  initPawn,
  initPieces,
} from "../../constants";
import { Bishop } from "../chessPieces/Bishop";
import { King } from "../chessPieces/King";
import { Knight } from "../chessPieces/Knight";
import { Pawn } from "../chessPieces/Pawn";
import { Queen } from "../chessPieces/Queen";
import { Rook } from "../chessPieces/Rook";
import type {
  IBishop,
  IChessCell,
  IGamePieces,
  IKing,
  IKnight,
  IPawn,
  IQueen,
  IRook,
} from "../types";

export class ChessBoard implements IGamePieces {
  private static instance: ChessBoard;

  public cells: IChessCell[][] = [];
  public pawn: IPawn;
  public rook: IRook;
  public knight: IKnight;
  public bishop: IBishop;
  public queen: IQueen;
  public king: IKing;

  private constructor() {
    this.initCells();
    this.fillBoardCells(0, "black", 1);
    this.fillBoardCells(BOARD_ROWS - 1, "white", -1);

    this.pawn = new Pawn(this);
    this.rook = new Rook(this);
    this.knight = new Knight(this);
    this.bishop = new Bishop(this);
    this.queen = new Queen();
    this.king = new King(this);
  }

  public static getInstance(): ChessBoard {
    if (!ChessBoard.instance) {
      ChessBoard.instance = new ChessBoard();
    }
    return ChessBoard.instance;
  }

  private initCells() {
    let darkCell: boolean = false;
    for (let i = 0; i < BOARD_ROWS; i++) {
      this.cells.push([]);
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        this.cells[i][j] = this.allocateCell(i, j, darkCell) as IChessCell;
        darkCell = !darkCell;
      }
      darkCell = !darkCell;
    }
  }

  private addPiece(side: string, piece: string, cell: IChessCell): IChessCell {
    cell.side = side as "black" | "white";
    cell.piece = piece as
      | "pawn"
      | "rook"
      | "knight"
      | "bishop"
      | "queen"
      | "king";
    cell.isEmpty = false;
    return cell;
  }

  private fillBoardCells(start: number, side: string, forward: number): void {
    let row = 0;
    let col = 0;

    for (col; col < BOARD_COLUMNS / 2 - 1; col++) {
      const end = BOARD_COLUMNS - row - 1;
      this.cells[start][col] = this.addPiece(
        side,
        initPieces[row],
        this.cells[start][col],
      );
      this.cells[start + forward][col] = this.addPiece(
        side,
        initPawn,
        this.cells[start + forward][col],
      );
      this.cells[start + forward][end] = this.addPiece(
        side,
        initPawn,
        this.cells[start + forward][end],
      );
      this.cells[start][end] = this.addPiece(
        side,
        initPieces[row],
        this.cells[start][end],
      );
      row++;
    }

    for (const leader of initLeaders) {
      this.cells[start][col] = this.addPiece(
        side,
        leader,
        this.cells[start][col],
      );
      this.cells[start + forward][col] = this.addPiece(
        side,
        initPawn,
        this.cells[start + forward][col],
      );
      col++;
    }
  }

  private allocateCell(
    row: number,
    col: number,
    plateColor: boolean,
  ): IChessCell {
    return {
      row: row,
      column: col,
      plateColor: plateColor,
      piece: "",
      isEmpty: true,
      isSelected: false,
      isHighLighted: false,
      isMovable: false,
      hasMoved: false,
      isCaptureable: false,
    } as IChessCell;
  }

  public resetPossibleMoves(): void {
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLUMNS; col++) {
        const cell = this.cells[row][col];
        cell.isCaptureable = false;
        cell.isHighLighted = false;
        cell.isSelected = false;
      }
    }
  }

  public isValidPosition(rowIdx: number, colIdx: number): boolean {
    return (
      rowIdx >= 0 &&
      rowIdx < BOARD_ROWS &&
      colIdx >= 0 &&
      colIdx < BOARD_COLUMNS
    );
  }

  public captureCell(currentCell: IChessCell, attackerCell: IChessCell): void {
    if (currentCell.side !== attackerCell.side && attackerCell.piece !== "") {
      currentCell.isCaptureable = true;
    }
  }

  public commonCellValidation(
    cell: IChessCell,
    rowIdx: number,
    colIdx: number,
  ): void {
    if (!this.isValidPosition(rowIdx, colIdx)) return;
    const currentCell = this.cells[rowIdx][colIdx];
    if (currentCell.isEmpty) {
      currentCell.isHighLighted = true;
    } else {
      this.captureCell(currentCell, cell);
    }
  }

  private checkIfPossible(targetCell: IChessCell, initialCell: IChessCell) {
    targetCell.piece = initialCell.piece;
    targetCell.side = initialCell.side;
    targetCell.isEmpty = false;
    initialCell.piece = "";
    initialCell.side = "";
    initialCell.isEmpty = true;
    targetCell.hasMoved = true;
    this.resetPossibleMoves();
  }

  private makeCapturePossible(
    targetCell: IChessCell,
    attackerCell: IChessCell,
  ): void {
    targetCell.piece = attackerCell.piece;
    attackerCell.piece = "";
    attackerCell.isEmpty = true;
    targetCell.side = attackerCell.side;
    attackerCell.side = "";
    targetCell.hasMoved = true;
    this.resetPossibleMoves();
  }

  private makeMove(rowIdx: number, colIdx: number) {
    const moveAbleCell = this.cells[rowIdx][colIdx];
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        const cell = this.cells[i][j];
        if (cell.isSelected && !cell.isEmpty) {
          this.checkIfPossible(moveAbleCell, cell);
          break;
        }
      }
    }
  }

  private makeCapture(rowIdx: number, colIdx: number): void {
    const capturableCell = this.cells[rowIdx][colIdx];
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLUMNS; j++) {
        const cell = this.cells[i][j];
        if (cell.isSelected) {
          this.makeCapturePossible(capturableCell, cell);
        }
      }
    }
  }

  public performCalculation(rowIdx: number, colIdx: number): boolean {
    const cell = this.cells[rowIdx][colIdx];
    console.log(cell);
    if (cell.isEmpty && cell.isHighLighted) {
      this.makeMove(rowIdx, colIdx);
      return true;
    }
    if (cell.isCaptureable) {
      this.makeCapture(rowIdx, colIdx);
      return true;
    }
    if (cell.isEmpty) {
      this.resetPossibleMoves();
      return false;
    }
    this.resetPossibleMoves();
    cell.isSelected = true;
    switch (cell.piece) {
      case "pawn":
        this.pawn.callPawn(rowIdx, colIdx);
        break;
      case "rook":
        this.rook.callRook(rowIdx, colIdx);
        break;
      case "knight":
        this.knight.callKnight(rowIdx, colIdx);
        break;
      case "bishop":
        this.bishop.callBishop(rowIdx, colIdx);
        break;
      case "queen":
        this.queen.callQueen(rowIdx, colIdx, this.rook, this.bishop);
        break;
      case "king":
        this.king.callKing(rowIdx, colIdx);
        break;
      default:
        break;
    }
    return false;
  }
}
