import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api'
import { LoginPage } from './pages/LoginPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectPage } from './pages/ProjectPage'

export default function App() {
  const [auth, setAuth] = useState<'loading' | 'yes' | 'no'>('loading')

  const refresh = useCallback(() => {
    api
      .me()
      .then(() => setAuth('yes'))
      .catch(() => setAuth('no'))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function logout() {
    await api.logout().catch(() => undefined)
    setAuth('no')
  }

  if (auth === 'loading') {
    return (
      <div className="shell page-head">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (auth === 'no') {
    return <LoginPage onSuccess={() => setAuth('yes')} />
  }

  return (
    <Routes>
      <Route path="/" element={<ProjectsPage onLogout={logout} />} />
      <Route path="/p/:slug" element={<ProjectPage onLogout={logout} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
