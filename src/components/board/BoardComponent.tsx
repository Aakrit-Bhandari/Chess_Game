import { useEffect, useMemo, useState } from "react";
import { ChessBoard } from "../class/chessBoard/ChessBoard";
import type { IPlayerTurn } from "../class/types";
import { BOARD_COLUMNS, BOARD_ROWS } from "../constants";
import styles from "./Board.module.css";
import MovesList from "./MovesList";
import SelectPiece from "./SelectPiece";
import { getCellData } from "./utils";

type GameState = "idle" | "running" | "paused" | "over";
type Tab = "play" | "rules";
type Side = "white" | "black";
interface IPromotion {
  row: number;
  col: number;
  side: Side;
}

const TIME_OPTIONS = [3, 5, 10, 15]; // minutes
const FILES = "abcdefgh";
const other = (s: Side): Side => (s === "white" ? "black" : "white");

const PIECE_LETTER: Record<string, string> = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
};
const square = (row: number, col: number) => `${FILES[col]}${BOARD_ROWS - row}`;

/** Short algebraic notation (no check marks or disambiguation) */
const notate = (
  piece: string,
  from: { r: number; c: number },
  to: { r: number; c: number },
  captured: boolean,
): string => {
  if (piece === "king" && Math.abs(to.c - from.c) === 2) {
    return to.c > from.c ? "O-O" : "O-O-O";
  }
  const isPawn = piece === "pawn";
  // a pawn that changes file is capturing, even en passant
  const x = captured || (isPawn && from.c !== to.c) ? "x" : "";
  const prefix = isPawn ? (x ? FILES[from.c] : "") : (PIECE_LETTER[piece] ?? "");
  return `${prefix}${x}${square(to.r, to.c)}`;
};

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function BoardComponent() {
  const board = useMemo(() => ChessBoard.getInstance(), []);
  const [playerTurn, setPlayerTurn] = useState<IPlayerTurn>("white");
  const [, forceRender] = useState(0);

  const [tab, setTab] = useState<Tab>("play");
  const [game, setGame] = useState<GameState>("idle");
  const [minutes, setMinutes] = useState(10);
  const [time, setTime] = useState({ white: 600, black: 600 });
  const [moveLog, setMoveLog] = useState<string[]>([]);
  const moves = moveLog.length;
  const [loser, setLoser] = useState<IPlayerTurn | null>(null);

  const [flipped, setFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [promo, setPromo] = useState<IPromotion | null>(null);

  // While a promotion is pending the turn has already passed, but the mover
  // is still choosing, so their clock keeps running.
  const clockSide: Side = promo ? other(promo.side) : (playerTurn as Side);

  useEffect(() => {
    if (game !== "running") return;
    const id = setInterval(() => {
      setTime((t) => {
        const left = t[clockSide] - 1;
        if (left <= 0) {
          setGame("over");
          setLoser(clockSide);
          return { ...t, [clockSide]: 0 };
        }
        return { ...t, [clockSide]: left };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [game, clockSide]);

  // SelectPiece announces its choice with a window event
  useEffect(() => {
    const onUpgrade = (e: Event) => {
      const { rowIdx, colIdx, piece } = (e as CustomEvent).detail as {
        rowIdx: number;
        colIdx: number;
        piece: string;
      };
      const b = board as unknown as {
        upgradePawn?: (r: number, c: number, p: string) => void;
      };
      if (b.upgradePawn) b.upgradePawn(rowIdx, colIdx, piece);
      else (board.cells[rowIdx][colIdx] as unknown as { piece: string }).piece = piece;
      // the promoting move is always the last one in the log
      const letter = PIECE_LETTER[piece.toLowerCase()] ?? "";
      setMoveLog((log) =>
        log.length ? [...log.slice(0, -1), `${log[log.length - 1]}=${letter}`] : log,
      );
      setPromo(null);
      forceRender((n) => n + 1);
    };
    window.addEventListener("upgradePawn", onUpgrade);
    return () => window.removeEventListener("upgradePawn", onUpgrade);
  }, [board]);

  // F flips the board
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !e.metaKey && !e.ctrlKey) setFlipped((f) => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** A pawn on the far rank (row 0 or last row) needs promoting */
  const findPromotion = (): IPromotion | null => {
    for (const row of [0, BOARD_ROWS - 1]) {
      for (let col = 0; col < BOARD_COLUMNS; col++) {
        const c = board.cells[row][col];
        if (c.side && String(c.piece).toLowerCase() === "pawn") {
          return { row, col, side: c.side as Side };
        }
      }
    }
    return null;
  };

  const performCalculation = (rowIdx: number, colIdx: number, side: IPlayerTurn): void => {
    if (game !== "running" || promo) return;
    const cell = board.cells[rowIdx][colIdx];
    if (side && side !== playerTurn && !cell.isCaptureable) return;
    // Read the selected square and target *before* the board changes
    let from: { r: number; c: number } | null = null;
    for (let r = 0; r < BOARD_ROWS && !from; r++) {
      for (let c = 0; c < BOARD_COLUMNS; c++) {
        if (board.cells[r][c].isSelected) {
          from = { r, c };
          break;
        }
      }
    }
    const movingPiece = from
      ? String(board.cells[from.r][from.c].piece).toLowerCase()
      : "";
    const captured = Boolean(cell.side);

    if (board.performCalculation(rowIdx, colIdx, side as Side)) {
      const next = other(playerTurn as Side);
      setPlayerTurn(next);
      if (from) {
        const entry = notate(movingPiece, from, { r: rowIdx, c: colIdx }, captured);
        setMoveLog((log) => [...log, entry]);
      }
      if (autoFlip) setFlipped(next === "black");
      setPromo(findPromotion());
    }
    forceRender((n) => n + 1);
  };

  const start = () => {
    setTime({ white: minutes * 60, black: minutes * 60 });
    setMoveLog([]);
    setLoser(null);
    setGame("running");
  };
  const stop = () => setGame("paused");
  const resume = () => setGame("running");

  const newGame = () => {
    // Needs an optional reset() on ChessBoard; falls back to a page reload.
    const b = board as unknown as { reset?: () => void };
    if (b.reset) {
      b.reset();
      setPlayerTurn("white");
      setMoveLog([]);
      setLoser(null);
      setPromo(null);
      setFlipped(false);
      setGame("idle");
      forceRender((n) => n + 1);
    } else {
      window.location.reload();
    }
  };

  const live = game === "running";
  const winner = loser ? (loser === "white" ? "Black" : "White") : null;
  const topSide: Side = flipped ? "white" : "black";

  const renderPlayer = (side: Side) => {
    const active = live && playerTurn === side && !promo;
    const left = time[side];
    return (
      <div className={`${styles.infoPanel} ${styles.playerCard} ${active ? styles.activePlayer : ""}`}>
        <div className={`${styles.playerAvatar} ${side === "white" ? styles.whiteAvatar : styles.blackAvatar}`}>
          {side === "white" ? "♔" : "♚"}
        </div>
        <div>
          <div className={styles.playerName}>{side === "white" ? "White" : "Black"}</div>
          <div className={styles.turnLabel}>{active ? "Your move" : "Waiting"}</div>
        </div>
        <div
          className={`${styles.playerClock} ${clockSide === side && live ? styles.runningClock : ""} ${left <= 30 && game !== "idle" ? styles.lowTimeClock : ""}`}
          aria-label={`${side} clock`}
        >
          {fmt(game === "idle" ? minutes * 60 : left)}
        </div>
      </div>
    );
  };

  // Display order → real board indices (this is the whole flip)
  const order = (n: number) =>
    Array.from({ length: n }, (_, i) => (flipped ? n - 1 - i : i));
  const rowOrder = order(BOARD_ROWS);
  const colOrder = order(BOARD_COLUMNS);

  return (
    <div className={styles.pageBackground}>
      <div className={`${styles.ambientGlow} ${styles.upperLeftGlow}`} />
      <div className={`${styles.ambientGlow} ${styles.lowerRightGlow}`} />

      <div className={styles.gameWindow}>
        <div className={styles.titleBar}>
          <div className={styles.windowControls} role="group" aria-label="Window controls">
            <button className={`${styles.windowControl} ${styles.stopControl}`} aria-label="Stop game" onClick={stop} />
            <button className={`${styles.windowControl} ${styles.pauseControl}`} aria-label="Pause game" onClick={stop} />
            <button className={`${styles.windowControl} ${styles.resumeControl}`} aria-label="Resume game" onClick={resume} />
          </div>
          <div className={styles.tabBar} role="tablist">
            {(["play", "rules"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`${styles.tab} ${tab === t ? styles.activeTab : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "play" ? "Play" : "How to play"}
              </button>
            ))}
          </div>
          <div className={styles.windowTitle}>Chess — Local game</div>
        </div>

        {tab === "rules" ? (
          <ol className={styles.howToPlay}>
            <h2>How to play</h2>
            <li><b>White moves first.</b> Press Start game to begin the clocks.</li>
            <li>Click a piece to see its moves. Dots are open squares; red rings are captures.</li>
            <li>Click a highlighted square to move. Turns alternate automatically.</li>
            <li>When a pawn reaches the far side, pick the piece it becomes.</li>
            <li>Flip board (or press F) turns the board around. Turn on Auto-flip to rotate it after every move.</li>
            <li>Stop pauses the game and locks the board. If your clock runs out, you lose on time.</li>
          </ol>
        ) : (
          <div className={styles.playLayout}>
            <div className={styles.boardFrame}>
              <div className={styles.boardStage}>
                <div className={`${styles.chessBoard} ${live && !promo ? "" : styles.boardLocked}`}>
                  {rowOrder.map((rowIndex, dRow) =>
                    colOrder.map((colIndex, dCol) => {
                      const { side, piece, highLighted, isCaptureable, darkCell, selected } =
                        getCellData(board.cells[rowIndex][colIndex]);
                      const coords = (
                        <>
                          {dCol === 0 && <span className={styles.rankLabel}>{BOARD_ROWS - rowIndex}</span>}
                          {dRow === BOARD_ROWS - 1 && <span className={styles.fileLabel}>{FILES[colIndex]}</span>}
                        </>
                      );
                      return side ? (
                        <div
                          className={`${styles.square} ${isCaptureable ? styles.captureTarget : ""} ${darkCell ? styles.darkSquare : ""} ${selected ? styles.selectedSquare : ""}`}
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => performCalculation(rowIndex, colIndex, side)}
                        >
                          {coords}
                          <div
                            className={styles.chessPiece}
                            style={{
                              backgroundImage: `url(${new URL(`../../assets/${side}_${piece}.png`, import.meta.url).href})`,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => performCalculation(rowIndex, colIndex, side)}
                          className={`${styles.square} ${highLighted ? styles.legalMove : ""} ${darkCell ? styles.darkSquare : ""}`}
                          key={`${rowIndex}-${colIndex}`}
                        >
                          {coords}
                        </div>
                      );
                    }),
                  )}
                </div>

                {promo && live && (
                  <SelectPiece
                    rowIndex={promo.row}
                    colIndex={promo.col}
                    side={promo.side}
                    flipped={flipped}
                  />
                )}

                {game !== "running" && (
                  <div className={styles.boardMessage}>
                    {game === "idle" && (<><h2>Ready when you are</h2><p>Pick a time and press Start game.</p></>)}
                    {game === "paused" && (<><h2>Game paused</h2><p>The board is locked until you resume.</p></>)}
                    {game === "over" && (<><h2>{winner} wins on time</h2><p>Start a new game to play again.</p></>)}
                  </div>
                )}
              </div>
            </div>

            <aside className={styles.sidebar}>
              {renderPlayer(topSide)}

              <div className={styles.infoPanel}>
                <h3 className={styles.sectionHeading}>Time per player</h3>
                <div className={styles.timeChoices}>
                  {TIME_OPTIONS.map((m) => (
                    <button
                      key={m}
                      disabled={game !== "idle"}
                      className={`${styles.timeChoice} ${minutes === m ? styles.selectedTime : ""}`}
                      onClick={() => setMinutes(m)}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.infoPanel}>
                <h3 className={styles.sectionHeading}>Board</h3>
                <button className={`${styles.actionButton} ${styles.flipButton}`} onClick={() => setFlipped((f) => !f)}>
                  Flip board
                </button>
                <div className={styles.settingRow}>
                  <span id="autoflip-label">Auto-flip after each move</span>
                  <button
                    role="switch"
                    aria-checked={autoFlip}
                    aria-labelledby="autoflip-label"
                    className={`${styles.autoFlipToggle} ${autoFlip ? styles.autoFlipOn : ""}`}
                    onClick={() => {
                      setAutoFlip((a) => !a);
                      if (!autoFlip) setFlipped(playerTurn === "black");
                    }}
                  />
                </div>
              </div>

              <MovesList moves={moveLog} />

              <div className={`${styles.infoPanel} ${styles.statusPanel}`}>
                <span className={`${styles.statusDot} ${live ? styles.liveStatusDot : ""}`} />
                {game === "idle" && "Not started"}
                {game === "running" && (promo ? "Choose a promotion" : `${playerTurn === "white" ? "White" : "Black"} to move`)}
                {game === "paused" && "Paused"}
                {game === "over" && "Game over"}
                <span className={styles.moveCount}>{moves} moves</span>
              </div>

              {renderPlayer(other(topSide))}

              <div className={styles.actionBar}>
                {game === "idle" && (
                  <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={start}>Start game</button>
                )}
                {game === "running" && (
                  <button className={`${styles.actionButton} ${styles.stopButton}`} onClick={stop}>Stop game</button>
                )}
                {game === "paused" && (
                  <div className={styles.buttonRow}>
                    <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={resume}>Resume</button>
                    <button className={styles.actionButton} onClick={newGame}>New game</button>
                  </div>
                )}
                {game === "over" && (
                  <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={newGame}>New game</button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}