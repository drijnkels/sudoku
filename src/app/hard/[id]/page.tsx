'use client';

import SudokuGame from "@/components/SudokuGame";
import {hardBoards} from "@/lib/boards/boards";
import {hardSolutions} from "@/lib/boards/solutions";

export default function HardPuzzle({ params }: { params: { id: string }}) {
  // Load puzzle data
  const puzzle = hardBoards.find((board) => board.puzzle_id === params.id);
  // Solution
  const solution = hardSolutions.find((solution) => solution.id === params.id);

  if (!puzzle || !solution) {
    return (
      'invalid puzzle'
    )
  }

  return (
    <div className='p-4'>
      <div className='w-full mb-4 text-slate-400'><a href='/hard'>{'<-- Return to puzzle selection'}</a></div>
      <div className="flex flex-col gap-4 max-w-fit">
        <SudokuGame title='Sudoku - Hard' puzzle={puzzle} solution={solution} />
      </div>
    </div>
  )
}
