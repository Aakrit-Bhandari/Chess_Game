import type { ICellData, IChessCell } from "./types";

export const getCellData = (cell: IChessCell): ICellData => {
  const side = cell.side;
  const piece = cell.piece;
  const darkCell = cell.plateColor;
  const isCaptureable = cell.isCaptureable;
  const highLighted = cell.isHighLighted;
  const selected = cell.isSelected;
  return { side, piece, isCaptureable, highLighted, darkCell, selected };
};
