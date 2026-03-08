import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const API = 'http://localhost:3001';
const BOJE_TERMINI = ['#a855f7', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];
const BOJE_REZERVACIJE = ['#7c3aed', '#0891b2', '#e11d48', '#059669', '#d97706', '#2563eb'];

export default function App() {
  const [termini, setTermini] = useState([]);
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    axios.get(`${API}/izvestaj/termini-po-kategoriji`).then(r => setTermini(r.data));
    axios.get(`${API}/izvestaj/rezervacije-po-datumima`).then(r => setRezervacije(
      r.data.map((d: any) => ({ ...d, datum: new Date(d.datum).toLocaleDateString() }))
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-10 text-purple-400">Portal za izveštavanje</h1>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Rezervisani termini po kategoriji</h2>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={termini}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="naziv" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="brojTermina" radius={[4, 4, 0, 0]}>
                {termini.map((_: any, index: number) => (
                  <Cell key={index} fill={BOJE_TERMINI[index % BOJE_TERMINI.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="w-full text-left bg-gray-900 rounded-xl overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-purple-300">Kategorija</th>
              <th className="p-4 text-pink-300">Broj termina</th>
            </tr>
          </thead>
          <tbody>
            {termini.map((t: any, index: number) => (
              <tr key={t.id} className="border-t border-gray-800">
                <td className="p-4 font-medium" style={{ color: BOJE_TERMINI[index % BOJE_TERMINI.length] }}>{t.naziv}</td>
                <td className="p-4 text-pink-200">{t.brojTermina}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Rezervacije po datumima</h2>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rezervacije}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="datum" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="broj" radius={[4, 4, 0, 0]}>
                {rezervacije.map((_: any, index: number) => (
                  <Cell key={index} fill={BOJE_REZERVACIJE[index % BOJE_REZERVACIJE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="w-full text-left bg-gray-900 rounded-xl overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-cyan-300">Datum</th>
              <th className="p-4 text-emerald-300">Broj rezervacija</th>
            </tr>
          </thead>
          <tbody>
            {rezervacije.map((r: any, index: number) => (
              <tr key={r.id} className="border-t border-gray-800">
                <td className="p-4 font-medium" style={{ color: BOJE_REZERVACIJE[index % BOJE_REZERVACIJE.length] }}>{r.datum}</td>
                <td className="p-4 text-emerald-200">{r.broj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}