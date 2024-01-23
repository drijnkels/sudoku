import Notes from "@/components/Board/Notes";
import {GridLoc} from "@/types/types";

export type CellType = {
  cellIndex: number,
  digit:number,
  highlight:string,
  selectCell: () => void
  errorCell: GridLoc | undefined,
  gameComplete: boolean,
  notes: number[]
}

export default function Cell({cellIndex, digit, highlight, selectCell, errorCell, gameComplete, notes} : CellType) {
  const getBorderClass = () => {
    return cellIndex % 3 === 2 && cellIndex !== 8 ? 'border-r border-slate-800' : 'border-r border-slate-300';
  }
  const getBackgroundClass = () => {
    if (gameComplete) {
      return 'bg-emerald-200';
    } else if (errorCell) {
      return 'bg-red-500/30 cursor-pointer';
    } else if (highlight) {
      return highlight + ' cursor-pointer';
    }
    return 'hover:bg-slate-400/30 cursor-pointer'
  }
  return (
      <div
        onClick={selectCell}
        className={`relative flex items-center justify-center w-[65px] h-[65px] text-4xl transition-colors text-blue-700 font-bold
          ${getBorderClass}
          ${getBackgroundClass()}
      `}>
          {digit !== 0 ? digit : ''}
        <Notes notes={digit === 0 ? notes : []} />
      </div>
  )
}