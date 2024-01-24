import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sudoku',
  description: 'Simple ad free Sudoku app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full`}>
        <header className='bg-blue-600 text-2xl font-bold text-white p-4 text-center'>
          Simple Sudoku
        </header>
        <main className="flex min-h-screen flex-col items-center w-full">
          {children}
        </main>
      </body>
    </html>
)
}
