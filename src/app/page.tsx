import { stringToBoard } from "@/scripts/utils";
import SudokuGame from "@/components/SudokuGame";

const boards = [
  '802605371 415803290 000901004 061080030 209034000 000002007 024000708 600010000 000008620',
  '380000004 704560000 000003060 000208015 010630040 007000008 176804309 005000206 820965401'
]
export default function Home() {
  const initialBoardData = stringToBoard(boards[0]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col gap-4">
          <SudokuGame initialBoardData={initialBoardData} />
        </div>
      </main>
  )
}
