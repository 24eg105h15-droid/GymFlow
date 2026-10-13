import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, Plus, TrendingUp } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'

export default function Progress() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [weight, setWeight] = useState('')
  const [saved, setSaved] = useState(false)

  async function refresh() {
    try { setSummary(await apiRequest('/progress')); setError('') }
    catch (requestError) { setError(requestError.message) }
  }

  useEffect(() => { refresh() }, [])

  async function addWeight(event) {
    event.preventDefault()
    setSaved(false)
    try {
      await apiRequest('/progress/weights', { method: 'POST', body: JSON.stringify({ recordedAt: new Date().toISOString().slice(0, 10), weightKg: Number(weight) }) })
      setWeight('')
      setSaved(true)
      await refresh()
    } catch (requestError) { setError(requestError.message) }
  }

  const weights = summary?.weightHistory ?? []
  const calorieData = summary ? [{ name: 'Consumed', value: summary.calories }, { name: 'Remaining', value: summary.caloriesRemaining }] : []

  return (
    <div className="page-wrap">
      <PageHeading eyebrow="CONSISTENCY OVER TIME" title="Progress" description="Patterns matter more than a single day." action={<Link to="/goals" className="button button-secondary"><TrendingUp size={16} /> View goals</Link>} />
      {error && <div className="notice notice-error">{error}</div>}
      <section className="progress-stat-row"><article className="surface progress-stat"><span className="eyebrow">CURRENT WEIGHT</span><strong>{summary?.currentWeightKg ?? '—'} <small>kg</small></strong><span>Latest recorded entry</span></article><article className="surface progress-stat"><span className="eyebrow">WORKOUTS / 7 DAYS</span><strong>{summary?.workoutsThisWeek ?? '—'}</strong><span>Sessions logged this week</span></article><article className="surface progress-stat"><span className="eyebrow">CALORIES TODAY</span><strong>{summary?.calories ?? '—'} <small>kcal</small></strong><span>{summary?.caloriesRemaining ?? '—'} kcal remaining</span></article></section>
      <section className="progress-chart-grid">
        <article className="surface chart-surface progress-weight-chart"><div className="section-heading"><div><p className="eyebrow">WEIGHT HISTORY</p><h2>Body weight</h2></div><form className="quick-weight-form" onSubmit={addWeight}><label><span className="visually-hidden">Weight in kilograms</span><input type="number" min="20" max="400" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="kg" required /></label><button className="icon-button add-weight-button" title="Log weight" aria-label="Log weight"><Plus size={17} /></button></form></div>
          {saved && <p className="success-note">Weight entry added.</p>}
          {weights.length > 1 ? <div className="weight-chart tall-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weights} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9cbd39" stopOpacity={0.25} /><stop offset="100%" stopColor="#9cbd39" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#e8ebe3" vertical={false} /><XAxis dataKey="recordedAt" tickFormatter={(value) => value.slice(5)} tickLine={false} axisLine={false} tick={{ fill: '#858b80', fontSize: 11 }} /><YAxis domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} axisLine={false} tick={{ fill: '#858b80', fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="weightKg" stroke="#708b1d" strokeWidth={2.5} fill="url(#progressFill)" /></AreaChart></ResponsiveContainer></div> : <div className="empty-chart"><span className="chart-icon"><TrendingUp size={21} /></span><strong>More entries, clearer trends</strong><span>Log weight regularly to see your line take shape.</span></div>}
        </article>
        <article className="surface chart-surface calorie-chart"><div className="section-heading"><div><p className="eyebrow">DAILY INTAKE</p><h2>Calories today</h2></div></div>{summary ? <><div className="calorie-chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={calorieData} layout="vertical" margin={{ top: 4, right: 6, left: 4, bottom: 0 }}><CartesianGrid stroke="#e8ebe3" horizontal={false} /><XAxis type="number" hide /><YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={74} tick={{ fill: '#747a70', fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#9cbd39" radius={[0, 4, 4, 0]} barSize={18} /></BarChart></ResponsiveContainer></div><div className="calorie-caption"><strong>{summary.calories} <small>kcal</small></strong><span>of {summary.calorieTarget} kcal target</span></div></> : <div className="empty-inline">Nutrition summary is loading.</div>}</article>
      </section>
      <section className="surface progress-goal-strip"><div className="goal-strip-icon"><TrendingUp size={18} /></div><div><p className="eyebrow">FITNESS GOAL</p><strong>{summary?.activeGoal ? `${summary.activeGoal.progressPercent}% toward ${summary.activeGoal.targetWeightKg} kg` : 'No active goal set'}</strong></div><Link to="/goals" className="text-link">{summary?.activeGoal ? 'Goal details' : 'Set a goal'} <ArrowRight size={14} /></Link></section>
    </div>
  )
}