import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Apple, ArrowRight, Flame, Pencil, Plus, Trash2 } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'

export default function Meals() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [meals, setMeals] = useState([])
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [mealData, summaryData] = await Promise.all([
        apiRequest(`/meals?date=${date}`),
        apiRequest(`/meals/summary?date=${date}`),
      ])
      setMeals(mealData)
      setSummary(summaryData)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { refresh() }, [date])

  async function removeMeal(id) {
    try {
      await apiRequest(`/meals/${id}`, { method: 'DELETE' })
      await refresh()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="page-wrap">
      <PageHeading eyebrow="NUTRITION LOG" title="Meals & calories" description="A daily view of what fuels your training." action={<Link to="/meals/new" className="button button-primary"><Plus size={17} /> Add meal</Link>} />
      <section className="nutrition-overview">
        <article className="nutrition-total"><div className="metric-label"><Flame size={16} /> DAILY INTAKE</div><div className="nutrition-big"><strong>{summary?.calories ?? '—'}</strong><span>kcal</span></div><div className="meter"><span style={{ width: `${summary ? Math.min(100, summary.calories / summary.calorieTarget * 100) : 0}%` }} /></div><div className="metric-foot"><span>Target {summary?.calorieTarget ?? '—'} kcal</span><strong>{summary?.caloriesRemaining ?? '—'} remaining</strong></div></article>
        <article className="nutrition-macros"><p className="eyebrow">MACROS</p><div className="macro-row"><span><i className="macro-dot protein" /> Protein</span><strong>{summary?.proteinGrams?.toFixed(1) ?? '—'} <small>g</small></strong></div><div className="macro-row"><span><i className="macro-dot carbs" /> Carbohydrates</span><strong>{summary?.carbohydrateGrams?.toFixed(1) ?? '—'} <small>g</small></strong></div><div className="macro-row"><span><i className="macro-dot fats" /> Fat</span><strong>{summary?.fatGrams?.toFixed(1) ?? '—'} <small>g</small></strong></div></article>
      </section>
      <div className="meal-list-heading"><div><p className="eyebrow">YOUR FOOD LOG</p><h2>Meals</h2></div><label className="date-field">Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div>
      {error && <div className="notice notice-error">{error}</div>}
      {!meals.length ? <div className="surface empty-inline meal-empty"><span>No meals recorded for this day.</span><Link to="/meals/new">Add food <ArrowRight size={14} /></Link></div> : <section className="meal-list">{meals.map((meal) => <article className="surface meal-card" key={meal.id}><div className="meal-card-heading"><div className="meal-label"><span className="meal-icon"><Apple size={16} /></span><div><p className="eyebrow">{meal.mealType}</p><strong>{meal.calories} kcal</strong></div></div><div className="meal-actions"><Link to={`/meals/${meal.id}/edit`} className="icon-button" title="Edit meal" aria-label={`Edit ${meal.mealType.toLowerCase()} meal`}><Pencil size={16} /></Link><button className="icon-button delete-button" title="Delete meal" aria-label="Delete meal" onClick={() => removeMeal(meal.id)}><Trash2 size={16} /></button></div></div><div className="food-item-list">{meal.foodItems.map((item) => <div className="food-row" key={item.id}><span>{item.name}</span><span>{item.calories} kcal</span></div>)}</div></article>)}</section>}
    </div>
  )
}