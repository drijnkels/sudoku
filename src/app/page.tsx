import { stringToBoard } from "@/scripts/utils";
import SudokuGame from "@/components/SudokuGame";

const easyBoards = [
  '802605371 415803290 000901004 061080030 209034000 000002007 024000708 600010000 000008620',
  '380000004 704560000 000003060 000208015 010630040 007000008 176804309 005000206 820965401',
  '290004360 640092008 030051902 000700004 103405809 400008000 906580020 700240096 024900087'
];
const mediumBoard = [];
const hardBoards = [];
const evilBoards = [
  '090000005 100900030 002800970 804030000 910000053 000060807 041008300 060004001 300000020',
  '091040000 068700350 700020000 000800037 004000100 680001000 000070003 0120039970 000080420'
]
export default function Home() {
  const initialBoardData = stringToBoard(easyBoards[0]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col gap-4">
          <SudokuGame initialBoardData={initialBoardData} />
        </div>
      </main>
  )
}
