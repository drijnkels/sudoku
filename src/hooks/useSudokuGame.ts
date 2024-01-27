import {useState, useCallback, useEffect, useMemo} from 'react';
import {Board, Cell, GridLoc } from "@/types/types";
import {calculateCompletion, countEmptyCells, deepCopy, validateBoard,} from "@/scripts/utils";

export const useSudokuGame = (initialBoardData: Board | false, solutionBoard: Board | false) => {
  const [boardData, setBoardData] = useState<Board>([]);
  const [gameHistory, setGameHistory] = useState<Board[]>([]);
  const [activeCell, setActiveCell] = useState<GridLoc>({r: 9, c: 9});
  const [solvedBoard, setSolvedBoard] = useState(false);
  const [notesActive, setNotesActive] = useState(false);
  const [errors, setErrors] = useState(0);
  const [completion, setCompletion] = useState(0);

  const emptyCells = useMemo(() => countEmptyCells(initialBoardData), [initialBoardData]);

  useEffect(() => {
    if ( completion > 99 ) {
      setSolvedBoard(validateBoard(boardData));
    }
  }, [completion, boardData]);

  // Set a Cell as active, active means its value can be changed or erased
  const handleSetActiveCell = useCallback((newCell: GridLoc) => {
    setActiveCell(newCell);
  }, [])

  const recalculateCompletion = useCallback(() => {
    if (initialBoardData) {
      setCompletion(calculateCompletion(emptyCells, boardData));
    }
  }, [initialBoardData, emptyCells, boardData])

  // Add a boardState to the gameHistory
  const addMoveToHistory = useCallback((prevBoardState: Board) => {
    const currentHistory = [...gameHistory];
    setGameHistory([...currentHistory, prevBoardState]);
  }, [gameHistory])

  // When a digit is placed in a Cell remove all notes of the given digit from the notes in
  // Cells on the same row, column and square
  const removeNotesAfterDigit = useCallback((currentBoardData: Cell[][], digit: number) => {
    // remove digit out of row
    for (let c = 0; c < currentBoardData[activeCell.r].length; c++) {
      currentBoardData[activeCell.r][c].notes = currentBoardData[activeCell.r][c].notes.filter((n) => n != digit);
    }
    // Remove digit out of column
    for (let r = 0; r < currentBoardData.length; r++) {
      currentBoardData[r][activeCell.c].notes = currentBoardData[r][activeCell.c].notes.filter((n) => n != digit);
    }

    // Remove notes out of the square
    const first_r = Math.floor(activeCell.r / 3) * 3;
    const first_c = Math.floor(activeCell.c / 3) * 3;
    for (let r = first_r; r < first_r + 3; r++) {
      for (let c = first_c; c < first_c + 3; c++) {
        currentBoardData[r][c].notes = currentBoardData[r][c].notes.filter((n) => n != digit);
      }
    }

    return currentBoardData;
  }, [activeCell])

  // Change a cell's value to a new digit
  const setDigit = (digit: number) => {
    let currentBoardData = [...boardData];
    addMoveToHistory(deepCopy(boardData));

    const currentCellData = currentBoardData[activeCell.r][activeCell.c];
    currentCellData.digit = (currentCellData.digit === digit) ? 0 : digit;
    currentCellData.state = 'free';

    if ( solutionBoard ){
      if (solutionBoard[activeCell.r][activeCell.c].digit !== digit && currentCellData.digit !== 0) {
        currentCellData.state = 'error';
        setErrors(errors + 1)
      }
    }

    currentBoardData = removeNotesAfterDigit(currentBoardData, digit);

    // Update the board
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;
    setBoardData([...currentBoardData]);

    recalculateCompletion()
  }

  // Toggle a note on a cell
  const toggleNote = (digit: number) => {
    const currentBoardData = [...boardData];
    addMoveToHistory(deepCopy(boardData));
    const currentCellData = currentBoardData[activeCell.r][activeCell.c];

    // Add or remove the new note to the cell notes
    if (currentCellData.notes.indexOf(digit) === -1) {
      currentCellData.notes = [...currentCellData.notes, digit];
    } else {
      currentCellData.notes = currentCellData.notes.filter((n) => n != digit);
    }

    // Update the board
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;
    setBoardData([...currentBoardData]);
  }

  // When a digit on the Controls is clicked and a valid Cell is selected
  // Either change the value of the cell or the notes of the cell
  const handleClickControlDigit = (digit: number) => {
    const currentCellData = boardData[activeCell.r][activeCell.c];
    // Cannot edit locked cells or if no cell is selected or if the game is finished
    if (currentCellData.state == 'locked' || activeCell.r === 9 || solvedBoard) {
      return;
    }
    if (notesActive) {
      toggleNote(digit);
    } else {
      setDigit(digit);
    }
  }

  // Remove all data from a Cell
  const handleErase = () => {
    const currentBoardData = [...boardData];
    const currentCellData = currentBoardData[activeCell.r][activeCell.c];

    // Cannot erase Game data or once the board is solved
    if (currentCellData.state === 'locked' || solvedBoard) {
      return;
    }
    addMoveToHistory(deepCopy(boardData));

    currentCellData.digit = 0;
    currentCellData.notes = [];
    currentCellData.state = 'free';
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;

    setBoardData([...currentBoardData]);
  }

  // Restore the board state to a previous state
  const handleUndoLastMove = useCallback(() => {
    const currentHistory = [...gameHistory];
    const lastBoardState = currentHistory.pop();
    if (gameHistory.length === 0 || activeCell.r === 9 || !lastBoardState || solvedBoard) {
      return;
    }

    setGameHistory([...currentHistory]);
    setBoardData([...lastBoardState]);

    recalculateCompletion()
  }, [activeCell, gameHistory, solvedBoard, recalculateCompletion])

  return {
    boardData, setBoardData,
    activeCell,
    solvedBoard,
    notesActive, setNotesActive,
    errors,
    completion,
    handleSetActiveCell,
    handleClickControlDigit,
    handleErase,
    handleUndoLastMove
  }
}