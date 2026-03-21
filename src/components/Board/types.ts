export interface IChessCell {
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "";
  side: "black" | "white" | "";
  row: number;
  column: number;
  plateColor:boolean;//light true, dark false
  isEmpty: boolean;
  isSelected: boolean;
  isHighLighted: boolean;
  isMovable: boolean;
  isCaptureable: boolean;
}

export interface IChessBoard {
  cells: IChessCell[][];
}

export interface ICellData {
  side: "black" | "white" | "";
  piece: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | "";
  isCaptureable: boolean;
  highLighted: boolean;
  darkCell: boolean;
  selected:boolean;
}
