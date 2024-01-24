import React from 'react';

type InputProps = {
  label: string;
  id: string;
  name: string;
  options: Array<{label: string, value: string}>,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  value?: string,
  disabled?: boolean;
  error?: string;
}

export default function Select({label, id, name, options, onChange, value = '', error, disabled = false}: InputProps) {
  const disabledClasses = disabled ?
    'bg-zinc-100 text-zinc-500 border-zinc-300 cursor-not-allowed pointer-events-none' :
    'cursor-normal text-zinc-800 placeholder:text-zinc-400 bg-white border-zinc-300 focus:border-indigo-400';
  return (
    <div className="w-full mb-5">
      <label htmlFor={id} className="block mb-2 text-indigo-800 font-medium">{label}</label>
      <select onChange={onChange} id={id} role='combobox' defaultValue={value} className={disabledClasses + " w-full py-3 px-6 outline-none rounded-md border-2 focus:shadow-md"}>
        <option value='' disabled>Select...</option>
        {options.map((o, index) => (
          <option value={o.value} key={index}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}