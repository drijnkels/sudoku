export default function Notes ({notes}: {notes:number[]}) {
  const noteDigits = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
  ]
  return (
    <div className='absolute inset-0 text-[14px] leading-5 text-slate-500 text-center grid grid-rows-3'>
      {
        noteDigits.map((row, rowIndex) => (
          <div key={rowIndex} className='flex'>
            {
              row.map((digit, digitIndex) => (
                <div key={digitIndex} className='flex-1 min-h-'>
                  {notes.indexOf(digit) > -1 ? digit : ' '}
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}
