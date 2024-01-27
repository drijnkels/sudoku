'use client';
import React, { useEffect } from "react";
import { deepCopy, stringToBoard } from "@/scripts/utils";
import { Board, Puzzle, Solution } from "@/types/types";
import { useSudokuGame } from '@/hooks/useSudokuGame';
import { clearPuzzleProgress } from "@/scripts/persistence";

import SudokuBoard from "@/components/Board/SudokuBoard";
import Controls from "@/components/Controls/Controls";
import { NotesContext } from "@/Context/NotesContext";

type SudokuGame = {
  title: string,
  puzzle: Puzzle,
  solution: Solution,
}

export default function SudokuGame({ title, puzzle, solution }: SudokuGame){
  const initialBoardData: false | Board = stringToBoard(puzzle.board);
  const solutionBoard = stringToBoard(solution.board);

  const {
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
  } = useSudokuGame(
    puzzle.puzzle_id, initialBoardData, solutionBoard
  )

  const handleClearPuzzleProgress = () => {
    clearPuzzleProgress(puzzle.puzzle_id);
    setBoardData(deepCopy(initialBoardData));
  }

  return (
    <div className='flex-1 flex flex-col lg:flex-row'>
      <NotesContext.Provider value={{ notesActive, setNotesActive }}>
        <div className='flex-1 flex flex-col gap-4 mb-8'>
          <div>
            <div className="mb-4">
              <div className="font-bold text-lg">{title}:  {completion}%</div>
              <div>
              {
                solvedBoard ?
                  `You finished the sudoku with ${errors} errors!` : `Errors: ${errors}`
              }
              </div>
            </div>
            <SudokuBoard
              boardData={boardData}
              activeCell={activeCell}
              setActiveCell={(gridLoc) => handleSetActiveCell(gridLoc)}
              solvedBoard={solvedBoard}
            />
          </div>

          <Controls
            setDigit={(digit) => handleClickControlDigit(digit)}
            emptyCell={() => handleErase()}
            undoLastMove={() => handleUndoLastMove()}
          />
        </div>

      </NotesContext.Provider>

      <div className='text-sm text-center'>
        <div onClick={() => handleClearPuzzleProgress()} className='underline text-red-600 cursor-pointer'>Clear puzzle progress</div>
      </div>
    </div>
  )
}
