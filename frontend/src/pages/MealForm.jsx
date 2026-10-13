import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import PageHeading from '../components/PageHeading.jsx'
import { estimateFoodNutrition, FOOD_OPTIONS, getFoodUnit } from '../utils/foodNutrition.js'

const today = new Date().toISOString().slice(0, 10)
const blankFood = () => ({ name: '', amount: '100', calories: '', proteinGrams: '', carbohydrateGrams: '', fatGrams: '' })

export default function MealForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)
  const fileInputRef = useRef(null)
  const [items, setItems] = useState([blankFood()])
  const [mealDate, setMealDate] = useState(today)
  const [mealType, setMealType] = useState('BREAKFAST')
  const [dailySummary, setDailySummary] = useState(null)
  const [loadingMeal, setLoadingMeal] = useState(editing)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (!id) return
    let active = true
    apiRequest(`/meals/${id}`)
      .then((meal) => {
        if (!active) return
        setMealDate(meal.mealDate)
        setMealType(meal.mealType)
        setItems(meal.foodItems.map((item) => ({
          name: item.name,
          amount: '',
          calories: String(item.calories),
          proteinGrams: String(item.proteinGrams),
          carbohydrateGrams: String(item.carbohydrateGrams),
          fatGrams: String(item.fatGrams),
        })))
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoadingMeal(false) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    let active = true
    apiRequest(`/meals/summary?date=${mealDate}`)
      .then((summary) => { if (active) setDailySummary(summary) })
      .catch(() => { if (active) setDailySummary(null) })
    return () => { active = false }
  }, [mealDate])

  function changeItem(index, field, value) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  const totals = items.reduce((sum, item) => {
    const nutrition = (!editing && estimateFoodNutrition(item.name, item.amount)) || item
    return {
      calories: sum.calories + (Number(nutrition.calories) || 0),
      proteinGrams: sum.proteinGrams + (Number(nutrition.proteinGrams) || 0),
      carbohydrateGrams: sum.carbohydrateGrams + (Number(nutrition.carbohydrateGrams) || 0),
      fatGrams: sum.fatGrams + (Number(nutrition.fatGrams) || 0),
    }
  }, { calories: 0, proteinGrams: 0, carbohydrateGrams: 0, fatGrams: 0 })

  function handlePhotoCapture(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    event.target.value = ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await apiRequest(editing ? `/meals/${id}` : '/meals', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify({
          mealDate: form.get('mealDate'),
          mealType: form.get('mealType'),
          foodItems: items.map((item) => ({
            name: item.name,
            ...(!editing && estimateFoodNutrition(item.name, item.amount) || {
              calories: Number(item.calories),
              proteinGrams: Number(item.proteinGrams),
              carbohydrateGrams: Number(item.carbohydrateGrams),
              fatGrams: Number(item.fatGrams),
            }),
          })),
        }),
      })
      navigate('/meals')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-wrap narrow-page">
      <Link to="/meals" className="back-link"><ArrowLeft size={15} /> Nutrition</Link>
      <PageHeading eyebrow="NUTRITION LOG" title={editing ? 'Edit meal' : 'Add a meal'} description={editing ? 'Update the meal details and saved nutrition values.' : 'Enter foods and portion sizes to estimate calories and macros.'} />
      {loadingMeal && <p className="food-match-note">Loading meal...</p>}
      <form className="surface form-surface" onSubmit={handleSubmit}>
        <div className="camera-strip">
          <button type="button" className="button button-secondary" onClick={() => fileInputRef.current?.click()}>
            <Camera size={15} /> Use camera
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} hidden />
          {photoPreview && <span className="food-photo-label">Food photo captured</span>}
        </div>
        {photoPreview && <img className="meal-photo-preview" src={photoPreview} alt="Meal preview" />}
        <div className="form-grid"><label>Meal<input name="mealDate" type="date" value={mealDate} onChange={(event) => setMealDate(event.target.value)} required /></label><label>Meal type<select name="mealType" value={mealType} onChange={(event) => setMealType(event.target.value)}><option value="BREAKFAST">Breakfast</option><option value="LUNCH">Lunch</option><option value="DINNER">Dinner</option><option value="SNACK">Snack</option></select></label></div>
        <div className="form-section-heading"><div><p className="eyebrow">FOOD ITEMS</p><h2>Nutrition details</h2></div><button type="button" className="button button-secondary button-small" onClick={() => setItems((current) => [...current, blankFood()])}><Plus size={15} /> Add item</button></div>
        {!editing && <p className="food-match-note">Add each food separately, such as rice and curry. Enter the grams for each; totals combine automatically.</p>}
        {items.map((item, index) => {
          const nutrition = !editing && estimateFoodNutrition(item.name, item.amount)
          const unit = getFoodUnit(item.name)
          const amountUnit = unit === 'slice' ? (Number(item.amount) === 1 ? 'slice' : 'slices') : unit
          return <div className="food-editor" key={index}>
            <div className="food-editor-top">
              <label>Food name<input list="gymflow-food-options" value={item.name} onChange={(event) => changeItem(index, 'name', event.target.value)} maxLength="120" required placeholder="Type or choose a food, e.g. banana" /></label>
              <button className="icon-button delete-button" type="button" aria-label="Remove food" title="Remove food" disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={16} /></button>
            </div>
            {!editing && <label className="food-amount">{unit === 'slice' ? 'Slices' : `Amount (${unit})`}<input type="number" min="1" max={unit === 'slice' ? '100' : '5000'} step={unit === 'slice' ? '0.5' : '1'} value={item.amount} onChange={(event) => changeItem(index, 'amount', event.target.value)} required /></label>}
            {!editing && <p className="food-match-note">{nutrition ? `Estimated values for ${item.amount} ${amountUnit} of ${item.name}.` : 'Choose a suggested food for an estimate, or enter the nutrition values manually.'}</p>}
            <div className="form-grid macro-inputs">
              <label>Calories<input type="number" min="0" value={nutrition?.calories ?? item.calories} onChange={(event) => changeItem(index, 'calories', event.target.value)} readOnly={Boolean(nutrition)} required /></label>
              <label>Protein (g)<input type="number" min="0" step="0.1" value={nutrition?.proteinGrams ?? item.proteinGrams} onChange={(event) => changeItem(index, 'proteinGrams', event.target.value)} readOnly={Boolean(nutrition)} required /></label>
              <label>Carbs (g)<input type="number" min="0" step="0.1" value={nutrition?.carbohydrateGrams ?? item.carbohydrateGrams} onChange={(event) => changeItem(index, 'carbohydrateGrams', event.target.value)} readOnly={Boolean(nutrition)} required /></label>
              <label>Fat (g)<input type="number" min="0" step="0.1" value={nutrition?.fatGrams ?? item.fatGrams} onChange={(event) => changeItem(index, 'fatGrams', event.target.value)} readOnly={Boolean(nutrition)} required /></label>
            </div>
          </div>
        })}
        {!editing && <datalist id="gymflow-food-options">{FOOD_OPTIONS.map((food) => <option key={food} value={food} />)}</datalist>}
        <section className="nutrition-live-summary" aria-live="polite">
          <div className="nutrition-live-stat"><span>THIS MEAL</span><strong>{totals.calories} kcal</strong></div>
          <div className="nutrition-live-stat"><span>PROTEIN</span><strong>{totals.proteinGrams.toFixed(1)} g</strong></div>
          <div className="nutrition-live-stat"><span>CARBS</span><strong>{totals.carbohydrateGrams.toFixed(1)} g</strong></div>
          <div className="nutrition-live-stat"><span>FAT</span><strong>{totals.fatGrams.toFixed(1)} g</strong></div>
          {dailySummary && <div className="nutrition-live-stat remaining"><span>EST. LEFT TODAY</span><strong>{Math.max(0, dailySummary.caloriesRemaining - totals.calories)} kcal</strong></div>}
        </section>
        {error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><Link to="/meals" className="button button-quiet">Cancel</Link><button className="button button-primary" disabled={busy || loadingMeal}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save meal'}</button></div>
      </form>
    </div>
  )
}