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
  const iconBtnClasses = 'w-5 h-5 lg:w-6 lg:h-6 text-zinc-400';
  return(
    <div className='flex flex-col-reverse lg:flex-col gap-4'>
      {/* Special controls to change board settings */}
      <div className='grid grid-cols-9 lg:grid-cols-3 gap-2'>
        <Button onClick={handleToggleNotesActive} ariaToggle={true} ariaLabel='Toggle making notes'>
          <div className='flex flex-col gap-1 font-size items-center text-center text-sm'>
            <PencilIcon className={`${iconBtnClasses} ${notesActive ? 'text-emerald-500' : 'text-zinc-400'}`} />
            Notes
          </div>
        </Button>
        <Button onClick={undoLastMove} ariaLabel='Undo last move'>
          <div className='flex flex-col gap-1 font-size items-center text-center text-sm'>
            <ArrowUturnLeftIcon className={iconBtnClasses}/>
            Undo
          </div>
        </Button>
        <Button onClick={emptyCell} ariaLabel='Empty cell contents'>
          <div className='flex flex-col gap-1 font-size items-center text-center text-sm'>
            <TrashIcon className={iconBtnClasses}/>
            Empty
          </div>
        </Button>
      </div>

      {/* Change the value of a cell to a new digit */}
      <div className='grid grid-cols-9 lg:grid-cols-3 gap-2 text-xl lg:text-2xl'>
        {digits.map((d, digitIndex) =>
          <Button key={digitIndex} onClick={() => setDigit(d)}>{d}</Button>
        )}
      </div>
    </div>
  )
}