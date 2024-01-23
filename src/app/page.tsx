import { stringToBoard } from "@/scripts/utils";
import SudokuGame from "@/components/SudokuGame";
import { easyBoards } from "@/components/boards/boards";

export default function Home() {
  const initialBoardData = stringToBoard(easyBoards[0]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col gap-4">
          {
            (initialBoardData) ?
              <SudokuGame initialBoardData={initialBoardData} /> :
              ''
          }
        </div>
      </main>
  )
}
