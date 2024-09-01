import PuzzleOverview from "@/components/Layout/PuzzleOverview";
import React from "react";
import {evilBoards} from "@/lib/boards/boards";

const Page = () => {
  return(
    <PuzzleOverview puzzles={evilBoards} type='evil' title={'Evil Sudoku Puzzles'} />
  )
}

export default Page