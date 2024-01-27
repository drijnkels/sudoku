'use client';
import { useEffect } from "react";
import { deepCopy, stringToBoard } from "@/scripts/utils";
import { Board, Puzzle, Solution } from "@/types/types";
import { useSudokuGame } from '@/hooks/useSudokuGame'

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

  console.log('Render SudokuGame')

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
    initialBoardData, solutionBoard
  )

  // Use useEffect to initialize boardData with a deep copy of initialBoardData
  useEffect(() => {
    if (initialBoardData) {
      setBoardData(deepCopy(initialBoardData));
    }
  });

  return (
    <div className='flex gap-4 flex-col lg:flex-row'>
      <NotesContext.Provider value={{ notesActive, setNotesActive }}>
        <div>
          <div className="mb-4">
            <div className="font-bold text-lg">{title} - {completion}%</div>
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
          <div>
            {/*<div onClick={() => resetProgress()}>Reset progress</div>*/}
          </div>
        </div>

        <Controls
          setDigit={(digit) => handleClickControlDigit(digit)}
          emptyCell={() => handleErase()}
          undoLastMove={() => handleUndoLastMove()}
        />

        </NotesContext.Provider>
    </div>
  )
}
