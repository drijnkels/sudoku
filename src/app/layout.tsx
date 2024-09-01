import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {Suspense} from "react";
import {Loading} from "@/components/Loading";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wingu Sudoku',
  description: 'Simple ad free Sudoku app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full h-full flex flex-col`}>
        <header className='bg-blue-600 text-2xl font-bold text-white p-4 text-center shadow-md'>
          <a href="/">Wingu Sudoku</a>
        </header>
        <main className="flex-1 flex flex-col items-center w-full max-w-screen-lg mx-auto">
          <div className='flex-1 w-full'>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
          <div className='mb-4 text-sm'>
            Version: 0.9.8
          </div>
        </main>
      </body>
    </html>
)
}
