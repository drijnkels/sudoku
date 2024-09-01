'use client'

import { clearAppData } from "@/scripts/persistence";
import Button from "@/components/Controls/DigitButton";
import Card from "@/components/Panels/Card";
import LinkButton from "@/components/Elements/LinkButton";

export default function Home() {
  const handleClearAppData = () => {
    clearAppData();
  }

  return (
    <div className='p-12 w-full h-full flex-1 flex flex-col'>

      <div className='w-fit flex flex-col gap-4 max-w-lg min-w-32 mx-auto'>
        <div className='text-center font-semibold text-2xl text-white mb-8'>Menu</div>
        <LinkButton href={'/easy'}>Easy puzzles</LinkButton>
        <LinkButton href={'/medium'}>Medium puzzles</LinkButton>
        <LinkButton href={'/hard'}>Hard puzzles</LinkButton>
        <LinkButton href={'/evil'}>Evil puzzles</LinkButton>
        <LinkButton href={'/settings'}>Settings</LinkButton>
        <LinkButton href={'/about'}>About</LinkButton>
      </div>

    </div>
  )
}
