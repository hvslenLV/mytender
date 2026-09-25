import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CopilotRoom from './pages/CopilotRoom'

export type Page = 'landing' | 'dashboard' | 'copilot'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [selectedTender, setSelectedTender] = useState<string | null>(null)

  const goToCopilot = (tenderId: string) => {
    setSelectedTender(tenderId)
    setPage('copilot')
  }

  if (page === 'landing') {
    return <LandingPage onEnterApp={() => setPage('dashboard')} />
  }

  if (page === 'dashboard') {
    return (
      <Dashboard
        onNavigate={setPage}
        onOpenCopilot={goToCopilot}
      />
    )
  }

  if (page === 'copilot') {
    return (
      <CopilotRoom
        tenderId={selectedTender}
        onNavigate={setPage}
      />
    )
  }

  return null
}
