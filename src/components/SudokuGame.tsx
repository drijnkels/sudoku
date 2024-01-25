'use client';

import SudokuBoard from "@/components/Board/SudokuBoard";
import Controls from "@/components/Controls/Controls";
import {useSudokuGame} from "@/hooks/useSudokuGame";

export default function SudokuGame({ title, initialBoardData }: {title: string, initialBoardData: number[][]}){
  const {
    boardData,
    noteData,
    notesActive,
    activeCell,
    gameComplete,
    errors,
    numErrors,
    handleSetActiveCell,
    handleToggleNotesActive,
    handleErase,
    handleClickedControlDigit,
    handleUndoLastMove,
  } = useSudokuGame(initialBoardData);

  return (
    <div className='flex gap-4 flex-col lg:flex-row'>
      <div>
        <div className="mb-4">
          <div className="font-bold text-lg">{title}</div>
          <div>
          {
            gameComplete ?
              `You finished the sudoku with ${numErrors} errors!` : `Errors: ${numErrors}`
          }
          </div>
        </div>
        <SudokuBoard
          boardData={boardData}
          notes={noteData}
          activeCell={activeCell}
          setActiveCell={(gridLoc) => handleSetActiveCell(gridLoc)}
          errors={errors}
          gameComplete={gameComplete}
        />
      </div>
      <div>
        <div className="font-bold text-lg mb-4 hidden lg:block">Controls</div>
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
