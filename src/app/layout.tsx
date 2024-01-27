import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

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
    <html lang="en" className='h-full'>
      <body className={`${inter.className} w-full h-full flex flex-col`}>
        <header className='bg-blue-600 text-2xl font-bold text-white p-4 text-center'>
          Wingu Sudoku
        </header>
        <main className="flex-1 flex flex-col items-center w-full">
          <div className='flex-1'>
          {children}
          </div>
          <div className='mb-4 text-sm'>
            Version: {publicRuntimeConfig?.version}
          </div>
        </main>
      </body>
    </html>
)
}
