import {Puzzle} from "@/types/types";
import {stringToBoard} from "@/scripts/utils";
import Cell from "@/components/Board/Cell";

export default function PuzzlePreview({puzzle}: {puzzle: Puzzle}){
  const boardData = stringToBoard(puzzle.board);
  if(!boardData){
    return (
      <div>Not a valid board</div>
    )
  }

  const getBorderClass = (cellIndex: number) => {
    return cellIndex % 3 === 2 && cellIndex !== 8 ? 'border-r border-slate-800' : 'border-r border-slate-300';
  }

  return (
    <a href={puzzle.url} className='cursor-pointer'>
      <div className='text-center font-bold'>{puzzle.name}</div>
      <div className='text-center text-sm mb-2'>Complete: {puzzle.completion}</div>
      <div>
        <div className='border-2 border-slate-700 transition-colors hover:bg-sky-100'>
          {
            boardData.map((row, rowIndex) => (
              <div key={rowIndex}
                   className={`row flex ${rowIndex % 3 === 2 && rowIndex != 8 ? 'border-slate-800 border-b' : 'border-slate-300 border-b'}`}>
                {
                  row.map((cell, cellIndex) => (
                    <div key={cellIndex} className={`
                      relative flex items-center justify-center w-[20px] h-[20px] text-sm transition-colors text-blue-700 font-bold
                      ${getBorderClass(cellIndex)}
                      `}>
                      {cell !== 0 ? cell : ''}
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </a>
  )
}