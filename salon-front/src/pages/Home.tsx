import { useEffect, useState } from 'react'
import { api } from '../api/api'

interface Settings {
  naziv: string
  lokacija: string
  opis: string
  radnoVreme: string
}

interface Usluga {
  id: number
  naziv: string
  opis: string
  trajanje: number
  cena: number
  kategorijaId: number
}

interface Kategorija {
  id: number
  naziv: string
}

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [kategorije, setKategorije] = useState<Kategorija[]>([])
  const [usluge, setUsluge] = useState<Usluga[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  Promise.all([
    api.getSettings(),
    api.getKategorije(),
    api.getUsluge(),
  ]).then(([s, k, u]) => {
    setSettings(s ?? null)
    setKategorije(Array.isArray(k) ? k : [])
    setUsluge(Array.isArray(u) ? u : [])
    setLoading(false)
  }).catch(() => setLoading(false))
}, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-purple-400 text-xl animate-pulse">Učitavanje...</div>
    </div>
  )

  return (
    <div className="space-y-12">
      <div className="rounded-2xl bg-gradient-to-br from-purple-900/50 to-gray-900 border border-purple-800/50 p-10 text-center space-y-4">
        <h1 className="text-5xl font-bold text-white">{settings?.naziv ?? 'Salon Trač'}</h1>
        <div className="flex items-center justify-center gap-6 text-gray-400 text-sm flex-wrap">
          <span>📍 {settings?.lokacija}</span>
          <span>🕐 {settings?.radnoVreme}</span>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">{settings?.opis}</p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white">Naše usluge</h2>
        {kategorije.map(kat => {
          const uslugeKat = usluge.filter(u => u.kategorijaId === kat.id)
          if (uslugeKat.length === 0) return null
          return (
            <div key={kat.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800/50 pb-2">
                {kat.naziv}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uslugeKat.map(u => (
                  <div
                    key={u.id}
                    className="bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl p-5 transition space-y-2"
                  >
                    <h4 className="text-white font-semibold">{u.naziv}</h4>
                    <p className="text-gray-400 text-sm">{u.opis}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-purple-400 font-bold">{u.cena} RSD</span>
                      <span className="text-gray-500 text-sm">⏱ {u.trajanje} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}