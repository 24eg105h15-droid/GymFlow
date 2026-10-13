import { useEffect, useMemo, useState } from 'react'
import { Activity, Search } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([])
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All groups')
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/exercises').then(setExercises).catch((requestError) => setError(requestError.message))
  }, [])

  const groups = ['All groups', ...new Set(exercises.map((exercise) => exercise.muscleGroup))]
  const visible = useMemo(() => exercises.filter((exercise) =>
    (group === 'All groups' || exercise.muscleGroup === group)
      && exercise.name.toLowerCase().includes(query.toLowerCase())), [exercises, group, query])

  return (
    <div className="page-wrap">
      <PageHeading eyebrow="MOVEMENT INDEX" title="Exercise library" description="Browse movements by name or muscle group." />
      <div className="library-toolbar"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exercises" aria-label="Search exercises" /></label><select value={group} onChange={(event) => setGroup(event.target.value)} aria-label="Filter muscle group">{groups.map((item) => <option key={item}>{item}</option>)}</select><span className="result-count">{visible.length} movements</span></div>
      {error && <div className="notice notice-error">{error}</div>}
      <section className="exercise-grid">{visible.map((exercise, index) => <article className="surface exercise-card" key={exercise.id}><div className="exercise-card-top"><span className={`exercise-number tint-${index % 4}`}>{String(index + 1).padStart(2, '0')}</span><span className="group-tag">{exercise.muscleGroup}</span></div><h2>{exercise.name}</h2><p>{exercise.description || 'Movement in the GymFlow exercise library.'}</p></article>)}</section>
      {!visible.length && <div className="surface empty-state compact-empty"><Activity size={20} /><p>No movements match these filters.</p></div>}
    </div>
  )
}