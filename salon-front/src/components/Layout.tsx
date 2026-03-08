import { useState } from 'react'
import Navbar from './Navbar'
import type { Page } from '../App'

interface Props {
  setPage: (page: Page) => void
  children: React.ReactNode
}

export default function Layout({ setPage, children }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar setPage={setPage} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}