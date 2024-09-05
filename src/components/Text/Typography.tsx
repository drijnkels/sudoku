type TextVariants = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'label';
const variants:{[key in TextVariants] : string} = {
  p: '',
  h1: 'font-bold text-3xl',
  h2: 'text-2xl ',
  h3: 'text-lg font-semibold text-zinc-800 text-lg',
  h4: 'font-medium text-zinc-950',
  label: 'font-semibold text-sm mb-0.5'
}

type TextWeights = 'normal' | 'medium' | 'semibold' | 'bold';
const weights: {[key in TextWeights]: string} = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

type TextProps = {
  variant?: TextVariants;
  weight?: TextWeights;
  italic?: boolean;
  subdued?: boolean
  children: React.ReactNode
  classes?: string
}
export default function Typography({variant = 'p', italic = false, subdued = false, weight = 'normal', children, classes = ''} : TextProps){
  const italicClass = italic ? 'italic' : '';
  const subduedClass = subdued ? 'text-zinc-500' : '';
  const textClasses = `${variants[variant]} ${weights[weight]} ${italicClass} ${subduedClass} whitespace-pre-line ${classes}`;
  return (
    <div className={textClasses}>
      {children}
    </div>
  )
}