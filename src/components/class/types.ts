export interface IChessCell {
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "";
  side: "black" | "white" | "";
  row: number;
  column: number;
  plateColor: boolean; //light true, dark false
  isEmpty: boolean;
  isSelected: boolean;
  isHighLighted: boolean;
  isMovable: boolean;
  isCaptureable: boolean;
  hasMoved: boolean;
}

export type IPlayerTurn = "white" | "black" | "";

export interface IBoardContext {
  cells: IChessCell[][];
  isValidPosition(rowIdx: number, colIdx: number): boolean;
  captureCell(currentCell: IChessCell, attackerCell: IChessCell): void;
  commonCellValidation(cell: IChessCell, rowIdx: number, colIdx: number): void;
}

export interface IChessBoard extends IGamePieces {
  cells: IChessCell[][];
}

export interface ICellData {
  side: "black" | "white" | "";
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "";
  isCaptureable: boolean;
  highLighted: boolean;
  darkCell: boolean;
  selected: boolean;
}

export interface IGamePieces {
  pawn: IPawn;
  bishop: IBishop;
  queen: IQueen;
  king: IKing;
  knight: IKnight;
  rook: IRook;
}

export interface IPawn {
  callPawn: (rowIdx: number, colIdx: number) => void;
}

export interface IBishop {
  callBishop: (rowIdx: number, colIdx: number) => void;
}

export interface IQueen {
  callQueen: (
    rowIdx: number,
    colIdx: number,
    rook: IRook,
    bishop: IBishop,
  ) => void;
}

export interface IKing {
  callKing: (rowIdx: number, colIdx: number) => void;
}

export interface IKnight {
  callKnight: (rowIdx: number, colIdx: number) => void;
}

export interface IRook {
  callRook: (rowIdx: number, colIdx: number) => void;
}
