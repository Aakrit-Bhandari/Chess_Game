import { PieceType } from "./class/types";

export const BOARD_ROWS = 8;
export const BOARD_COLUMNS = 8;

export const initPieces: string[] = ["rook", "knight", "bishop"];
export const initPawn: string = "pawn";
export const initLeaders: string[] = ["queen", "king"];

export const AdvancedPiece = [
  PieceType.QUEEN,
  PieceType.ROOK,
  PieceType.BISHOP,
  PieceType.KNIGHT,
];
