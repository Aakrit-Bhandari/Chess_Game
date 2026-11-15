export interface IChessCell {
  piece: PieceType;
  side: IPlayerTurn;
  row: number;
  column: number;
  plateColor: boolean; //light true, dark false
  isEmpty: boolean;
  isSelected: boolean;
  isHighLighted: boolean;
  isMovable: boolean;
  isCaptureable: boolean;
  //en passant
  hasMoved: boolean;
  isEnPassant: boolean;
  cellData: string;
  isPinned: boolean;
}

export type IPlayerTurn = "white" | "black" | "";

export type PlayerTurn = Omit<IPlayerTurn, "">;

export enum PieceType {
  PAWN = "pawn",
  ROOK = "rook",
  QUEEN = "queen",
  KING = "king",
  BISHOP = "bishop",
  KNIGHT = "knight",
  EMPTY = "",
}

export interface IBoardContext {
  cells: IChessCell[][];
  isValidPosition(rowIdx: number, colIdx: number): boolean;
  setCaptureable(currentCell: IChessCell, attackerCell: IChessCell): void;
  commonCellValidation(cell: IChessCell, rowIdx: number, colIdx: number): void;
}

export interface IChessSide {
  isKingUnderAttack: boolean;
  // pathLeadingToKingCapture: [];
  // attackingPieceX: number;
  // attackingPieceY: number;
}

export interface IChessBoard extends IGamePieces {
  cells: IChessCell[][];
  whiteSide: IChessSide;
  blackSide: IChessSide;
}

export interface ICellData {
  side: IPlayerTurn;
  piece: PieceType;
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
