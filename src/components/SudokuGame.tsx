'use client';

import { useEffect } from 'react';
import SudokuBoard from "@/components/Board/SudokuBoard";
import Controls from "@/components/Controls/Controls";
import {useState} from "react";
import {GridLoc, History} from "@/types/types";

export default function SudokuGame({initialBoardData}: {initialBoardData: number[][]}){
  const notes:number[][][] = [];
  for (let row = 0; row < 9; row++) {
    notes[row] = [];
    for (let col = 0; col < 9; col++) {
      notes[row][col] = [];
    }
  }
  const [gameHistory, setGameHistory] = useState<History[]>([]);
  const [boardData, setBoardData] = useState<number[][]>([]);
  const [noteData, setNoteData] = useState(notes);
  const [notesActive, setNotesActive] = useState(false);
  const [activeCell, setActiveCell] = useState<GridLoc>({r: 9, c: 9});

  // Deep copy function to keep the initialBoardData clean
  const deepCopyBoard = (board: number[][]) => {
    return board.map(row => [...row]);
  }

  // Use useEffect to initialize boardData with a deep copy of initialBoardData
  useEffect(() => {
    setBoardData(deepCopyBoard(initialBoardData));
  }, [initialBoardData]);

  // Set a Cell as active, active means its value can be changed or erased
  const handleSetActiveCell = (newCell: GridLoc) => {
    setActiveCell(newCell);
  }

  const handleToggleNotesActive = () => {
    setNotesActive(!notesActive);
  }

  // Change a cell to a new digit,
  // Create a gameHistory entry
  const handleSetDigit = (digit: number) => {
    // Get the current board
    const currentBoard = boardData;
    const currentDigit = currentBoard[activeCell.r][activeCell.c];

    // Do not store the same move twice
    if (currentDigit == digit) {
      return;
    }

    if (initialBoardData[activeCell.r][activeCell.c] != 0) {
      return;
    }

    // Create a move object so we can store it later
    const newMove: History = {type: 'cell', cell: activeCell, notes: noteData[activeCell.r][activeCell.c], previousDigit: currentDigit, newDigit: digit};

    // Update the board with the new digit
    currentBoard[activeCell.r][activeCell.c] = digit;
    setBoardData([...currentBoard]);

    // Remove the notes
    eraseNotes();

    // Store the move in the game history, so we can revert later
    setGameHistory([...gameHistory, newMove]);
  }

  // Change the notes for a cell, does not create a
  const handleSetNote = (digit: number) => {
    const currentNotes = noteData;
    const currentNotesForCel = noteData[activeCell.r][activeCell.c];

    // Create a move object so we can store it later
    const newMove: History = {type: 'note', cell: activeCell, notes: currentNotesForCel, previousDigit: 0, newDigit: 0};
    // Store the move in the game history, so we can revert later
    setGameHistory([...gameHistory, newMove]);

    // Add or remove the new note to the cell notes
    if (currentNotesForCel.indexOf(digit) === -1) {
      currentNotes[activeCell.r][activeCell.c] = [...currentNotesForCel, digit];
    } else {
      currentNotes[activeCell.r][activeCell.c] = currentNotesForCel.filter((n) => n != digit);
    }

    // Update note data
    setNoteData([...currentNotes]);
  }

  const eraseNotes = () => {
    // Erase the notes
    const currentNotes = noteData;
    currentNotes[activeCell.r][activeCell.c] = [];

    // Update note data
    setNoteData([...currentNotes]);
  }

  // Remove a Digit and the notes of a cell
  const handleErase = () => {
    // Erase the digit
    handleSetDigit(0);

    eraseNotes();
  }

  // Depending on where notes are active mark Cell with new digit or handle the notes
  const handleClickedControlDigit = (digit: number) => {
    // Do not allow users to set a Digit unless a Cell was selected
    if (activeCell.r == 9){
      return;
    }

    if (notesActive) {
      handleSetNote(digit);
    } else {
      handleSetDigit(digit);
    }
  }

  // Use the gameHistory array to revert Cells to a previous state
  const handleUndoLastMove = () => {
    // Only allow last move if there are moves
    if (gameHistory.length == 0){
      return;
    }
    // Grab the data of the last move and remove it from the current gameHistory
    const currentGameHistory = gameHistory;
    const lastMove = currentGameHistory.pop();
    setGameHistory([...currentGameHistory]);

    // Make TS happy
    if(!lastMove){
      return;
    }

    if (lastMove.type == 'cell') {
      // Grab the current state of the board, revert the changed cell to its previous state and update the board
      const currentBoard = boardData;
      currentBoard[lastMove.cell.r][lastMove.cell.c] = lastMove.previousDigit;
      setBoardData([...currentBoard]);
    }
    if (lastMove.type == 'note' || lastMove.previousDigit === 0 || lastMove.newDigit === 0) {
      const currentNoteData = noteData;
      currentNoteData[lastMove.cell.r][lastMove.cell.c] = lastMove.notes;
      setNoteData([...currentNoteData]);
    }
  }

  return (
    <div className='flex gap-4'>
      <div>
        <div className="font-bold text-lg mb-4">Sudoku - Easy</div>
        <SudokuBoard
          boardData={boardData}
          notes={noteData}
          activeCell={activeCell}
          setActiveCell={(gridLoc) => handleSetActiveCell(gridLoc)}
        />
      </div>
      <div>
        <div className="font-bold text-lg mb-4">Controls</div>
        <Controls
          setDigit={(digit) => handleClickedControlDigit(digit)}
          handleToggleNotesActive={() => {handleToggleNotesActive()}}
          emptyCell={() => handleErase()}
          undoLastMove={() => handleUndoLastMove()}
          notesActive={notesActive}
        />
      </div>
    </div>
  )
}
