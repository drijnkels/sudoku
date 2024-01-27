import {useState, useCallback, useEffect, useMemo} from 'react';
import {Board, Cell, GridLoc } from "@/types/types";
import {calculateCompletion, countEmptyCells, deepCopy, validateBoard,} from "@/scripts/utils";
import {saveToLocalStorage, loadFromLocalStorage} from "@/scripts/persistence";

// Initialize component with empty board so the UI does not flash
const emptyBoard: Cell[][] = [];
for (let r = 0; r < 9; r++) {
  emptyBoard.push([]);
  for(let c = 0; c < 9; c++) {
    emptyBoard[r].push({
      digit: 0,
      state: 'locked',
      notes: []
    })
  }
}

export const useSudokuGame = (puzzle_id: string, initialBoardData: Board | false, solutionBoard: Board | false) => {
  const [boardData, setBoardData] = useState<Board>(emptyBoard);
  const [gameHistory, setGameHistory] = useState<Board[]>([]);
  const [activeCell, setActiveCell] = useState<GridLoc>({r: 9, c: 9});
  const [solvedBoard, setSolvedBoard] = useState(false);
  const [notesActive, setNotesActive] = useState(false);
  const [errors, setErrors] = useState(0);
  const [completion, setCompletion] = useState(0);

  const emptyCells = useMemo(() => countEmptyCells(initialBoardData), [initialBoardData]);

  // Use useEffect to initialize boardData with a deep copy of initialBoardData or localStorage if available
  useEffect(() => {
    const savedBoardState = loadFromLocalStorage(puzzle_id);
    if (initialBoardData && !savedBoardState) {
      setBoardData(deepCopy(initialBoardData));
    } else if (savedBoardState) {
      setBoardData(deepCopy(savedBoardState.boardData));
      setErrors(savedBoardState.errors);
      setCompletion(savedBoardState.completion);
    }
  }, []);

  // Update the completion percentage whenever boardData changes
  useEffect(() => {
    if (initialBoardData) {
      setCompletion(calculateCompletion(emptyCells, boardData));
    }
  }, [boardData]);

  // If completion is 100% mark the board as solved no more changes can be done to the board after this
  useEffect(() => {
    if ( completion > 99 ) {
      setSolvedBoard(validateBoard(boardData));
    }
  }, [completion, boardData]);

  // Set a Cell as active, active means its value can be changed, erased or its notes can be changed
  const handleSetActiveCell = useCallback((newCell: GridLoc) => {
    setActiveCell(newCell);
  }, [])

  // Add a boardState to the gameHistory so that we can use the undo button, does not persist between page loads
  const addMoveToHistory = useCallback((prevBoardState: Board) => {
    const currentHistory = [...gameHistory];
    setGameHistory([...currentHistory, prevBoardState]);
  }, [gameHistory])

  // Handle updating the board state and save the previous boardState, errors + completion to localStorage
  const updateBoardData = (newBoardState: Board) => {
    setBoardData([...newBoardState]);

    saveToLocalStorage(puzzle_id, {boardData: boardData, errors: errors, completion: completion});
  }

  // When a digit is placed in a Cell remove all notes of the given digit from Cells 0n:
  // the same row, same column and in the same square
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

  // Update a Cell state to a new digit & state,
  // validate the new digit with the solution
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

    // Update Cell data
    currentBoardData = removeNotesAfterDigit(currentBoardData, digit);
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;

    // Update the board
    updateBoardData(currentBoardData);
  }

  // Update a Cell state with a new note or remove a note
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

    // Update Cell data
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;

    // Update the board
    updateBoardData(currentBoardData);
  }

  // When a digit on the Controls is clicked and a valid Cell is selected:
  // Either change the value of the cell or the notes of the cell
  // Will block is a change is not permitted
  const handleClickControlDigit = (digit: number) => {
    // If no cell is selected or the board is solved block any changes
    if (activeCell.r === 9 || solvedBoard) {
      return;
    }

    const currentCellData = boardData[activeCell.r][activeCell.c];
    // Cannot edit locked cells
    if (currentCellData.state == 'locked') {
      return;
    }

    // If notes are active change the notes on a Cell otherwise change the digit
    if (notesActive) {
      toggleNote(digit);
    } else {
      setDigit(digit);
    }
  }

  // Reset a Cell state back to empty and free, blocks on game data cells
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

    // Update the board
    updateBoardData(currentBoardData);
  }

  // Grab the latest boardState from the history and restore boardState to this state
  // Removes the state from the game history
  const handleUndoLastMove = useCallback(() => {
    const currentHistory = [...gameHistory];
    const lastBoardState = currentHistory.pop();
    if (gameHistory.length === 0 || activeCell.r === 9 || !lastBoardState || solvedBoard) {
      return;
    }

    setGameHistory([...currentHistory]);

    // Update the board
    updateBoardData(lastBoardState);
  }, [activeCell, gameHistory, solvedBoard])

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