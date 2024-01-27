import { useContext} from 'react';
import {NotesContext} from "@/Context/NotesContext";
import { PencilIcon, ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Controls/Button";

type ControlsType = {
  setDigit: (digit:number) => void
  undoLastMove: () => void
  emptyCell: () => void
}
export default function Controls({setDigit, undoLastMove, emptyCell}: ControlsType){
  const { notesActive, setNotesActive} = useContext(NotesContext);
  const digits = [1,2,3,4,5,6,7,8,9];
  const iconBtnClasses:string = ' w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-zinc-400';
  return(
    <div>
      <div className="font-bold text-lg mb-4 hidden lg:block">Controls</div>
      <div className='flex justify-center lg:flex-col gap-4'>
        {/* Special controls to change board settings */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
          <Button onClick={() => setNotesActive(!notesActive)} customBg={notesActive ? 'bg-green-400' : 'bg-sky-100'} ariaToggle={true} ariaLabel='Toggle making notes'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <PencilIcon className={`${iconBtnClasses} ${notesActive ? 'text-emerald-500' : 'text-zinc-400'}`} />
              Notes
            </div>
          </Button>
          <Button onClick={undoLastMove} ariaLabel='Undo last move'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <ArrowUturnLeftIcon className={iconBtnClasses}/>
              Undo
            </div>
          </Button>
          <Button onClick={emptyCell} ariaLabel='Empty cell contents'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <TrashIcon className={iconBtnClasses}/>
              Empty
            </div>
          </Button>
        </div>

        {/* Change the value of a cell to a new digit */}
        <div className='grid grid-cols-3 gap-2 md:gap-4 text-xl lg:text-2xl'>
          {digits.map((d, digitIndex) =>
            <Button key={digitIndex} customBg={notesActive ? 'bg-emerald-400' : 'bg-sky-100'} onClick={() => setDigit(d)}>{d}</Button>
          )}
        </div>
      </div>
    </div>
  )
}