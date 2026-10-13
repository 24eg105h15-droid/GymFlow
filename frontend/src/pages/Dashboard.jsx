import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Plus, Target, Timer, Flame, Dumbbell } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'

const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/progress').then(setSummary).catch((requestError) => setError(requestError.message))
  }, [])

  const calories = summary?.calories || 0
  const target = summary?.calorieTarget || 2000
  const caloriePercent = Math.min(100, Math.round((calories / target) * 100))
  const weights = summary?.weightHistory || []

  return (
    <div className="page-wrap">
      <PageHeading eyebrow={today.toUpperCase()} title="Your overview" description="A clear read on today's training and nutrition." action={<Link to="/workouts/new" className="button button-primary"><Plus size={17} /> Log workout</Link>} />
      {error && <div className="notice notice-error">Could not load your overview: {error}</div>}
      <section className="metric-grid" aria-label="Today's metrics">
        <article className="metric-panel calorie-panel">
          <div className="metric-label"><Flame size={16} /> CALORIES TODAY</div>
          <div className="metric-main"><strong>{calories.toLocaleString()}</strong><span> / {target.toLocaleString()} kcal</span></div>
          <div className="meter"><span style={{ width: `${caloriePercent}%` }} /></div>
          <div className="metric-foot"><span>{summary?.caloriesRemaining ?? target} kcal remaining</span><Link to="/meals">View meals <ArrowRight size={13} /></Link></div>
        </article>
        <article className="metric-panel">
          <div className="metric-label"><Dumbbell size={16} /> THIS WEEK</div>
          <div className="metric-main"><strong>{summary?.workoutsThisWeek ?? '—'}</strong><span> sessions</span></div>
          <div className="metric-foot"><span>Last 7 days</span><Link to="/workouts">Workout log <ArrowRight size={13} /></Link></div>
        </article>
        <article className="metric-panel">
          <div className="metric-label"><Target size={16} /> CURRENT WEIGHT</div>
          <div className="metric-main"><strong>{summary?.currentWeightKg ?? '—'}</strong><span> kg</span></div>
          <div className="metric-foot"><span>Most recent entry</span><Link to="/progress">View progress <ArrowRight size={13} /></Link></div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="surface chart-surface">
          <div className="section-heading"><div><p className="eyebrow">BODY METRICS</p><h2>Weight trend</h2></div><Link className="text-link" to="/progress">Full report <ArrowRight size={14} /></Link></div>
          {weights.length > 1 ? (
            <div className="weight-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weights} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
              <defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9cbd39" stopOpacity={0.25} /><stop offset="100%" stopColor="#9cbd39" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#e8ebe3" vertical={false} />
              <XAxis dataKey="recordedAt" tickFormatter={(value) => value.slice(5)} tickLine={false} axisLine={false} tick={{ fill: '#858b80', fontSize: 11 }} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} axisLine={false} tick={{ fill: '#858b80', fontSize: 11 }} />
              <Tooltip /><Area type="monotone" dataKey="weightKg" stroke="#708b1d" strokeWidth={2.5} fill="url(#weightFill)" />
            </AreaChart></ResponsiveContainer></div>
          ) : <div className="empty-chart"><span className="chart-icon"><Target size={21} /></span><strong>Start your trend line</strong><span>Log a few weigh-ins to see your progress here.</span><Link to="/progress" className="text-link">Add weight <ArrowRight size={14} /></Link></div>}
        </article>
        <article className="surface goal-surface">
          <div className="section-heading"><div><p className="eyebrow">YOUR DIRECTION</p><h2>Active goal</h2></div><Target size={18} /></div>
          {summary?.activeGoal ? <>
            <div className="goal-type">{summary.activeGoal.goalType.replace('_', ' ')}</div>
            <div className="goal-weights"><div><small>NOW</small><strong>{summary.activeGoal.currentWeightKg} <i>kg</i></strong></div><ArrowRight size={17} /><div><small>TARGET</small><strong>{summary.activeGoal.targetWeightKg} <i>kg</i></strong></div></div>
            <div className="meter goal-meter"><span style={{ width: `${summary.activeGoal.progressPercent}%` }} /></div>
            <div className="metric-foot"><span>{summary.activeGoal.progressPercent}% complete</span><Link to="/goals">Goal details <ArrowRight size={13} /></Link></div>
          </> : <div className="empty-goal"><span>Give your training a destination.</span><Link className="button button-secondary" to="/goals"><Plus size={15} /> Set a goal</Link></div>}
        </article>
      </section>

      <section className="surface recent-surface">
        <div className="section-heading"><div><p className="eyebrow">KEEP YOUR RHYTHM</p><h2>Recent workouts</h2></div><Link to="/workouts" className="text-link">All workouts <ArrowRight size={14} /></Link></div>
        {summary?.recentWorkouts?.length ? <div className="recent-list">{summary.recentWorkouts.slice(0, 4).map((workout) => <div className="recent-row" key={workout.id}><span className="recent-glyph"><Dumbbell size={17} /></span><div className="recent-main"><strong>{workout.workoutType}</strong><span>{workout.exerciseLogs.length} exercises · {workout.durationMinutes} min</span></div><span className="recent-date">{workout.workoutDate}</span><Timer size={15} className="row-arrow" /></div>)}</div> : <div className="empty-inline">No workouts logged yet. <Link to="/workouts/new">Add your first session <ArrowUpRight size={14} /></Link></div>}
      </section>
    </div>
  )
}