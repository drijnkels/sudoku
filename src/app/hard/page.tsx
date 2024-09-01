import PuzzleOverview from "@/components/Layout/PuzzleOverview";
import React from "react";
import {hardBoards} from "@/lib/boards/boards";

const Page = () => {
  return(
    <PuzzleOverview puzzles={hardBoards} type={'hard'} title={'Hard Sudoku Puzzles'}/>
  )
}

export default Page