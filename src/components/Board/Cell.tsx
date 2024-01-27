import Notes from "@/components/Board/Notes";
import { Cell } from "@/types/types";
import {memo} from "react";

export type CellType = {
  cellIndex: number,
  cellData: Cell,
  highlight:string,
  selectCell: () => void
  solvedBoard: boolean,
}

const Cell = memo(function Cell({cellIndex, cellData, highlight, selectCell, solvedBoard} : CellType) {
  const getBorderClass = () => {
    return cellIndex % 3 === 2 && cellIndex !== 8 ? 'border-r border-slate-800' : 'border-r border-slate-300';
  }

  const getCellState = () => {
      if (cellData.state === 'locked') {
        return 'text-slate-600 font-bold';
      }

      return 'text-blue-700 font-bold';
  }

  const getBackgroundClass = () => {
    if (solvedBoard) {
      return 'bg-emerald-200';
    } else if (cellData.state === 'error') {
      return 'bg-red-500/30 cursor-pointer';
    } else if (highlight) {
      return highlight + ' cursor-pointer';
    }
    return 'hover:bg-slate-400/30 cursor-pointer'
  }

  return (
      <div
        onClick={selectCell}
        className={`relative flex items-center justify-center w-[35px] h-[35px] text-xl md:w-[65px] md:h-[65px] md:text-4xl transition-colors 
          ${getCellState()}
          ${getBorderClass()}
          ${getBackgroundClass()}
      `}>
          {cellData.digit !== 0 ? cellData.digit : ''}
        <Notes notes={cellData.digit === 0 ? cellData.notes : []} />
      </div>
  )
})

export default Cell;