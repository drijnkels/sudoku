import Notes from "@/components/Board/Notes";

export type CellType = {
  cellIndex: number,
  digit:number,
  highlight:string,
  selectCell: () => void
  notes: number[]
}

export default function Cell({cellIndex, digit, highlight, selectCell, notes} : CellType) {

  return (
      <div
        onClick={selectCell}
        className={`relative flex items-center justify-center w-[65px] h-[65px] text-4xl cursor-pointer transition-colors hover:bg-slate-400/30
          ${cellIndex % 3 === 2 && cellIndex != 8 ? 'border-r border-slate-800' : 'border-r border-slate-300'}
          ${digit !== 0 ? 'text-blue-700 font-bold' : ''}
          ${highlight}
      `}>
          {digit !== 0 ? digit : ''}
        <Notes notes={notes} />
      </div>
  )
}