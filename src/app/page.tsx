'use client'

import { useSearchParams } from 'next/navigation'
import React, {useEffect, useState} from 'react';
import {Puzzle} from "@/types/types";
import {easyBoards, evilBoards, hardBoards, mediumBoards} from "@/components/boards/boards";
import Select from "@/components/Form/Select";
import PuzzleOverview from "@/components/Layout/PuzzleOverview";

import { clearAppData } from "@/scripts/persistence";

export default function Home() {
  const searchParams = useSearchParams();

  const [difficulty, setDifficulty] = useState('');
  const [activePuzzleSet, setActivePuzzleSet] = useState<Puzzle[] | []>([]);
  const difficultyOptions = [
    {label: 'Easy', value: 'easy'},
    {label: 'Medium', value: 'medium'},
    {label: 'Hard', value: 'hard'},
    {label: 'Evil', value: 'evil'}
  ]

  // Effect to synchronize URL parameter with local state
  useEffect(() => {
    const urlDifficulty = searchParams.get('difficulty');
    if (urlDifficulty && ['easy', 'medium', 'hard', 'evil'].includes(urlDifficulty)) {
      setDifficulty(urlDifficulty);
    }
  }, [searchParams]);

  // Set the active puzzles based on the difficulty
  useEffect(() => {
    if (difficulty === 'easy') {
      setActivePuzzleSet(easyBoards);
    } else if (difficulty === 'medium') {
      setActivePuzzleSet(mediumBoards);
    } else if (difficulty === 'hard') {
      setActivePuzzleSet(hardBoards);
    } else if ( difficulty === 'evil') {
      setActivePuzzleSet(evilBoards);
    }else {
      setActivePuzzleSet([])
    }
  }, [difficulty])

  const handleDifficultySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(event.target.value);
  }

  const handleClearAppData = () => {
    clearAppData();
    setDifficulty('');
  }

  return (
    <div className='p-12 w-full h-full flex-1 flex flex-col'>
      <div className="flex-1 flex flex-col justify-center items-center gap-4 mb-8">
        <div className='w-fit'>
          <Select onChange={handleDifficultySelection} name='difficulty' label='Select your difficulty' id='difficulty'
                  options={difficultyOptions} value={difficulty}/>
        </div>

        {
          (activePuzzleSet) ?
            <PuzzleOverview puzzles={activePuzzleSet}/> :
            ''
        }
      </div>
      <div className='text-sm text-center'>
        <div onClick={() => handleClearAppData()} className='underline text-red-600 cursor-pointer'>Clear app data</div>
      </div>
    </div>
  )
}
