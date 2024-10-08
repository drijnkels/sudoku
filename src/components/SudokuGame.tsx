'use client';
import React from "react";
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
  const debugMode = false;
  const initialBoardData = stringToBoard(puzzle.board);
  const solutionBoard = stringToBoard(solution.board);

  const {
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
    resetHintCell
  } = useSudokuGame(
    puzzle.puzzle_id, initialBoardData, solutionBoard
  )

  const handleClearPuzzleProgress = () => {
    clearPuzzleProgress(puzzle.puzzle_id);
    setBoardData(deepCopy(initialBoardData));
  }

  if ('error' in initialBoardData || 'error' in solutionBoard) {
    return (
      <div>
        An error occurred while trying to load the puzzle
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col'>
      <NotesContext.Provider value={{ notesActive, setNotesActive }}>
        <div className='flex-1 flex flex-col gap-4 mb-8 w-[585px]'>
          <div className='flex flex-col gap-4 w-full'>
            <div className="">
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
              hintCell={hintCell}
              resetHintCell={resetHintCell}
              setActiveCell={(gridLoc) => handleSetActiveCell(gridLoc)}
              solvedBoard={solvedBoard}
              debugMode={debugMode}
            />

            {
              hint &&
              <div>
                <div className='bg-white rounded-xl p-2 w-fit mx-auto shadow text-sm'>{hint}</div>
              </div>
            }
          </div>

          <Controls
            setDigit={(digit) => handleClickControlDigit(digit)}
            emptyCell={() => handleErase()}
            undoLastMove={() => handleUndoLastMove()}
            solveBoard={() => handleSolveBoard()}
            getAllNotes={() => handleGetAllNotes()}
            handleStrategy={handleStrategy}
            debugMode={debugMode}
            requestHint={requestHint}
          />
        </div>

      </NotesContext.Provider>

      <div className='text-sm text-center'>
        <div onClick={() => handleClearPuzzleProgress()} className='underline text-red-600 cursor-pointer'>Clear puzzle progress</div>
      </div>
    </div>
  )
}
