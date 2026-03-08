import { useEffect, useState } from 'react'
import { api } from '../../api/api'

interface Kategorija { id: number; naziv: string }

export default function AdminKategorije() {
  const [kategorije, setKategorije] = useState<Kategorija[]>([])
  const [naziv, setNaziv] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editNaziv, setEditNaziv] = useState('')
  const [loading, setLoading] = useState(true)

  const ucitaj = () => api.getKategorije().then(k => { setKategorije(Array.isArray(k) ? k : []); setLoading(false) })

  useEffect(() => { ucitaj() }, [])

  const dodaj = async () => {
    if (!naziv.trim()) return
    await api.createKategorija(naziv.trim())
    setNaziv('')
    ucitaj()
  }

  const sacuvaj = async (id: number) => {
    if (!editNaziv.trim()) return
    await api.updateKategorija(id, editNaziv.trim())
    setEditId(null)
    ucitaj()
  }

  const obrisi = async (id: number) => {
    if (!window.confirm('Obrisati kategoriju?')) return
    await api.deleteKategorija(id)
    ucitaj()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-purple-400 text-xl animate-pulse">Učitavanje...</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Kategorije</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Nova kategorija</h2>
        <div className="flex gap-3">
          <input value={naziv} onChange={e => setNaziv(e.target.value)} placeholder="Naziv kategorije" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <button onClick={dodaj} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
            Dodaj
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-purple-400">Sve kategorije</h2>
        {kategorije.length === 0 && <p className="text-gray-400">Nema kategorija.</p>}
        {kategorije.map(k => (
          <div key={k.id} className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
            {editId === k.id ? (
              <>
                <input value={editNaziv} onChange={e => setEditNaziv(e.target.value)} className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-purple-500" />
                <button onClick={() => sacuvaj(k.id)} className="text-green-400 hover:text-green-300 text-sm transition">Sačuvaj</button>
                <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-300 text-sm transition">Otkaži</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-white">{k.naziv}</span>
                <button onClick={() => { setEditId(k.id); setEditNaziv(k.naziv) }} className="text-purple-400 hover:text-purple-300 text-sm transition">Uredi</button>
                <button onClick={() => obrisi(k.id)} className="text-red-400 hover:text-red-300 text-sm transition">Obriši</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}