import { stringToBoard } from "@/scripts/utils";
import SudokuGame from "@/components/SudokuGame";
import { evilBoards } from "@/components/boards/boards";

export default function EasyPuzzle({ params }: { params: { id: string }}) {
  const puzzle = evilBoards.find((board) => board.puzzle_id === params.id);
  if (!puzzle) {
    return (
      'invalid puzzle'
    )
  }

  const initialBoardData = stringToBoard(puzzle.board);

  return (
    <div>
      <div className='w-full mb-4 text-slate-400'><a href='/?difficulty=evil'>{'<-- Return to puzzle selection'}</a></div>
      <div className="flex flex-col gap-4">
        {
          (initialBoardData) ?
            <SudokuGame title='Sudoku - Evil' initialBoardData={initialBoardData} /> :
            ''
        }
      </div>
    </div>
  )
}
