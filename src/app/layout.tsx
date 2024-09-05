import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {Suspense} from "react";
import {Loading} from "@/components/Loading";
import Script from "next/script";

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
      <body className={`${inter.className} w-full h-full flex flex-col bg-slate-100`}>
        <header className='text-2xl font-bold text-white p-4 text-center bg-blue-600 z-20'>
          <a href="/">Wingu Sudoku</a>
        </header>
        <main className="flex-1 flex flex-col items-center w-full max-w-screen-lg mx-auto z-20">
          <div className='flex-1 w-full'>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
          <div className='mb-4 text-sm text-center mx-auto text-slate-500'>
            Feedback?<br />Find me on <a className='text-blue-600' rel="me" href="https://mastodon.social/@noctemz">Mastodon</a>
            <div>Version: 0.9.8</div>
          </div>
        </main>
      </body>
    </html>
  )
}
