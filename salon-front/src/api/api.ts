const BASE_URL = 'http://localhost:3000';

export const api = {
  getSettings: () =>
    fetch(`${BASE_URL}/app-settings`).then(r => r.json()),

  getKategorije: () =>
    fetch(`${BASE_URL}/kategorija`).then(r => r.json()),

  getUsluge: () =>
    fetch(`${BASE_URL}/usluga`).then(r => r.json()),

  getUsluga: (id: number) =>
    fetch(`${BASE_URL}/usluga/${id}`).then(r => r.json()),

  getSlobodniTermini: (id: number, datum: string) =>
    fetch(`${BASE_URL}/usluga/${id}/termini?datum=${datum}`).then(r => r.json()),

  getDrzave: () =>
    fetch(`${BASE_URL}/drzava`).then(r => r.json()),

  getValute: () =>
    fetch(`${BASE_URL}/valuta`).then(r => r.json()),

  getKurs: (iz: string, u: string, cena: number) =>
    fetch(`${BASE_URL}/valuta/kurs?iz=${iz}&u=${u}&cena=${cena}`).then(r => r.json()),

  createRezervacija: (data: any) =>
    fetch(`${BASE_URL}/rezervacija`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getRezervacija: (email: string, sifra: string) =>
    fetch(`${BASE_URL}/rezervacija?email=${email}&sifra=${sifra}`).then(r => r.json()),

  dodajUslugu: (data: any) =>
    fetch(`${BASE_URL}/rezervacija/dodaj-uslugu`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  ukloniUslugu: (id: number, email: string, sifra: string) =>
    fetch(`${BASE_URL}/rezervacija/ukloni-uslugu/${id}?email=${email}&sifra=${sifra}`, {
      method: 'DELETE',
    }).then(r => r.json()),

  otkaziRezervaciju: (email: string, sifra: string) =>
    fetch(`${BASE_URL}/rezervacija/otkazi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, sifra }),
    }).then(r => r.json()),

  upsertSettings: (data: any) =>
    fetch(`${BASE_URL}/app-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  createKategorija: (naziv: string) =>
    fetch(`${BASE_URL}/kategorija`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv }),
    }).then(r => r.json()),

  updateKategorija: (id: number, naziv: string) =>
    fetch(`${BASE_URL}/kategorija/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv }),
    }).then(r => r.json()),

  deleteKategorija: (id: number) =>
    fetch(`${BASE_URL}/kategorija/${id}`, { method: 'DELETE' }).then(r => r.json()),

  createUsluga: (data: any) =>
    fetch(`${BASE_URL}/usluga`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateUsluga: (id: number, data: any) =>
    fetch(`${BASE_URL}/usluga/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deleteUsluga: (id: number) =>
    fetch(`${BASE_URL}/usluga/${id}`, { method: 'DELETE' }).then(r => r.json()),
};