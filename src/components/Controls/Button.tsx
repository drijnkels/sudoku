export default function Button ({children, onClick}: {children: React.ReactNode, onClick?: () => void}){
  return (
    <div
      onClick={onClick}
      className='flex justify-center items-center h-[75px] w-[75px] bg-sky-100 border border-slate-300 rounded-lg text-2xl hover:bg-sky-400 cursor-pointer transition-colors'
    >
      {children}
    </div>
  )
}