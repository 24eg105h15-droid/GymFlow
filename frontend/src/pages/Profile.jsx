import { useEffect, useState } from 'react'
import { Check, Save, UserRound } from 'lucide-react'
import { apiRequest } from '../services/api.js'
import { useAuth } from '../components/AuthProvider.jsx'
import PageHeading from '../components/PageHeading.jsx'
import { calculateMaintenanceCalories } from '../utils/fitness.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(user)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const maintenanceCalories = calculateMaintenanceCalories(profile?.heightCm, profile?.weightKg)

  useEffect(() => {
    apiRequest('/users/me').then(setProfile).catch((requestError) => setError(requestError.message))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaved(false)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const result = await apiRequest('/users/me', { method: 'PUT', body: JSON.stringify({ name: form.get('name'), heightCm: form.get('heightCm') ? Number(form.get('heightCm')) : null, weightKg: form.get('weightKg') ? Number(form.get('weightKg')) : null, calorieTarget: Number(form.get('calorieTarget')) }) })
      setProfile(result)
      updateUser(result)
      setSaved(true)
    } catch (requestError) { setError(requestError.message) }
  }

  return (
    <div className="page-wrap narrow-page">
      <PageHeading eyebrow="ACCOUNT SETTINGS" title="Profile" description="Your details and daily nutrition target." />
      <form className="surface form-surface profile-form" onSubmit={handleSubmit}>
        <div className="profile-banner"><span className="profile-large-avatar"><UserRound size={25} /></span><div><p className="eyebrow">GYMFLOW MEMBER</p><strong>{profile?.email}</strong></div></div>
        {maintenanceCalories && (
          <div className="maintenance-card">
            <span className="eyebrow">ESTIMATED MAINTENANCE</span>
            <strong>{maintenanceCalories} kcal/day</strong>
            <small>Based on your current height and weight.</small>
          </div>
        )}
        <div className="form-grid"><label className="span-all">Name<input name="name" maxLength="80" defaultValue={profile?.name || ''} key={profile?.name} required /></label><label>Height<input name="heightCm" type="number" min="80" max="250" defaultValue={profile?.heightCm ?? ''} key={`height-${profile?.heightCm}`} /><small>cm</small></label><label>Current weight<input name="weightKg" type="number" min="20" max="400" step="0.1" defaultValue={profile?.weightKg ?? ''} key={`weight-${profile?.weightKg}`} /><small>kg</small></label><label className="span-all">Daily calorie target<input name="calorieTarget" type="number" min="500" max="10000" defaultValue={profile?.calorieTarget ?? maintenanceCalories ?? 2000} key={`calories-${profile?.calorieTarget}`} required /><small>kcal</small></label></div>
        {error && <p className="form-error" role="alert">{error}</p>}{saved && <p className="success-note"><Check size={15} /> Profile saved.</p>}<div className="form-actions"><button className="button button-primary"><Save size={16} /> Save profile</button></div>
      </form>
    </div>
  )
}