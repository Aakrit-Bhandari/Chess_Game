import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  initLeaders,
  initPawn,
  initPieces,
} from "../constants";
import type { IChessCell } from "./types";
export class ChessBoard {
  public cells: IChessCell[][] = [];
  constructor() {
    this.initCells();
    this.fillBoardCells(0, "black", 1);
    this.fillBoardCells(BOARD_ROWS - 1, "white", -1);
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
      //Fill front
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
      //Fill back
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
    //Fill Leader

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
      isCaptureable: false,
    } as IChessCell;
  }
  //Reset the grid when new Cell is selected
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
  //Check Possiblities
  private isValidPosition(rowIdx: number, colIdx: number): boolean {
    return (
      rowIdx >= 0 &&
      rowIdx < BOARD_ROWS &&
      colIdx >= 0 &&
      colIdx < BOARD_COLUMNS
    );
  }
  private captureCell(currentCell: IChessCell, attackerCell: IChessCell): void {
    if (currentCell.side !== attackerCell.side && attackerCell.piece !== "") {
      currentCell.isCaptureable = true;
    }
  }
  private commonCellValidation(
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

  //Possible paths
  //King Path
  private moveKingLeftDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    const finalCol = colIdx - 1;
    this.commonCellValidation(currentCell, rowIdx, finalCol);
    this.commonCellValidation(currentCell, rowIdx + 1, finalCol);
    this.commonCellValidation(currentCell, rowIdx - 1, finalCol);
  }
  private moveKingRightDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    const finalCol = colIdx + 1;
    this.commonCellValidation(currentCell, rowIdx, finalCol);
    this.commonCellValidation(currentCell, rowIdx + 1, finalCol);
    this.commonCellValidation(currentCell, rowIdx - 1, finalCol);
  }
  private moveKingTopDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    this.commonCellValidation(currentCell, rowIdx - 1, colIdx);
  }
  private moveKingBottomDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    this.commonCellValidation(currentCell, rowIdx + 1, colIdx);
  }
  //Rook and Queen path
  private moveBottomDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    //move bottom until the end of the board or a non-empty cell is encountered
    for (let i = rowIdx + 1; i < BOARD_ROWS; i++) {
      const cell = this.cells[i][colIdx];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveTopDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (let i = rowIdx - 1; i >= 0; i--) {
      const cell = this.cells[i][colIdx];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveLeftDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (let i = colIdx - 1; i >= 0; i--) {
      const cell = this.cells[rowIdx][i];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveRightDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (let i = colIdx + 1; i < BOARD_COLUMNS; i++) {
      const cell = this.cells[rowIdx][i];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  //Bishop and Queen path
  private moveLeftTopDiagonalDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (let i = rowIdx - 1, j = colIdx - 1; i >= 0 && j >= 0; i--, j--) {
      const cell = this.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveLeftBottomDiagonalDirection(
    rowIdx: number,
    colIdx: number,
  ): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (
      let i = rowIdx + 1, j = colIdx - 1;
      i < BOARD_ROWS && j >= 0;
      i++, j--
    ) {
      const cell = this.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveRightBottomDiagonalDirection(
    rowIdx: number,
    colIdx: number,
  ): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (
      let i = rowIdx + 1, j = colIdx + 1;
      i < BOARD_ROWS && j < BOARD_COLUMNS;
      i++, j++
    ) {
      const cell = this.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  private moveRightTopDiagonalDirection(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    for (
      let i = rowIdx - 1, j = colIdx + 1;
      i >= 0 && j < BOARD_COLUMNS;
      i--, j++
    ) {
      const cell = this.cells[i][j];
      if (cell.isEmpty) {
        cell.isHighLighted = true;
      } else {
        this.captureCell(cell, currentCell);
        break;
      }
    }
  }
  //Knight path
  private knightCommonCalculation(
    rowIdx: number,
    colIdx: number,
    attackerCell: IChessCell,
  ): void {
    if (this.isValidPosition(rowIdx, colIdx)) {
      const attackedCell = this.cells[rowIdx][colIdx];
      if (attackedCell.isEmpty) {
        attackedCell.isHighLighted = true;
      }
      this.captureCell(attackedCell, attackerCell);
    }
  }
  private moveToBottomLeftDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.cells[rowIdx][colIdx];

    const firstBottom = rowIdx + dir[0];
    const secondBottom = rowIdx + dir[1];

    const firstLeft = colIdx + dir[3];
    const secondLeft = colIdx + dir[2];
    this.knightCommonCalculation(firstBottom, firstLeft, currentCell);
    this.knightCommonCalculation(secondBottom, secondLeft, currentCell);
  }
  private moveToBottomRightDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.cells[rowIdx][colIdx];
    const firstBottom = rowIdx + dir[0];
    const secondBottom = rowIdx + dir[1];

    const firstRight = colIdx + dir[1];
    const seconRight = colIdx + dir[0];
    //
    this.knightCommonCalculation(firstBottom, firstRight, currentCell);
    this.knightCommonCalculation(secondBottom, seconRight, currentCell);
  }
  private moveToTopLeftDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.cells[rowIdx][colIdx];
    const firstTop = rowIdx + dir[2];
    const secondTop = rowIdx + dir[3];

    const firstLeft = colIdx + dir[3];
    const secondLeft = colIdx + dir[2];
    this.knightCommonCalculation(firstTop, firstLeft, currentCell);
    this.knightCommonCalculation(secondTop, secondLeft, currentCell);
  }
  private moveToTopRightDirection(rowIdx: number, colIdx: number): void {
    const dir = [1, 2, -1, -2];
    const currentCell = this.cells[rowIdx][colIdx];
    const firstTop = rowIdx + dir[2];
    const secondTop = rowIdx + dir[3];

    const firstRight = colIdx + dir[1];
    const secondRight = colIdx + dir[0];
    this.knightCommonCalculation(firstTop, firstRight, currentCell);
    this.knightCommonCalculation(secondTop, secondRight, currentCell);
  }
  //Pawn path
  private pawnCalculation(rowIdx: number, colIdx: number): void {
    const currentCell = this.cells[rowIdx][colIdx];
    const side = currentCell.side;
    let row = rowIdx;
    const isInitial = side === "black" ? rowIdx === 1 : rowIdx === 6;
    const forward = side === "black" ? 1 : -1;
    const step = isInitial ? 2 * forward : 1 * forward;
    let walkingStep = Math.abs(step);
    while (row >= 0 && row < BOARD_ROWS && walkingStep > 0) {
      const nextCell = this.cells[row + forward][colIdx];
      if (nextCell.isEmpty) {
        nextCell.isHighLighted = true;
      } else {
        break;
      }
      row += forward;
      walkingStep--;
    }
    if (this.isValidPosition(rowIdx + forward, colIdx - 1)) {
      const adjacentCell = this.cells[rowIdx + forward][colIdx - 1];
      if (!adjacentCell.isEmpty && adjacentCell.side !== side) {
        this.captureCell(adjacentCell, currentCell);
      }
    }
    if (this.isValidPosition(rowIdx + forward, colIdx + 1)) {
      const adjacentCell = this.cells[rowIdx + forward][colIdx + 1];
      if (!adjacentCell.isEmpty && adjacentCell.side !== side) {
        this.captureCell(adjacentCell, currentCell);
      }
    }
  }
  //Make Moves
  private checkIfPossible(targetCell: IChessCell, initialCell: IChessCell) {
    targetCell.piece = initialCell.piece;
    targetCell.side = initialCell.side;
    targetCell.isEmpty = false;
    initialCell.piece = "";
    initialCell.side = "";
    initialCell.isEmpty = true;
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
  //Calculation of paths and captures in
  public performCalculation(rowIdx: number, colIdx: number): boolean {
    const cell = this.cells[rowIdx][colIdx];
    console.log(cell);
    if (cell.isEmpty && cell.isHighLighted) {
      console.log("makemove");
      this.makeMove(rowIdx, colIdx);
      return true;
    }
    if (cell.isCaptureable) {
      console.log("makecapture");
      this.makeCapture(rowIdx, colIdx);
      return true;
    }
    if (cell.isEmpty) {
      console.log("resetpossiblemoves");
      this.resetPossibleMoves();
      return false;
    }
    this.resetPossibleMoves();
    console.log("resetpossiblemoves");
    cell.isSelected = true;
    switch (cell.piece) {
      case "pawn":
        this.pawnCalculation(rowIdx, colIdx);
        break;
      case "rook":
        this.rookCalculation(rowIdx, colIdx);
        break;
      case "knight":
        this.knightCalculation(rowIdx, colIdx);
        break;
      case "bishop":
        this.bishopCalculation(rowIdx, colIdx);
        break;
      case "queen":
        this.queenCalculation(rowIdx, colIdx);
        break;
      case "king":
        this.kingCalculation(rowIdx, colIdx);
        break;
      default:
        break;
    }
    return false;
  }

  private rookCalculation(rowIdx: number, colIdx: number): void {
    this.moveBottomDirection(rowIdx, colIdx);
    this.moveTopDirection(rowIdx, colIdx);
    this.moveLeftDirection(rowIdx, colIdx);
    this.moveRightDirection(rowIdx, colIdx);
  }
  private knightCalculation(rowIdx: number, colIdx: number): void {
    this.moveToBottomLeftDirection(rowIdx, colIdx);
    this.moveToBottomRightDirection(rowIdx, colIdx);
    this.moveToTopRightDirection(rowIdx, colIdx);
    this.moveToTopLeftDirection(rowIdx, colIdx);
  }
  private bishopCalculation(rowIdx: number, colIdx: number): void {
    this.moveLeftTopDiagonalDirection(rowIdx, colIdx);
    this.moveLeftBottomDiagonalDirection(rowIdx, colIdx);
    this.moveRightTopDiagonalDirection(rowIdx, colIdx);
    this.moveRightBottomDiagonalDirection(rowIdx, colIdx);
  }
  private queenCalculation(rowIdx: number, colIdx: number): void {
    this.rookCalculation(rowIdx, colIdx);
    this.bishopCalculation(rowIdx, colIdx);
  }
  private kingCalculation(rowIdx: number, colIdx: number): void {
    this.moveKingLeftDirection(rowIdx, colIdx);
    this.moveKingRightDirection(rowIdx, colIdx);
    this.moveKingTopDirection(rowIdx, colIdx);
    this.moveKingBottomDirection(rowIdx, colIdx);
  }
}
