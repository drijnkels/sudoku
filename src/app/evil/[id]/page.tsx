'use client';

import SudokuGame from "@/components/SudokuGame";
import { evilBoards } from "@/lib/boards/boards";
import { evilSolutions } from "@/lib/boards/solutions";

export default function EasyPuzzle({ params }: { params: { id: string }}) {
  // Load puzzle data
  const puzzle = evilBoards.find((board) => board.puzzle_id === params.id);
  // Solution
  const solution = evilSolutions.find((solution) => solution.id === params.id);

  if (!puzzle || !solution) {
    return (
      'invalid puzzle'
    )
  }

  return (
    <div className='p-4'>
      <div className='w-full mb-4 text-slate-400'><a href='/evil'>{'<-- Return to puzzle selection'}</a></div>
      <div className="flex flex-col gap-4 max-w-fit">
        <SudokuGame title='Sudoku - Evil' puzzle={puzzle} solution={solution} />
      </div>
    </div>
  )
}
