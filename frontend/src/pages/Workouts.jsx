import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Dumbbell, Pencil, Plus, Trash2 } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')

  async function refresh() {
    try {
      setWorkouts(await apiRequest('/workouts'))
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { refresh() }, [])

  async function removeWorkout(id) {
    if (!window.confirm('Delete this workout session?')) return
    try {
      await apiRequest(`/workouts/${id}`, { method: 'DELETE' })
      await refresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="page-wrap">
      <PageHeading eyebrow="TRAINING LOG" title="Workouts" description="Every session, exercise, and rep in one place." action={<Link to="/workouts/new" className="button button-primary"><Plus size={17} /> Add workout</Link>} />
      {error && <div className="notice notice-error">{error}</div>}
      {!workouts.length ? <div className="surface empty-state"><span className="empty-symbol"><Dumbbell size={22} /></span><h2>No sessions logged</h2><p>Your workout history will build here as you train.</p><Link to="/workouts/new" className="button button-primary">Log your first workout</Link></div> :
        <section className="workout-list">{workouts.map((workout) => <article className="surface workout-card" key={workout.id}>
          <div className="workout-card-head"><span className="workout-icon"><Dumbbell size={18} /></span><div className="workout-name"><p className="eyebrow">{workout.workoutDate}</p><h2>{workout.workoutType}</h2></div><span className="duration-chip"><Clock3 size={14} /> {workout.durationMinutes} min</span><div className="workout-actions"><Link to={`/workouts/${workout.id}/edit`} className="icon-button" title="Edit workout" aria-label={`Edit ${workout.workoutType} workout`}><Pencil size={16} /></Link><button type="button" className="icon-button delete-button" title="Delete workout" aria-label={`Delete ${workout.workoutType} workout`} onClick={() => removeWorkout(workout.id)}><Trash2 size={16} /></button></div></div>
          <div className="workout-exercises">{workout.exerciseLogs.map((log) => <div className="exercise-log-row" key={log.id}><strong>{log.exerciseName}</strong><div className="workout-set-summary">{(log.setDetails || []).map((set, index) => <span key={set.id ?? index}>Set {set.setNumber}: {set.repetitions} reps · {set.weightKg} kg</span>)}</div></div>)}</div>
          {workout.notes && <p className="workout-note">{workout.notes}</p>}
        </article>)}</section>}
    </div>
  )
}