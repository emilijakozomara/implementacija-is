import { useEffect, useState } from 'react'
import { api } from '../api/api'

interface Kategorija { id: number; naziv: string }
interface Usluga { id: number; naziv: string; opis: string; trajanje: number; cena: number; kategorijaId: number }
interface Drzava { id: number; naziv: string }
interface Valuta { id: number; naziv: string; kod: string }
interface Settings { popustDatum?: string; dozvoljeneValute: { valuta: Valuta }[] }
interface OdabranaUsluga { uslugaId: number; terminVreme: string; naziv: string; cena: number }

export default function NovaRezervacija() {
  const [kategorije, setKategorije] = useState<Kategorija[]>([])
  const [usluge, setUsluge] = useState<Usluga[]>([])
  const [drzave, setDrzave] = useState<Drzava[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [ime, setIme] = useState('')
  const [prezime, setPrezime] = useState('')
  const [adresa, setAdresa] = useState('')
  const [postanskiBroj, setPostanskiBroj] = useState('')
  const [mesto, setMesto] = useState('')
  const [drzavaId, setDrzavaId] = useState<number>(0)
  const [email, setEmail] = useState('')
  const [valutaId, setValutaId] = useState<number>(0)
  const [promoKod, setPromoKod] = useState('')
  const [odabraneUsluge, setOdabraneUsluge] = useState<OdabranaUsluga[]>([])
  const [datum, setDatum] = useState('')
  const [termini, setTermini] = useState<Record<number, string[]>>({})
  const [rezultat, setRezultat] = useState<any>(null)
  const [greska, setGreska] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [konvertovanaCena, setKonvertovanaCena] = useState<number | null>(null)
  const [konvertujem, setKonvertujem] = useState(false)

  const ima10Popust = settings?.popustDatum ? new Date() <= new Date(settings.popustDatum) : false
  const valute = settings?.dozvoljeneValute?.map(dv => dv.valuta) ?? []
  const odabranaValuta = valute.find(v => v.id === valutaId)
  const ukupno = odabraneUsluge.reduce((sum, u) => sum + u.cena, 0)

  useEffect(() => {
    Promise.all([
      api.getKategorije(),
      api.getUsluge(),
      api.getDrzave(),
      api.getSettings(),
    ]).then(([k, u, d, s]) => {
      setKategorije(Array.isArray(k) ? k : [])
      setUsluge(Array.isArray(u) ? u : [])
      setDrzave(Array.isArray(d) ? d : [])
      setSettings(s)
      if (s?.dozvoljeneValute?.[0]?.valuta?.id) {
        setValutaId(s.dozvoljeneValute[0].valuta.id)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!odabranaValuta || ukupno === 0) {
      setKonvertovanaCena(null)
      return
    }
    if (odabranaValuta.kod === 'RSD') {
      setKonvertovanaCena(ukupno)
      return
    }
    setKonvertujem(true)
    api.getKurs('RSD', odabranaValuta.kod, ukupno)
      .then(res => {
        setKonvertovanaCena(res.konvertovanaCena ?? res)
        setKonvertujem(false)
      })
      .catch(() => setKonvertujem(false))
  }, [valutaId, ukupno])

  const ucitajTermine = async (uslugaId: number, d: string) => {
    if (!d) return
    const result = await api.getSlobodniTermini(uslugaId, d)
    setTermini(prev => ({ ...prev, [uslugaId]: Array.isArray(result) ? result : [] }))
  }

  const dodajUslugu = (usluga: Usluga, termin: string) => {
    if (!termin) return
    const vec = odabraneUsluge.find(o => o.uslugaId === usluga.id && o.terminVreme === termin)
    if (vec) return
    let cena = Number(usluga.cena)
    if (ima10Popust) cena = cena * 0.9
    setOdabraneUsluge(prev => [...prev, { uslugaId: usluga.id, terminVreme: termin, naziv: usluga.naziv, cena }])
  }

  const ukloniUslugu = (index: number) => {
    setOdabraneUsluge(prev => prev.filter((_, i) => i !== index))
  }

  const submit = async () => {
    setGreska('')
    if (!ime || !prezime || !adresa || !postanskiBroj || !mesto || !drzavaId || !email || !valutaId) {
      setGreska('Molimo popunite sva obavezna polja.')
      return
    }
    if (odabraneUsluge.length === 0) {
      setGreska('Odaberite bar jednu uslugu.')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.createRezervacija({
        ime, prezime, adresa, postanskiBroj, mesto, drzavaId, email, valutaId,
        korisceniPromoKod: promoKod || undefined,
        usluge: odabraneUsluge.map(o => ({ uslugaId: o.uslugaId, terminVreme: o.terminVreme })),
      })
      if (res.sifra) setRezultat(res)
      else setGreska(res.message || 'Greška pri kreiranju rezervacije.')
    } catch (err: any) {
      const poruka = err?.response?.data?.message || err?.message || ''
      if (poruka.toLowerCase().includes('promo') || poruka.toLowerCase().includes('kod')) {
        setGreska('Promo kod je već iskorišćen ili nije validan.')
      } else if (poruka) {
        setGreska(poruka)
      } else {
        setGreska('Greška pri kreiranju rezervacije.')
      }
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-purple-400 text-xl animate-pulse">Učitavanje...</div>
    </div>
  )

  if (rezultat) return (
    <div className="max-w-lg mx-auto bg-gray-900 border border-purple-800 rounded-2xl p-8 text-center space-y-4">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold text-white">Rezervacija kreirana!</h2>
      <p className="text-gray-400">Sačuvajte vaše podatke za pristup rezervaciji:</p>
      <div className="bg-gray-800 rounded-xl p-4 space-y-2">
        <p className="text-gray-400 text-sm">Šifra</p>
        <p className="text-purple-400 text-2xl font-bold">{rezultat.sifra}</p>
      </div>
      <div className="bg-gray-800 rounded-xl p-4 space-y-2">
        <p className="text-gray-400 text-sm">Promo kod za sledeću rezervaciju</p>
        <p className="text-green-400 text-xl font-bold">{rezultat.promoKod?.kod}</p>
        <p className="text-gray-500 text-xs">Daje 5% popusta</p>
      </div>
      <p className="text-gray-500 text-sm">Email: {rezultat.email}</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Nova rezervacija</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Lični podaci</h2>
        <div className="grid grid-cols-2 gap-4">
          <input value={ime} onChange={e => setIme(e.target.value)} placeholder="Ime *" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <input value={prezime} onChange={e => setPrezime(e.target.value)} placeholder="Prezime *" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <input value={adresa} onChange={e => setAdresa(e.target.value)} placeholder="Adresa *" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <input value={postanskiBroj} onChange={e => setPostanskiBroj(e.target.value)} placeholder="Poštanski broj *" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <input value={mesto} onChange={e => setMesto(e.target.value)} placeholder="Mesto *" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          <select value={drzavaId} onChange={e => setDrzavaId(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
            <option value={0}>Država *</option>
            {drzave.map(d => <option key={d.id} value={d.id}>{d.naziv}</option>)}
          </select>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" type="email" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 col-span-2" />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Odabir usluga</h2>
        <input type="date" value={datum} onChange={e => { setDatum(e.target.value); usluge.forEach(u => ucitajTermine(u.id, e.target.value)) }} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
        {kategorije.map(kat => {
          const uslugeKat = usluge.filter(u => u.kategorijaId === kat.id)
          if (uslugeKat.length === 0) return null
          return (
            <div key={kat.id} className="space-y-3">
              <h3 className="text-purple-300 font-medium">{kat.naziv}</h3>
              {uslugeKat.map(u => {
                let cena = Number(u.cena)
                if (ima10Popust) cena = cena * 0.9
                return (
                  <div key={u.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium">{u.naziv}</p>
                      <p className="text-gray-400 text-sm">{u.trajanje} min · {ima10Popust ? <><span className="line-through text-gray-500">{Number(u.cena)}</span> <span className="text-green-400">{cena.toFixed(0)}</span></> : cena} RSD</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm focus:outline-none" id={`termin-${u.id}`}>
                        <option value="">Termin</option>
                        {(termini[u.id] ?? []).map(t => <option key={t} value={t}>{new Date(t).toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit' })}</option>)}
                      </select>
                      <button onClick={() => { const sel = document.getElementById(`termin-${u.id}`) as HTMLSelectElement; dodajUslugu(u, sel.value) }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition">
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {odabraneUsluge.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-purple-400">Odabrane usluge</h2>
          {odabraneUsluge.map((o, i) => (
            <div key={i} className="flex justify-between items-center text-white">
              <span>{o.naziv} · {new Date(o.terminVreme).toLocaleString('sr')}</span>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">{o.cena.toFixed(0)} RSD</span>
                <button onClick={() => ukloniUslugu(i)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-3 space-y-1">
            <div className="flex justify-between font-bold text-white">
              <span>Ukupno (RSD)</span>
              <span className="text-purple-400">{ukupno.toFixed(0)} RSD</span>
            </div>
            {odabranaValuta && odabranaValuta.kod !== 'RSD' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ukupno ({odabranaValuta.kod})</span>
                <span className="text-green-400">
                  {konvertujem ? 'Učitavanje...' : konvertovanaCena !== null ? `${konvertovanaCena.toFixed(2)} ${odabranaValuta.kod}` : '-'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">Plaćanje</h2>
        <select value={valutaId} onChange={e => setValutaId(Number(e.target.value))} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 w-full">
          {valute.map(v => <option key={v.id} value={v.id}>{v.naziv} ({v.kod})</option>)}
        </select>
        <input value={promoKod} onChange={e => setPromoKod(e.target.value)} placeholder="Promo kod (opciono)" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full" />
      </div>

      {greska && <p className="text-red-400 text-sm">{greska}</p>}

      <button onClick={submit} disabled={submitting} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
        {submitting ? 'Kreiranje...' : 'Kreiraj rezervaciju'}
      </button>
    </div>
  )
}