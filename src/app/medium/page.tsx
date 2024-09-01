import PuzzleOverview from "@/components/Layout/PuzzleOverview";
import React from "react";
import {mediumBoards} from "@/lib/boards/boards";

const Page = () => {
  return(
    <PuzzleOverview puzzles={mediumBoards} type='medium' title={'Medium Sudoku Puzzles'} />
  )
}

export default Page