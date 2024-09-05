import {useState, useCallback, useEffect, useMemo} from 'react';
import {Board, CellProps, GridLoc } from "@/types/types";
import {
  calculateCompletion,
  countEmptyCells,
  deepCopy,
  getAllNotes,
  validateBoard,
  removeNotesAfterDigit,
  testMove, boardToString
} from "@/scripts/utils";
import {saveToLocalStorage, loadFromLocalStorage} from "@/scripts/persistence";
import {
  findNakedPairs,
  findNakedTriples,
  findPointingPairs,
  sudokuSolver,
  solveHiddenSingles,
  createHint
} from "@/scripts/solver";

// Initialize component with empty board so the UI does not flash
const emptyBoard: Board = [];
for (let r = 0; r < 9; r++) {
  emptyBoard.push([]);
  for(let c = 0; c < 9; c++) {
    emptyBoard[r].push({
      digit: 0,
      state: 'locked',
      notes: new Set()
    })
  }
}

export const useSudokuGame = (puzzle_id: string, initialBoardData: Board | {error: string}, solutionBoard: Board | {error: string}) => {
  const [boardData, setBoardData] = useState<Board>(emptyBoard);
  const [gameHistory, setGameHistory] = useState<Board[]>([]); // Allows the user to undo moves, TODO: Store in localStorage
  const [activeCell, setActiveCell] = useState<GridLoc>({r: 9, c: 9}); // Default to a Cell of the board
  const [hintCell, setHintCell] = useState<GridLoc | undefined>(undefined)
  const [cellToValidate, setCellToValidate] = useState<GridLoc>(); // In order to give the use a chance to fix a mistake we validate cells on the next move
  const [solvedBoard, setSolvedBoard] = useState(false); // Has the board been completed, will be set on load if a completed board is in localStorage
  const [notesActive, setNotesActive] = useState(false);
  const [errors, setErrors] = useState(0); // Number of errors made, stored in localStorage
  const [completion, setCompletion] = useState(0); // Percentage of puzzle completion
  const [hintLevel, setHintLevel] = useState(0) // Hint level has 3 settings, level 0 = highlight cell, 1 = explain strategy, 3 = fill in cell
  const [hint, setHint] = useState('');

  // To calculate the progress, find the number of empty cells in the original puzzle
  const emptyCells = useMemo(() =>
    !('error' in initialBoardData) ? countEmptyCells(initialBoardData) : 0,
    [initialBoardData]
  );

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

    // Test the last cell that was changed, this gives users a change to correct a mistake or typo
    if (!cellToValidate && solutionBoard || cellToValidate?.r != activeCell.r || cellToValidate.c != activeCell.c) {

      // Only attempt to validate if solutionBoard was found, change the cell state on an error found
      if (cellToValidate && solutionBoard) {
        if ( !testMove(solutionBoard as Board, cellToValidate, currentBoardData[cellToValidate.r][cellToValidate.c].digit) ) {
          currentBoardData[cellToValidate.r][cellToValidate.c].state = 'error';
          setErrors(errors + 1);

        }
      }

      // Update which cell needs to be validated on the next move
      setCellToValidate(activeCell);
    }

    // Update Cell data
    currentBoardData = removeNotesAfterDigit(currentBoardData, activeCell, digit);
    currentBoardData[activeCell.r][activeCell.c] = currentCellData;

    // Reset hints to prepare for the next Cell
    resetHintLevel()

    // Update the board
    updateBoardData(currentBoardData);
  }

  // Update a Cell state with a new note or remove a note
  const toggleNote = (digit: number) => {
    const currentBoardData = [...boardData];
    addMoveToHistory(deepCopy(boardData));
    const currentCellData = currentBoardData[activeCell.r][activeCell.c];

    // Add or remove the new note to the cell notes
    if (currentCellData.notes.has(digit)) {
      currentCellData.notes.delete(digit)
    } else {
      currentCellData.notes.add(digit)
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
    currentCellData.notes.clear();
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

  // Add all possible notes to each Cell
  const handleGetAllNotes = () => {
    const boardWithNotes = getAllNotes(boardData);
    if ('error' in boardWithNotes) {
      console.error('Error creating notes')
      return;
    }
    updateBoardData(boardWithNotes);
  }

  // Run the Sudoku solver to attempt the complete the board, can get stuck on evil puzzles
  const handleSolveBoard = () => {
    // Make sure there is a solution to test moves against
    // TODO: Not really necessary anymore as the solver can solve board without it
    if (!solutionBoard) {
      console.error('Not a valid solutionBoard to test against')
      return;
    }

    const completedBoard = sudokuSolver(boardData, solutionBoard as Board);
    if ('error' in completedBoard) {
      console.error('Error while solving the board');
      return;
    }

    // Log the board sequence to the console in case we need it for the solution
    boardToString(completedBoard)
    // Update the UI with the board filled in
    updateBoardData(completedBoard);
  }

  // Run a specific solving strategy in Debugging mode
  const handleStrategy = (strategy: string) => {
    let updatedBoard = boardData;
    switch(strategy){
      case 'hidden_singles':
        const single_result = solveHiddenSingles(boardData, solutionBoard as Board, false)
        updatedBoard = single_result.board!
        break;
      case 'naked_pairs':
        const pair_result = findNakedPairs(boardData)
        updatedBoard = pair_result.board!;
        break;
      case 'naked_triples':
        const triple_result = findNakedTriples(boardData)
        updatedBoard = triple_result.board;
        break
      case 'pointing_pairs':
        const pointed_result = findPointingPairs(boardData)
        updatedBoard = pointed_result.board;
        break
      default:
        return
    }

    updateBoardData(updatedBoard);
  }

  const requestHint = () => {
    const result = createHint(boardData, solutionBoard as Board)
    if ('error' in result) {
      console.error('Could not find a hint for this board')
      return;
    }
    const hintData = result[0];

    // At hint level 0 - Only indicate which cell the user should focus on
    if (hintLevel == 0) {
      setHintCell({r: hintData.r, c:hintData.c});
      setHint('')
    }
    // Hint level 1 - Give an idea of which strategy to use
    if (hintLevel == 1) {
      setHintCell({r: hintData.r, c: hintData.c});
      if (hintData.type == 'solve'){
        setHint('Only one digit is possible');
      } else if (hintData.type == 'hidden_single') {
        setHint('Only one digit is possible in this cell in this ' + hintData.direction)
      } else if (hintData.type == 'naked_pair') {
        setHint('There is a naked pair in this ' + hintData.direction)
      } else {
        console.error(`No hint available for ${hintData.type}`)
      }
    }
    // Hint level 2 - Give the actual answer for a cell and why
    if (hintLevel == 2) {
      setHintCell({r: hintData.r, c: hintData.c});
      if (hintData.type == 'solve') {
        setHint(`Only the digit ${hintData.digit} is possible`);
      } else if (hintData.type == 'hidden_single') {
        setHint(`Only the digit ${hintData.digit} is possible in this cell in this ` + hintData.direction)
      } else if (hintData.type == 'naked_pair') {
        // @ts-ignore TS fails to recognize digits here
        setHint(`There is a naked pair. Remove ${hintData.digits!.join(', ')} from cells in this block not in this ${hintData.direction}`)
      } else {
        console.error(`No hint available for ${hintData.type}`)
      }
    }
    setHintLevel(prevState =>  (prevState + 1) % 3)
  }

  const resetHintCell = () => {
    setHintCell(undefined)
    setHint('')
  }

  const resetHintLevel = () => {
    resetHintCell()
    setHintLevel(0)
  }

  return {
    boardData, setBoardData,
    activeCell,
    hintCell,
    solvedBoard,
    notesActive, setNotesActive,
    errors,
    completion,
    handleSetActiveCell,
    handleClickControlDigit,
    handleErase,
    handleUndoLastMove,
    handleGetAllNotes,
    handleSolveBoard,
    handleStrategy,
    requestHint,
    hint,
    resetHintCell,
  }
}