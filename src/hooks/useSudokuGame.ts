import {useState, useCallback, useEffect, useMemo} from 'react';
import {Board, Cell, GridLoc } from "@/types/types";
import {
  calculateCompletion,
  countEmptyCells,
  deepCopy,
  getAllNotes,
  validateBoard,
  removeNotesAfterDigit,
  testMove
} from "@/scripts/utils";
import {saveToLocalStorage, loadFromLocalStorage} from "@/scripts/persistence";
import {mediumSolver} from "@/scripts/solver";

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
      // Make sure we store the latest completion value in the localStorage too
      saveToLocalStorage(puzzle_id, {boardData: boardData, errors: errors, completion: 100});
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

  // Update a Cell state to a new digit & state,
  // validate the new digit with the solution
  const setDigit = (digit: number) => {
    let currentBoardData = [...boardData];
    addMoveToHistory(deepCopy(boardData));

    const currentCellData = currentBoardData[activeCell.r][activeCell.c];
    currentCellData.digit = (currentCellData.digit === digit) ? 0 : digit;
    currentCellData.state = 'free';

    if ( solutionBoard && currentCellData.digit !== 0){
      if ( testMove(solutionBoard, activeCell, digit) ) {
        currentCellData.state = 'error';
        setErrors(errors + 1)
      }
    }

    // Update Cell data
    currentBoardData = removeNotesAfterDigit(currentBoardData, activeCell, digit);
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

  const handleGetAllNotes = () => {
    const boardWithNotes = getAllNotes(boardData);
    if (!boardWithNotes) {
      console.error('Error creating notes')
      return;
    }
    console.log(boardWithNotes);
    updateBoardData(boardWithNotes);
  }

  const handleSolveBoard = () => {
    if (!solutionBoard) {
      console.error('Not a valid solutionBoard to test against')
      return;
    }

    const completedBoard = mediumSolver(boardData, solutionBoard);
    if (!completedBoard) {
      console.error('Error while solving the board');
      return;
    }
    updateBoardData(completedBoard);
  }

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
    handleUndoLastMove,
    handleGetAllNotes,
    handleSolveBoard
  }
}