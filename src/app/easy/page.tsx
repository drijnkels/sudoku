import PuzzleOverview from "@/components/Layout/PuzzleOverview";
import React from "react";
import {easyBoards} from "@/lib/boards/boards";

const Page = () => {
  return(
    <PuzzleOverview puzzles={easyBoards} title={'East Sudoku Puzzles'} description={'These require no special techniques or guessing'} />
  )
}

export default Page