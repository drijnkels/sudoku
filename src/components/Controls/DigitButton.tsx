type DigitButton = {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  customBg?: string,
  ariaToggle?: boolean,
  ariaLabel?: string,
  onClick?: () => void
}
export default function Button ({children, type = "button", customBg, ariaToggle = false, ariaLabel, onClick}: DigitButton){
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center items-center w-full py-2 px-4 rounded-xl text-white shadow overflow-hidden cursor-pointer transition-colors bg-gradient-to-br from-blue-400 to-blue-600`}
      aria-pressed={ariaToggle ? false : undefined}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </button>
  )
}