import { useEffect, useState } from 'react'
import { Flag, Plus, Target } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import { useAuth } from '../components/AuthProvider.jsx'
import PageHeading from '../components/PageHeading.jsx'

const goalLabel = { FAT_LOSS: 'Fat loss', MUSCLE_GAIN: 'Muscle gain', MAINTENANCE: 'Weight maintenance' }

export default function Goals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadGoals() {
    try { setGoals(await apiRequest('/goals')); setError('') }
    catch (requestError) { setError(requestError.message) }
  }

  useEffect(() => { loadGoals() }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await apiRequest('/goals/active', { method: 'PUT', body: JSON.stringify({ goalType: form.get('goalType'), currentWeightKg: Number(form.get('currentWeightKg')), targetWeightKg: Number(form.get('targetWeightKg')), targetDate: form.get('targetDate') }) })
      event.currentTarget.reset()
      await loadGoals()
    } catch (requestError) {
      setError(requestError.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="page-wrap">
      <PageHeading eyebrow="INTENTIONS & MILESTONES" title="Fitness goals" description="Choose a direction and check in as you go." />
      <div className="goals-layout">
        <form className="surface form-surface goal-form" onSubmit={handleSubmit}>
          <div className="form-section-heading"><div><p className="eyebrow">SET YOUR DIRECTION</p><h2>New active goal</h2></div><Target size={18} /></div>
          <label>Goal type<select name="goalType" defaultValue="FAT_LOSS"><option value="FAT_LOSS">Fat loss</option><option value="MUSCLE_GAIN">Muscle gain</option><option value="MAINTENANCE">Weight maintenance</option></select></label>
          <div className="form-grid"><label>Current weight<input name="currentWeightKg" type="number" min="20" max="400" step="0.1" defaultValue={user?.weightKg ?? ''} required /><small>kg</small></label><label>Target weight<input name="targetWeightKg" type="number" min="20" max="400" step="0.1" required /><small>kg</small></label></div>
          <label>Target date<input name="targetDate" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}><Plus size={16} /> {busy ? 'Saving…' : 'Set active goal'}</button>
        </form>
        <section className="goal-history"><div className="section-heading"><div><p className="eyebrow">YOUR HISTORY</p><h2>Goals</h2></div></div>
          {!goals.length ? <div className="surface empty-inline">Your goal history will appear here.</div> : goals.map((goal) => <article className={`surface goal-history-card${goal.active ? ' is-active' : ''}`} key={goal.id}><div className="goal-history-top"><span className="goal-history-icon"><Flag size={16} /></span><span className={`status-tag${goal.active ? ' status-active' : ''}`}>{goal.active ? 'ACTIVE' : 'PAST'}</span></div><h3>{goalLabel[goal.goalType]}</h3><p className="goal-date">Target date · {goal.targetDate}</p><div className="goal-history-numbers"><div><small>NOW</small><strong>{goal.currentWeightKg} kg</strong></div><span>→</span><div><small>TARGET</small><strong>{goal.targetWeightKg} kg</strong></div></div><div className="meter"><span style={{ width: `${goal.progressPercent}%` }} /></div><div className="metric-foot"><span>{goal.progressPercent}% complete</span><span>{goal.active ? 'Current focus' : ''}</span></div></article>)}
        </section>
      </div>
    </div>
  )
}