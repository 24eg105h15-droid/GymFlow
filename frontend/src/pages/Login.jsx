import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await login({ email: form.get('email'), password: form.get('password') })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside"><span className="brand-mark">G</span><span className="auth-aside-kicker">GYMFLOW / YOUR TRAINING LOG</span><p>Progress is built<br />one session at a time.</p><span className="auth-aside-foot">TRAIN WITH INTENTION</span></div>
      <section className="auth-panel">
        <Link to="/login" className="auth-wordmark">GYMFLOW</Link>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in</h1>
        <p className="page-description">Pick up where your last session left off.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New to GymFlow? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}