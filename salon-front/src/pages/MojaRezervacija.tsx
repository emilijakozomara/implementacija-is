import { useState } from 'react'
import { api } from '../api/api'

interface Usluga { id: number; naziv: string; trajanje: number }
interface ReservationService { id: number; usluga: Usluga; terminVreme: string; cena: number }
interface Rezervacija {
  id: number; ime: string; prezime: string; email: string; sifra: string
  status: string; valuta: { naziv: string; kod: string }
  usluge: ReservationService[]
  promoKod?: { kod: string; iskoriscen: boolean }
}

export default function MojaRezervacija() {
  const [email, setEmail] = useState('')
  const [sifra, setSifra] = useState('')
  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null)
  const [greska, setGreska] = useState('')
  const [loading, setLoading] = useState(false)
  const [otkazivanje, setOtkazivanje] = useState(false)
  const [otkazano, setOtkazano] = useState(false)

  const pronadji = async () => {
    setGreska('')
    setLoading(true)
    try {
      const res = await api.getRezervacija(email, sifra)
      if (res.sifra) setRezervacija(res)
      else setGreska('Rezervacija nije pronađena.')
    } catch {
      setGreska('Rezervacija nije pronađena.')
    }
    setLoading(false)
  }

  const ukloni = async (id: number) => {
    if (!rezervacija) return
    try {
      const res = await api.ukloniUslugu(id, email, sifra)
      setRezervacija(res)
    } catch {
      setGreska('Greška pri uklanjanju usluge.')
    }
  }

  const otkazi = async () => {
    if (!window.confirm('Da li ste sigurni da želite otkazati rezervaciju?')) return
    setOtkazivanje(true)
    try {
      await api.otkaziRezervaciju(email, sifra)
      setOtkazano(true)
      setRezervacija(null)
    } catch {
      setGreska('Greška pri otkazivanju.')
    }
    setOtkazivanje(false)
  }

  const ukupno = rezervacija?.usluge.reduce((sum, u) => sum + Number(u.cena), 0) ?? 0

  if (otkazano) return (
    <div className="max-w-lg mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
      <div className="text-5xl">✅</div>
      <h2 className="text-2xl font-bold text-white">Rezervacija otkazana</h2>
      <p className="text-gray-400">Vaša rezervacija je uspješno otkazana.</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Moja rezervacija</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Pronađi rezervaciju</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full" />
        <input value={sifra} onChange={e => setSifra(e.target.value)} placeholder="Šifra" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full" />
        {greska && <p className="text-red-400 text-sm">{greska}</p>}
        <button onClick={pronadji} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl transition">
          {loading ? 'Učitavanje...' : 'Pronađi'}
        </button>
      </div>

      {rezervacija && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-purple-400">Detalji rezervacije</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${rezervacija.status === 'AKTIVNA' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                {rezervacija.status}
              </span>
            </div>
            <p className="text-white">{rezervacija.ime} {rezervacija.prezime}</p>
            <p className="text-gray-400 text-sm">{rezervacija.email}</p>
            <p className="text-gray-400 text-sm">Šifra: <span className="text-purple-400 font-mono">{rezervacija.sifra}</span></p>
            <p className="text-gray-400 text-sm">Valuta: {rezervacija.valuta.naziv} ({rezervacija.valuta.kod})</p>
            {rezervacija.promoKod && (
              <p className="text-gray-400 text-sm">
                Promo kod: <span className={rezervacija.promoKod.iskoriscen ? 'text-gray-500 line-through' : 'text-green-400 font-mono'}>{rezervacija.promoKod.kod}</span>
                {rezervacija.promoKod.iskoriscen && <span className="text-gray-500 ml-2">(iskorišćen)</span>}
              </p>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-purple-400">Usluge</h2>
            {rezervacija.usluge.length === 0 && <p className="text-gray-400 text-sm">Nema odabranih usluga.</p>}
            {rezervacija.usluge.map(u => (
              <div key={u.id} className="flex justify-between items-center text-white">
                <div>
                  <p className="font-medium">{u.usluga.naziv}</p>
                  <p className="text-gray-400 text-sm">{new Date(u.terminVreme).toLocaleString('sr')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">{Number(u.cena).toFixed(0)} {rezervacija.valuta.kod}</span>
                  {rezervacija.status === 'AKTIVNA' && (
                    <button onClick={() => ukloni(u.id)} className="text-red-400 hover:text-red-300 text-sm transition">✕</button>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
              <span>Ukupno</span>
              <span className="text-purple-400">{ukupno.toFixed(0)} {rezervacija.valuta.kod}</span>
            </div>
          </div>

          {rezervacija.status === 'AKTIVNA' && (
            <button onClick={otkazi} disabled={otkazivanje} className="w-full bg-red-900 hover:bg-red-800 disabled:opacity-50 text-red-300 font-semibold py-3 rounded-xl transition">
              {otkazivanje ? 'Otkazivanje...' : 'Otkaži rezervaciju'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}