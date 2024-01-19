import { PencilIcon, ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Controls/Button";

type ControlsType = {
  setDigit: (digit:number) => void
  undoLastMove: () => void
  emptyCell: () => void
  handleToggleNotesActive: () => void,
  notesActive: boolean
}
export default function Controls({setDigit, undoLastMove, emptyCell, handleToggleNotesActive, notesActive}: ControlsType){
  const digits = [1,2,3,4,5,6,7,8,9];
  return(
    <div className='flex flex-col gap-4'>
      {/* Special controls to change board settings */}
      <div className='grid grid-cols-3 gap-2'>
        <Button onClick={handleToggleNotesActive}>
          <PencilIcon className={`w-7 h-7 mr-2 ${notesActive ? 'text-emerald-500' : 'text-zinc-400'}`} />
        </Button>
        <Button onClick={undoLastMove}>
          <ArrowUturnLeftIcon className={"w-7 h-7 mr-2 text-zinc-400"} />
        </Button>
        <Button>
          <TrashIcon onClick={emptyCell} className={"w-7 h-7 mr-2 text-zinc-400"} />
        </Button>
      </div>

      {/* Change the value of a cell to a new digit */}
      <div className='grid grid-cols-3 gap-2'>
        {digits.map((d, digitIndex) =>
          <Button key={digitIndex} onClick={() => setDigit(d)}>{d}</Button>
        )}
      </div>
    </div>
  )
}