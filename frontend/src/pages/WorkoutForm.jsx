import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'
import { getWorkoutSuggestion } from '../utils/fitness.js'

const today = new Date().toISOString().slice(0, 10)
const defaultSets = () => Array.from({ length: 3 }, (_, index) => ({ setNumber: index + 1, repetitions: 10, weightKg: 0 }))
const emptyLog = () => ({ muscleGroup: '', exerciseId: '', setDetails: defaultSets() })

export default function WorkoutForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)
  const [exercises, setExercises] = useState([])
  const [logs, setLogs] = useState([emptyLog()])
  const [session, setSession] = useState({ workoutType: '', workoutDate: today, durationMinutes: '', notes: '' })
  const [loading, setLoading] = useState(editing)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const selectedExercise = exercises.find((exercise) => String(exercise.id) === String(logs[0]?.exerciseId))
  const recommendation = getWorkoutSuggestion(selectedExercise?.name, selectedExercise?.muscleGroup)
  const muscleGroups = [...new Set(exercises.map((exercise) => exercise.muscleGroup))].sort()

  useEffect(() => {
    let active = true
    Promise.all([
      apiRequest('/exercises'),
      editing ? apiRequest(`/workouts/${id}`) : Promise.resolve(null),
    ]).then(([exerciseData, workout]) => {
      if (!active) return
      setExercises(exerciseData)
      if (workout) {
        setSession({
          workoutType: workout.workoutType,
          workoutDate: workout.workoutDate,
          durationMinutes: String(workout.durationMinutes),
          notes: workout.notes || '',
        })
        setLogs(workout.exerciseLogs.map((log) => ({
          muscleGroup: log.muscleGroup,
          exerciseId: String(log.exerciseId),
          setDetails: log.setDetails?.length
            ? log.setDetails.map((set, index) => ({ ...set, setNumber: index + 1 }))
            : Array.from({ length: log.sets || 1 }, (_, index) => ({
                setNumber: index + 1,
                repetitions: log.repetitions,
                weightKg: log.weightKg,
              })),
        })))
      }
    }).catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [editing, id])

  function updateLog(index, field, value) {
    setLogs((current) => current.map((log, logIndex) => logIndex === index
      ? { ...log, [field]: value, ...(field === 'muscleGroup' ? { exerciseId: '' } : {}) }
      : log))
  }

  function updateSet(logIndex, setIndex, field, value) {
    setLogs((current) => current.map((log, index) => index === logIndex
      ? { ...log, setDetails: log.setDetails.map((set, currentSetIndex) => currentSetIndex === setIndex ? { ...set, [field]: value } : set) }
      : log))
  }

  function addSet(logIndex) {
    setLogs((current) => current.map((log, index) => {
      if (index !== logIndex) return log
      const previousSet = log.setDetails.at(-1)
      return { ...log, setDetails: [...log.setDetails, { setNumber: log.setDetails.length + 1, repetitions: previousSet?.repetitions ?? 10, weightKg: previousSet?.weightKg ?? 0 }] }
    }))
  }

  function removeSet(logIndex, setIndex) {
    setLogs((current) => current.map((log, index) => index === logIndex
      ? { ...log, setDetails: log.setDetails.filter((_, currentSetIndex) => currentSetIndex !== setIndex).map((set, index) => ({ ...set, setNumber: index + 1 })) }
      : log))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await apiRequest(editing ? `/workouts/${id}` : '/workouts', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify({
          workoutType: session.workoutType,
          workoutDate: session.workoutDate,
          durationMinutes: Number(session.durationMinutes),
          notes: session.notes,
          exerciseLogs: logs.map((log) => {
            const setDetails = log.setDetails.map((set, index) => ({
              setNumber: index + 1,
              repetitions: Number(set.repetitions),
              weightKg: Number(set.weightKg),
            }))
            return {
              exerciseId: Number(log.exerciseId),
              sets: setDetails.length,
              repetitions: setDetails[0].repetitions,
              weightKg: setDetails[0].weightKg,
              setDetails,
            }
          }),
        }),
      })
      navigate('/workouts')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-wrap narrow-page">
      <Link to="/workouts" className="back-link"><ArrowLeft size={15} /> Workouts</Link>
      <PageHeading eyebrow="TRAINING LOG" title={editing ? 'Edit workout' : 'Log a workout'} description={editing ? 'Update session details and exercise logs.' : 'Record the session while it is fresh.'} />
      {loading && <p className="food-match-note">Loading workout...</p>}
      <form className="surface form-surface" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>Workout type<input name="workoutType" value={session.workoutType} onChange={(event) => setSession((current) => ({ ...current, workoutType: event.target.value }))} placeholder="Upper body" maxLength="60" required /></label>
          <label>Workout date<input name="workoutDate" type="date" value={session.workoutDate} onChange={(event) => setSession((current) => ({ ...current, workoutDate: event.target.value }))} required /></label>
          <label>Duration<input name="durationMinutes" type="number" min="1" max="1440" placeholder="45" value={session.durationMinutes} onChange={(event) => setSession((current) => ({ ...current, durationMinutes: event.target.value }))} required /><small>Minutes</small></label>
          <label className="span-all">Notes<textarea name="notes" rows="2" maxLength="1000" placeholder="How did the session feel?" value={session.notes} onChange={(event) => setSession((current) => ({ ...current, notes: event.target.value }))} /></label>
        </div>
        <div className="form-section-heading"><div><p className="eyebrow">EXERCISE DETAILS</p><h2>Exercises</h2></div><button type="button" className="button button-secondary button-small" onClick={() => setLogs((current) => [...current, emptyLog()])}><Plus size={15} /> Add exercise</button></div>
        {logs.map((log, index) => <div className="log-editor" key={index}>
          <label>Body part<select required value={log.muscleGroup} onChange={(event) => updateLog(index, 'muscleGroup', event.target.value)}><option value="">Choose body part</option>{muscleGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          <label className="exercise-picker">Exercise<select required value={log.exerciseId} disabled={!log.muscleGroup} onChange={(event) => updateLog(index, 'exerciseId', event.target.value)}><option value="">{log.muscleGroup ? 'Choose exercise' : 'Choose a body part first'}</option>{exercises.filter((exercise) => exercise.muscleGroup === log.muscleGroup).map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select></label>
          <button type="button" className="icon-button delete-button" aria-label="Remove exercise" title="Remove exercise" disabled={logs.length === 1} onClick={() => setLogs((current) => current.filter((_, logIndex) => logIndex !== index))}><Trash2 size={16} /></button>
          <div className="workout-set-fields">
            <div className="workout-set-heading"><strong>Set details</strong><button type="button" className="button button-secondary button-small" onClick={() => addSet(index)}><Plus size={14} /> Add set</button></div>
            {log.setDetails.map((set, setIndex) => <div className="workout-set-row" key={setIndex}>
              <span className="workout-set-number">Set {setIndex + 1}</span>
              <label>Reps<input type="number" min="1" value={set.repetitions} onChange={(event) => updateSet(index, setIndex, 'repetitions', event.target.value)} required /></label>
              <label>Weight<input type="number" min="0" step="0.5" value={set.weightKg} onChange={(event) => updateSet(index, setIndex, 'weightKg', event.target.value)} required /><small>kg</small></label>
              <button type="button" className="icon-button delete-button" aria-label={`Remove set ${setIndex + 1}`} title="Remove set" disabled={log.setDetails.length === 1} onClick={() => removeSet(index, setIndex)}><Trash2 size={15} /></button>
            </div>)}
          </div>
        </div>)}
        {selectedExercise && (
          <div className="recommendation-box">
            <p className="eyebrow">PROGRESSION TIP</p>
            <strong>{selectedExercise.name}</strong>
            <p>{recommendation}</p>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><Link to="/workouts" className="button button-quiet">Cancel</Link><button className="button button-primary" disabled={busy || loading}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save workout'}</button></div>
      </form>
    </div>
  )
}