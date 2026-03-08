import { useEffect, useState } from 'react'
import { api } from '../../api/api'

interface Valuta { id: number; naziv: string; kod: string }
interface Settings {
  naziv: string; lokacija: string; opis: string; radnoVreme: string
  popustDatum?: string; dozvoljeneValute: { valuta: Valuta }[]
}

export default function AdminPodesavanja() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [valute, setValute] = useState<Valuta[]>([])
  const [odabraneValuteIds, setOdabraneValuteIds] = useState<number[]>([])
  const [naziv, setNaziv] = useState('')
  const [lokacija, setLokacija] = useState('')
  const [opis, setOpis] = useState('')
  const [radnoVreme, setRadnoVreme] = useState('')
  const [popustDatum, setPopustDatum] = useState('')
  const [uspeh, setUspeh] = useState(false)

  useEffect(() => {
    Promise.all([api.getSettings(), api.getValute()]).then(([s, v]: [Settings, Valuta[]]) => {
      if (s) {
        setNaziv(s.naziv ?? '')
        setLokacija(s.lokacija ?? '')
        setOpis(s.opis ?? '')
        setRadnoVreme(s.radnoVreme ?? '')
        setPopustDatum(s.popustDatum ? new Date(s.popustDatum).toISOString().split('T')[0] : '')
        setOdabraneValuteIds(s.dozvoljeneValute?.map(dv => dv.valuta.id) ?? [])
      }
      setValute(Array.isArray(v) ? v : [])
      setLoading(false)
    })
  }, [])

  const toggleValuta = (id: number) => {
    setOdabraneValuteIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  const sacuvaj = async () => {
    setSaving(true)
    setUspeh(false)
    await api.upsertSettings({
      naziv, lokacija, opis, radnoVreme,
      popustDatum: popustDatum ? new Date(popustDatum) : undefined,
      valutaIds: odabraneValuteIds,
    })
    setSaving(false)
    setUspeh(true)
    setTimeout(() => setUspeh(false), 3000)
  }

  const inputCls = "bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full"

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-purple-400 text-xl animate-pulse">Učitavanje...</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Podešavanja salona</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Osnovne informacije</h2>
        <div className="space-y-3">
          <input value={naziv} onChange={e => setNaziv(e.target.value)} placeholder="Naziv salona" className={inputCls} />
          <input value={lokacija} onChange={e => setLokacija(e.target.value)} placeholder="Lokacija" className={inputCls} />
          <textarea value={opis} onChange={e => setOpis(e.target.value)} placeholder="Opis" rows={3} className={inputCls} />
          <input value={radnoVreme} onChange={e => setRadnoVreme(e.target.value)} placeholder="Radno vreme (npr. Pon-Pet 09:00-20:00)" className={inputCls} />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Popust</h2>
        <div className="space-y-1">
          <label className="text-gray-400 text-sm">Datum do kada važi 10% popust</label>
          <input type="date" value={popustDatum} onChange={e => setPopustDatum(e.target.value)} className={inputCls} />
        </div>
        {popustDatum && (
          <p className="text-green-400 text-sm">
            {new Date() <= new Date(popustDatum) ? '✅ Popust je trenutno aktivan' : '⚠️ Popust je istekao'}
          </p>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Dozvoljene valute</h2>
        <div className="space-y-2">
          {valute.map(v => (
            <label key={v.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={odabraneValuteIds.includes(v.id)}
                onChange={() => toggleValuta(v.id)}
                className="accent-purple-500 w-4 h-4"
              />
              <span className="text-white">{v.naziv} ({v.kod})</span>
            </label>
          ))}
        </div>
      </div>

      {uspeh && <p className="text-green-400 text-sm">✅ Podešavanja su sačuvana!</p>}

      <button onClick={sacuvaj} disabled={saving} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
        {saving ? 'Čuvanje...' : 'Sačuvaj podešavanja'}
      </button>
    </div>
  )
}