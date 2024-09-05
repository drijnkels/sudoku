import { useContext} from 'react';
import {NotesContext} from "@/Context/NotesContext";
import {PencilIcon, ArrowUturnLeftIcon, TrashIcon, LightBulbIcon} from "@heroicons/react/24/outline";
import DigitButton from "@/components/Controls/DigitButton";

type ControlsType = {
  setDigit: (digit:number) => void
  undoLastMove: () => void
  emptyCell: () => void
  solveBoard: () => void
  getAllNotes: () => void,
  handleStrategy: (strategy: string) => void
  debugMode: boolean,
  requestHint: () => void
}
export default function Controls({setDigit, undoLastMove, emptyCell, solveBoard, getAllNotes, handleStrategy, debugMode, requestHint}: ControlsType){
  const { notesActive, setNotesActive} = useContext(NotesContext);
  const digits = [1,2,3,4,5,6,7,8,9];
  const iconBtnClasses:string = 'size-4 md:size-6';
  return(
    <div className={'w-[550px] mx-auto'}>
      <div className="font-bold text-lg mb-4 hidden lg:block">Controls</div>
      <div className='flex justify-center flex-col gap-4'>
        {/* Special controls to change board settings */}
        <div className='grid grid-cols-4 gap-2'>
          <button onClick={() => setNotesActive(!notesActive)} aria-pressed={false} aria-label='Toggle making notes'>
            <div className={`flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm text-zinc-600`}>
              <div className={`flex flex-col items-center p-2 rounded-xl ${notesActive ? 'bg-emerald-100 shadow' : ''}`}>
                <PencilIcon className={`${iconBtnClasses}`}/>
                Notes
              </div>

            </div>
          </button>
          <button onClick={undoLastMove} aria-label='Undo last move'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <ArrowUturnLeftIcon className={iconBtnClasses}/>
              Undo
            </div>
          </button>
          <button onClick={emptyCell} aria-label='Empty cell contents'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <TrashIcon className={iconBtnClasses}/>
              Empty
            </div>
          </button>
          <button onClick={requestHint} aria-label='Undo last move'>
            <div className='flex flex-col md:gap-1 items-center text-center text-[12px] md:text-sm'>
              <LightBulbIcon className={iconBtnClasses}/>
              Hint
            </div>
          </button>
        </div>

        {/* Change the value of a cell to a new digit */}
        <div className='grid grid-cols-9 gap-2 md:gap-4 text-xl lg:text-2xl'>
          {digits.map((d, digitIndex) =>
            <DigitButton key={digitIndex} notesActive={notesActive} onClick={() => setDigit(d)}>{d}</DigitButton>
          )}
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div
            onClick={getAllNotes}
            className='flex justify-center items-center w-full p-2 rounded-lg cursor-pointer transition-colors text-white bg-gradient-to-br from-blue-400 to-blue-600'
          >
            Fill in notes
          </div>
          <div
            onClick={solveBoard}
            className='flex justify-center items-center w-full p-2 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors text-white bg-gradient-to-br from-blue-400 to-blue-600'
          >
            Solve the board
          </div>
        </div>

        {debugMode && <div className={'flex flex-col gap-2'}>
          <b>Run strategies</b>
          <div
            onClick={() => handleStrategy('hidden_singles')}
            className='flex justify-center items-center w-full border border-slate-300 p-2 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors bg-sky-100'>
            Solve Hidden Singles
          </div>
          <div
            onClick={() => handleStrategy('naked_pairs')}
            className='flex justify-center items-center w-full border border-slate-300 p-2 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors bg-sky-100'>
            Naked Pairs
          </div>
          <div
            onClick={() => handleStrategy('naked_triples')}
            className='flex justify-center items-center w-full border border-slate-300 p-2 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors bg-sky-100'>
            Naked Triples
          </div>
          <div
            onClick={() => handleStrategy('pointing_pairs')}
            className='flex justify-center items-center w-full border border-slate-300 p-2 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors bg-sky-100'>
            Pointing Pairs
          </div>
        </div>
        }
      </div>
    </div>
  )
}