'use client';

import SudokuGame from "@/components/SudokuGame";
import { easyBoards } from "@/components/boards/boards";
import { easySolutions } from "@/components/boards/solutions";

export default function EasyPuzzle({ params }: { params: { id: string }}) {
  // Load puzzle data
  const puzzle = easyBoards.find((board) => board.puzzle_id === params.id);
  // Solution
  const solution = easySolutions.find((solution) => solution.id === params.id);

  if (!puzzle || !solution) {
    return (
      'invalid puzzle'
    )
  }

  return (
    <div className='h-full flex flex-col p-4'>
      <div className='w-full mb-4 text-slate-400'><a href='/?difficulty=easy'>{'<-- Return to puzzle selection'}</a></div>
      <div className="flex-1 flex flex-col gap-4 max-w-fit">
        <SudokuGame title='Sudoku - Easy' puzzle={puzzle} solution={solution} />
      </div>
    </div>
  )
}
