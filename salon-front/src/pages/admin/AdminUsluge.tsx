import { useEffect, useState } from 'react'
import { api } from '../../api/api'

interface Kategorija { id: number; naziv: string }
interface Usluga {
  id: number; naziv: string; opis: string; trajanje: number
  maxKlijenataPoTerminu: number; vremePocetkaPrvog: string
  vremeZavrsetkaPoslednjeg: string; cena: number; kategorijaId: number
}

const praznaUsluga = {
  naziv: '', opis: '', trajanje: 60, maxKlijenataPoTerminu: 1,
  vremePocetkaPrvog: '09:00', vremeZavrsetkaPoslednjeg: '20:00',
  cena: 0, kategorijaId: 0
}

export default function AdminUsluge() {
  const [usluge, setUsluge] = useState<Usluga[]>([])
  const [kategorije, setKategorije] = useState<Kategorija[]>([])
  const [loading, setLoading] = useState(true)
  const [forma, setForma] = useState(praznaUsluga)
  const [editId, setEditId] = useState<number | null>(null)
  const [prikaziFormu, setPrikaziFormu] = useState(false)

  const ucitaj = () =>
    Promise.all([api.getUsluge(), api.getKategorije()]).then(([u, k]) => {
      setUsluge(Array.isArray(u) ? u : [])
      setKategorije(Array.isArray(k) ? k : [])
      setLoading(false)
    })

  useEffect(() => { ucitaj() }, [])

  const resetuj = () => { setForma(praznaUsluga); setEditId(null); setPrikaziFormu(false) }

  const sacuvaj = async () => {
    if (!forma.naziv || !forma.kategorijaId) return
    const data = {
      ...forma,
      vremePocetkaPrvog: new Date(`2024-01-01T${forma.vremePocetkaPrvog}:00`),
      vremeZavrsetkaPoslednjeg: new Date(`2024-01-01T${forma.vremeZavrsetkaPoslednjeg}:00`),
    }
    if (editId) await api.updateUsluga(editId, data)
    else await api.createUsluga(data)
    resetuj()
    ucitaj()
  }

  const uredi = (u: Usluga) => {
    setForma({
      naziv: u.naziv, opis: u.opis, trajanje: u.trajanje,
      maxKlijenataPoTerminu: u.maxKlijenataPoTerminu,
      vremePocetkaPrvog: new Date(u.vremePocetkaPrvog).toTimeString().slice(0, 5),
      vremeZavrsetkaPoslednjeg: new Date(u.vremeZavrsetkaPoslednjeg).toTimeString().slice(0, 5),
      cena: u.cena, kategorijaId: u.kategorijaId
    })
    setEditId(u.id)
    setPrikaziFormu(true)
  }

  const obrisi = async (id: number) => {
    if (!window.confirm('Obrisati uslugu?')) return
    await api.deleteUsluga(id)
    ucitaj()
  }

  const inputCls = "bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full"

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-purple-400 text-xl animate-pulse">Učitavanje...</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Usluge</h1>
        <button onClick={() => { resetuj(); setPrikaziFormu(true) }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
          + Nova usluga
        </button>
      </div>

      {prikaziFormu && (
        <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-purple-400">{editId ? 'Uredi uslugu' : 'Nova usluga'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input value={forma.naziv} onChange={e => setForma(p => ({ ...p, naziv: e.target.value }))} placeholder="Naziv *" className={inputCls} />
            <select value={forma.kategorijaId} onChange={e => setForma(p => ({ ...p, kategorijaId: Number(e.target.value) }))} className={inputCls}>
              <option value={0}>Kategorija *</option>
              {kategorije.map(k => <option key={k.id} value={k.id}>{k.naziv}</option>)}
            </select>
            <input value={forma.opis} onChange={e => setForma(p => ({ ...p, opis: e.target.value }))} placeholder="Opis" className={`${inputCls} col-span-2`} />
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Trajanje (min)</label>
              <input type="number" value={forma.trajanje} onChange={e => setForma(p => ({ ...p, trajanje: Number(e.target.value) }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Max klijenata po terminu</label>
              <input type="number" value={forma.maxKlijenataPoTerminu} onChange={e => setForma(p => ({ ...p, maxKlijenataPoTerminu: Number(e.target.value) }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Početak prvog termina</label>
              <input type="time" value={forma.vremePocetkaPrvog} onChange={e => setForma(p => ({ ...p, vremePocetkaPrvog: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Kraj poslednjeg termina</label>
              <input type="time" value={forma.vremeZavrsetkaPoslednjeg} onChange={e => setForma(p => ({ ...p, vremeZavrsetkaPoslednjeg: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Cena (RSD)</label>
              <input type="number" value={forma.cena} onChange={e => setForma(p => ({ ...p, cena: Number(e.target.value) }))} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={sacuvaj} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
              {editId ? 'Sačuvaj' : 'Dodaj'}
            </button>
            <button onClick={resetuj} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition">
              Otkaži
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {usluge.length === 0 && <p className="text-gray-400">Nema usluga.</p>}
        {usluge.map(u => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-white font-semibold">{u.naziv}</p>
              <p className="text-gray-400 text-sm">{u.opis}</p>
              <p className="text-gray-500 text-xs">{u.trajanje} min · max {u.maxKlijenataPoTerminu} klijenta · {Number(u.cena)} RSD</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => uredi(u)} className="text-purple-400 hover:text-purple-300 text-sm transition">Uredi</button>
              <button onClick={() => obrisi(u.id)} className="text-red-400 hover:text-red-300 text-sm transition">Obriši</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}