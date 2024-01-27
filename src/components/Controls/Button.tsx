type Button = {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  customBg?: string,
  ariaToggle?: boolean,
  ariaLabel?: string,
  onClick?: () => void
}
export default function Button ({children, type = "button", customBg, ariaToggle = false, ariaLabel, onClick}: Button){
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center items-center h-[50px] w-[50px] md:h-[55px] md:w-[55px] lg:h-[75px] lg:w-[75px] border border-slate-300 rounded-lg hover:bg-sky-400 cursor-pointer transition-colors ${customBg ?? 'bg-sky-100'}`}
      aria-pressed={ariaToggle ? false : undefined}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </button>
  )
}