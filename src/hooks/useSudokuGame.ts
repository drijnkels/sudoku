import {useState, useCallback, useEffect} from 'react';
import {Board, GridLoc, History, Puzzle, Solution} from "@/types/types";
import {calculateCompletion, validateBoard,} from "@/scripts/utils";

export const useSudokuGame = (initialBoardData: Board | false, puzzle: Puzzle, solution: Solution) => {


  return {
    // completion,
    // noteData,
    // notesActive,
    // errors,
    // numErrors,
    // handleToggleNotesActive,
    // handleErase,
    // handleClickedControlDigit,
    // handleUndoLastMove,
  }
}