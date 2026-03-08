import { useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import NovaRezervacija from './pages/NovaRezervacija'
import MojaRezervacija from './pages/MojaRezervacija'
import AdminSettings from './pages/admin/AdminPodesavanja'
import AdminKategorije from './pages/admin/AdminKategorije'
import AdminUsluge from './pages/admin/AdminUsluge'

export type Page = 'home' | 'nova' | 'moja' | 'admin-settings' | 'admin-kategorije' | 'admin-usluge'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  const renderPage = () => {
    switch(page) {
      case 'home': return <Home />
      case 'nova': return <NovaRezervacija />
      case 'moja': return <MojaRezervacija />
      case 'admin-settings': return <AdminSettings />
      case 'admin-kategorije': return <AdminKategorije />
      case 'admin-usluge': return <AdminUsluge />
    }
  }

  return (
    <Layout setPage={setPage}>
      {renderPage()}
    </Layout>
  )
}