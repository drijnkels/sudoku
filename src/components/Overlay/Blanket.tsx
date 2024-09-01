import React, { useRef, useEffect } from 'react';

interface BlanketProps {
  children: React.ReactNode;
  onClickOutside: () => void;
}

export default function Blanket({ children, onClickOutside }: BlanketProps) {
  const blanketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blanketRef.current && !blanketRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div
      className="bg-zinc-950/50 fixed w-full h-full top-0 left-0 z-[9999] backdrop-blur-sm p-4"
    >
      <div ref={blanketRef} className='w-full h-full flex items-center justify-center'>
        {children}
      </div>
    </div>
  );
}
