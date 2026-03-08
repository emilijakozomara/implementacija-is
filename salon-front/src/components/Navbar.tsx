import type { Page } from '../App'

interface Props {
  setPage: (page: Page) => void
  isAdmin: boolean
  setIsAdmin: (v: boolean) => void
}

export default function Navbar({ setPage, isAdmin, setIsAdmin }: Props) {
  return (
    <nav className="bg-gray-900 border-b border-purple-800 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => setPage('home')}
        className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
      >
        💜 Salon Trač
      </button>

      <div className="flex items-center gap-4">
        <button onClick={() => setPage('home')} className="text-gray-300 hover:text-white transition">
          Početna
        </button>
        <button onClick={() => setPage('nova')} className="text-gray-300 hover:text-white transition">
          Nova rezervacija
        </button>
        <button onClick={() => setPage('moja')} className="text-gray-300 hover:text-white transition">
          Moja rezervacija
        </button>

        {isAdmin && (
          <>
            <button onClick={() => setPage('admin-settings')} className="text-gray-300 hover:text-white transition">
              Podešavanja
            </button>
            <button onClick={() => setPage('admin-kategorije')} className="text-gray-300 hover:text-white transition">
              Kategorije
            </button>
            <button onClick={() => setPage('admin-usluge')} className="text-gray-300 hover:text-white transition">
              Usluge
            </button>
          </>
        )}

        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isAdmin ? 'Admin mod' : 'Admin'}
        </button>
      </div>
    </nav>
  )
}