import { stringToBoard } from "@/scripts/utils";
import SudokuGame from "@/components/SudokuGame";
import { easyBoards } from "@/components/boards/boards";

export default function EasyPuzzle({ params }: { params: { id: string }}) {
  const puzzle = easyBoards.find((board) => board.puzzle_id === params.id);
  if (!puzzle) {
    return (
      'invalid puzzle'
    )
  }

  const initialBoardData = stringToBoard(puzzle.board);

  return (
    <div className='p-4'>
      <div className='w-full mb-4 text-slate-400'><a href='/?difficulty=easy'>{'<-- Return to puzzle selection'}</a></div>
      <div className="flex flex-col gap-4 max-w-fit">
        {
          (initialBoardData) ?
            <SudokuGame title='Sudoku - Easy' initialBoardData={initialBoardData} /> :
            ''
        }
      </div>
    </div>
  )
}
