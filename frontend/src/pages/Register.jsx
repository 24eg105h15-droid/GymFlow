import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await register({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside"><span className="brand-mark">G</span><span className="auth-aside-kicker">GYMFLOW / YOUR TRAINING LOG</span><p>Make room for<br />the work you do.</p><span className="auth-aside-foot">START WHERE YOU ARE</span></div>
      <section className="auth-panel">
        <Link to="/login" className="auth-wordmark">GYMFLOW</Link>
        <p className="eyebrow">YOUR NEXT REP STARTS HERE</p>
        <h1>Create account</h1>
        <p className="page-description">Set up your personal training log.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Your name<input name="name" autoComplete="name" maxLength="80" required /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" minLength="8" required /><small>Use at least 8 characters.</small></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}