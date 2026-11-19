import { useState, type FormEvent } from 'react'
import { api } from '../api'

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.login(password)
      onSuccess()
    } catch {
      setError('Wrong password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="bezel login-card">
        <div className="card">
          <span className="label">Schematic</span>
          <h1>Enter to view</h1>
          <p>Shared access for client-facing project schematics.</p>
          <form onSubmit={submit}>
            <input
              type="password"
              autoFocus
              placeholder="Site password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="error">{error}</p> : null}
            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Checking…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
