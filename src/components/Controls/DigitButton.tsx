type DigitButtonProps = {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  notesActive: boolean,
  ariaToggle?: boolean,
  ariaLabel?: string,
  onClick?: () => void
}
const DigitButton  = ({children, type = "button", notesActive, ariaToggle = false, ariaLabel, onClick}: DigitButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex justify-center items-center w-full py-2 px-4 rounded-xl text-white shadow overflow-hidden cursor-pointer transition-colors ${notesActive ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}
      aria-pressed={ariaToggle ? false : undefined}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </button>
  )
}

export default DigitButton;