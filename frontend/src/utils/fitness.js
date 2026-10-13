export function calculateMaintenanceCalories(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null

  const height = Number(heightCm)
  const weight = Number(weightKg)

  if (!Number.isFinite(height) || !Number.isFinite(weight)) return null

  const baseCalories = weight * 22 + height * 0.6
  return Math.round(baseCalories * 1.15)
}

export function getWorkoutSuggestion(exerciseName = '', muscleGroup = '') {
  const name = (exerciseName || '').toLowerCase()
  const group = (muscleGroup || '').toLowerCase()

  const groupRules = {
    chest: 'Add 2.5 kg only when you complete all sets at the top of the rep range. Aim for 8–12 reps across 3–4 sets.',
    legs: 'Add 5 kg when you hit the top end of the rep range on all working sets. Aim for 6–10 reps across 3–4 sets.',
    back: 'Add 2.5–5 kg once you can complete every set at the target rep range cleanly. Aim for 8–12 reps across 3 sets.',
    shoulders: 'Add 2.5 kg when your final reps still feel controlled. Aim for 10–15 reps across 3 sets.',
    biceps: 'Add 1.25–2.5 kg when you can hit the top of the rep bracket. Aim for 8–12 reps across 3 sets.',
    triceps: 'Add 2.5 kg only when your final reps stay strict. Aim for 10–12 reps across 3 sets.',
    default: 'Add a small progressive load next session and keep the rep range controlled. Aim for 3 sets of 8–12 reps.'
  }

  const matchedRule = groupRules[group] || groupRules.default

  if (name.includes('bench') || name.includes('press')) {
    return 'Progressive overload tip: add 2.5 kg next session if you finish all sets with 1–2 reps left in reserve. Keep 3 sets of 8–12 reps.'
  }

  if (name.includes('squat') || name.includes('deadlift') || name.includes('leg press')) {
    return 'Progressive overload tip: add 5 kg when all sets stay strong. Keep 3–4 sets of 6–10 reps with controlled tempo.'
  }

  return matchedRule
}

export function getChatbotReply(input, user) {
  const normalized = (input || '').toLowerCase()
  const weight = Number(user?.weightKg)
  const height = Number(user?.heightCm)
  const calorieTarget = Number(user?.calorieTarget)
  const hasWeight = Number.isFinite(weight) && weight > 0
  const hasHeight = Number.isFinite(height) && height > 0
  const maintenance = hasWeight && hasHeight ? calculateMaintenanceCalories(height, weight) : null
  const dailyCalories = Number.isFinite(calorieTarget) && calorieTarget > 0 ? calorieTarget : maintenance

  if (/\b(protein|muscle gain|build muscle)\b/.test(normalized)) {
    if (!hasWeight) return 'A practical protein range for many adults who train is about 1.6–2.2 g per kg of body weight per day. Add your current weight in Profile and I can estimate your personal range. Spread protein across meals; this is general guidance, not a medical prescription.'
    const minimum = Math.round(weight * 1.6)
    const maximum = Math.round(weight * 2.2)
    return `Using your saved weight of ${weight} kg, a practical training-day protein range is about ${minimum}–${maximum} g/day (1.6–2.2 g/kg). You can split it across 3–5 meals. This is general guidance; individual needs can vary.`
  }

  if (/\b(macro|macros|carb|carbohydrate|fat intake)\b/.test(normalized)) {
    if (!hasWeight || !dailyCalories) return 'Macros are protein, carbohydrates, and fat. For a personalised estimate, add your weight and daily calorie target in Profile. As a general starting point, protein is often set around 1.6–2.2 g/kg/day, with fats and carbohydrates adjusted to your calorie target and preferences.'
    const protein = Math.round(weight * 1.8)
    const fat = Math.round(weight * 0.8)
    const carbs = Math.max(0, Math.round((dailyCalories - protein * 4 - fat * 9) / 4))
    return `Using ${dailyCalories} kcal/day and ${weight} kg, one rough macro starting point is ${protein} g protein, ${carbs} g carbohydrates, and ${fat} g fat per day. This uses 1.8 g/kg protein and 0.8 g/kg fat; it is a flexible estimate, not a strict requirement.`
  }

  if (/\b(calorie|calories|maintenance|maintain|weight loss|lose fat|gain weight|surplus|deficit)\b/.test(normalized)) {
    if (!maintenance) return 'I need your height and weight from Profile to estimate maintenance calories. The estimate is still approximate because age, sex, and activity level are not included. Track your average weight and intake for a few weeks to fine-tune it.'
    const targetNote = dailyCalories && dailyCalories !== maintenance ? ` Your saved daily target is ${dailyCalories} kcal.` : ''
    return `Your rough maintenance estimate from saved height and weight is about ${maintenance} kcal/day.${targetNote} Maintenance also depends on age, sex, activity, and individual variation, so treat this as a starting estimate and adjust from your weight trend over 2–3 weeks.`
  }

  if (/\b(fiber|fibre)\b/.test(normalized)) {
    const target = dailyCalories ? Math.round(dailyCalories / 1000 * 14) : null
    return target ? `A common general fiber guideline is about 14 g per 1,000 kcal, which is roughly ${target} g/day at your saved calorie target. Increase gradually and drink fluids; personal needs can vary.` : 'A common general fiber guideline is about 14 g per 1,000 kcal. Beans, lentils, vegetables, fruit, oats, and whole grains are useful sources. Increase fiber gradually and drink fluids.'
  }

  if (/\b(water|hydration|drink)\b/.test(normalized)) {
    if (!hasWeight) return 'A broad starting estimate is about 30–35 ml of fluids per kg of body weight daily, with more needed in heat or during sweaty training. Add your weight to Profile for a rough calculation; follow medical fluid limits if you have them.'
    return `At ${weight} kg, 30–35 ml/kg works out to roughly ${Math.round(weight * 30 / 100) / 10}–${Math.round(weight * 35 / 100) / 10} litres of fluids daily as a starting estimate. Heat, exercise, and medical advice can change this.`
  }

  if (/\b(pre workout|before workout|before training|post workout|after workout|after training)\b/.test(normalized)) {
    return 'Before training, try a familiar meal 1–3 hours beforehand with carbohydrates and some protein, such as yogurt with fruit or rice with eggs. After training, have a normal meal with protein and carbohydrates when convenient; total daily intake matters more than a narrow timing window.'
  }

  if (/\b(meal|nutrition|diet|eat|food)\b/.test(normalized)) {
    return 'Build most meals around a protein source, vegetables or fruit, a carbohydrate source, and some healthy fat. For tracking, add each food as a separate item and enter its portion; packaged-food labels are more accurate than GymFlow’s generic estimates. Ask me about calories, protein, macros, fiber, hydration, or workout meals.'
  }

  if (/\b(workout|exercise|lift|sets|reps)\b/.test(normalized)) {
    return 'A practical starting structure is 2–4 working sets per exercise, usually 6–15 controlled reps depending on the movement. When you reach the top of your rep range with good form and a couple of reps in reserve, increase the load slightly. Stop if you feel sharp pain.'
  }

  return 'I can help estimate calories and maintenance, protein and macro ranges, fiber, hydration, meal ideas, and workout progression. Ask one of those directly; personalised estimates use the height, weight, and calorie target saved in your Profile.'
}
