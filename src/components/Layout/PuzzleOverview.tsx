import React from 'react';
import { Puzzle } from '@/types/types'
import PuzzlePreview from "@/components/Layout/PuzzlePreview";

type Props = {
  puzzles: Puzzle[]
}

export default function PuzzleOverview({puzzles}: Props) {
  return(
    <div className='flex w-full flex-wrap justify-center gap-4'>
      {puzzles.map((puzzle, index) => (
        <PuzzlePreview key={index} puzzle={puzzle} />
      ))}
    </div>
  )
}