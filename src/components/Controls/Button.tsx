type Button = {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  ariaToggle?: boolean,
  ariaLabel?: string,
  onClick?: () => void
}
export default function Button ({children, type = "button", ariaToggle = false, ariaLabel, onClick}: Button){
  return (
    <button
      type={type}
      onClick={onClick}
      className='flex justify-center items-center h-[75px] w-[75px] bg-sky-100 border border-slate-300 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors'
      aria-pressed={ariaToggle ? false : undefined}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </button>
  )
}