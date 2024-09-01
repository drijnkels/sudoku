
export const buttonThemes = {
  base: [
    'relative flex items-center justify-center\ rounded-xl text-base font-semibold',
    'px-4 py-2 gap-1.5',
    'font-sans'
  ],
  primary: 'shadow bg-primary font-medium text-center focus-visible:outline-none align-middle py-1 px-2 text-white rounded-xl',
  secondary: 'font-semibold bg-stone-200 shadow text-[#231645] transition-all duration-200 text-zinc-800 whitespace-nowrap rounded-xl h-11 px-3',
  plain: 'hover:bg-zinc-100 transition-all duration-300',
  outline: 'border-zinc-950/10 text-zinc-950',
  delete: 'border-red-700 bg-red-600 text-white shadow-button-secondary tracking-[-0.01em]',
  delete_secondary: 'font-semibold bg-zinc-100 shadow-button transition-all duration-200 text-zinc-800 whitespace-nowrap rounded-lg h-11 px-3 hover:border-red-400 hover:bg-red-500 hover:text-red-100',
}
const ButtonSize = {
  full: 'w-full',
  fit: 'w-fit'
}

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  variant?: 'primary' | 'secondary' | 'plain' | 'outline' | 'delete' | 'delete_secondary';
  size?: 'full' | 'fit';
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean
}

export default function Button(
  {children, variant = 'primary', type = 'button', size = 'full', disabled = false,  onClick}
    : ButtonProps)
{
  const buttonClasses = `${buttonThemes.base.join(' ')} ${buttonThemes[variant]} ${ButtonSize[size]}`
  return(
    <button className={buttonClasses} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}