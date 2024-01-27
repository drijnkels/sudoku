'use client'

import { useSearchParams } from 'next/navigation'
import React, {useEffect} from 'react';

import {easyBoards, evilBoards, hardBoards, mediumBoards} from "@/components/boards/boards";
import { useState } from "react";
import Select from "@/components/Form/Select";
import PuzzleOverview from "@/components/Layout/PuzzleOverview";
import {Puzzle} from "@/types/types";

export default function Home() {
  const searchParams = useSearchParams()

  const [difficulty, setDifficulty] = useState('none');
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

  return (
      <div className='p-12 w-full'>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className='w-fit'>
            <Select onChange={handleDifficultySelection} name='difficulty' label='Select your difficulty' id='difficulty' options={difficultyOptions} value={difficulty} />
          </div>

          {
            (activePuzzleSet) ?
            <PuzzleOverview puzzles={activePuzzleSet} /> :
              ''
          }
        </div>
      </div>
  )
}
