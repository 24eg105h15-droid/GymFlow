const foods = [
  ['Apple', 52, 0.3, 13.8, 0.2],
  ['Banana', 89, 1.1, 22.8, 0.3],
  ['Orange', 47, 0.9, 11.8, 0.1],
  ['Blueberries', 57, 0.7, 14.5, 0.3],
  ['Strawberries', 32, 0.7, 7.7, 0.3],
  ['Avocado', 160, 2, 8.5, 14.7],
  ['White rice, cooked', 130, 2.7, 28.2, 0.3, 'rice|cooked rice|rice, cooked|white rice|basmati rice, cooked'],
  ['Brown rice, cooked', 123, 2.7, 25.6, 1, 'brown rice'],
  ['Roti / chapati', 297, 9, 46, 7.5, 'roti|chapati'],
  ['Oats, dry', 389, 16.9, 66.3, 6.9, 'oats|rolled oats'],
  ['Protein oats, dry mix', 375, 24, 55, 7.5, 'protein oats|protein oatmeal'],
  ['Protein muesli, dry', 392, 20, 60, 8, 'protein muesli|high protein muesli'],
  ['Idli', 58, 2, 12, 0.4],
  ['Dosa', 168, 4, 28, 4],
  ['Poha, prepared', 130, 2.5, 25, 2.5, 'poha'],
  ['Curry, mixed (average)', 130, 5, 12, 7, 'curry'],
  ['Vegetable curry (average)', 110, 3, 12, 5.5, 'vegetable curry'],
  ['Chicken curry (average)', 160, 15, 5, 9, 'chicken curry'],
  ['Paneer curry (average)', 190, 9, 8, 14, 'paneer curry'],
  ['Lentils / dal, cooked', 116, 9, 20.1, 0.4, 'dal|lentils|dal, cooked'],
  ['Chickpeas, cooked', 164, 8.9, 27.4, 2.6, 'chickpeas|chana'],
  ['Kidney beans, cooked', 127, 8.7, 22.8, 0.5, 'rajma|kidney beans'],
  ['Paneer', 265, 18.3, 1.2, 20.8],
  ['Tofu, firm', 144, 17.3, 2.8, 8.7, 'tofu'],
  ['Greek yogurt, plain', 97, 9, 3.9, 5, 'greek yogurt'],
  ['Curd / plain yogurt', 61, 3.5, 4.7, 3.3, 'curd|plain yogurt|yogurt'],
  ['Milk, whole', 61, 3.2, 4.8, 3.3, 'whole milk|milk', 'ml'],
  ['Egg, whole', 143, 12.6, 0.7, 9.5, 'egg|whole egg'],
  ['Egg white', 52, 10.9, 0.7, 0.2],
  ['Chicken breast, cooked', 165, 31, 0, 3.6, 'chicken breast|chicken, cooked'],
  ['Chicken thigh, cooked', 209, 26, 0, 10.9],
  ['Salmon, cooked', 206, 22.1, 0, 12.4, 'salmon'],
  ['Tuna, canned in water', 116, 25.5, 0, 0.8, 'tuna'],
  ['Lean beef, cooked', 217, 26, 0, 11.8, 'beef'],
  ['Potato, boiled', 87, 1.9, 20.1, 0.1, 'potato|boiled potato'],
  ['Sweet potato, cooked', 90, 2, 20.7, 0.2, 'sweet potato'],
  ['Broccoli, cooked', 35, 2.4, 7.2, 0.4, 'broccoli'],
  ['Spinach, cooked', 23, 3, 3.8, 0.3, 'spinach'],
  ['Tomato', 18, 0.9, 3.9, 0.2],
  ['Cucumber', 15, 0.7, 3.6, 0.1],
  ['Carrot', 41, 0.9, 9.6, 0.2],
  ['Almonds', 579, 21.2, 21.6, 49.9, 'almond'],
  ['Peanut butter', 588, 25, 20, 50],
  ['Peanuts', 567, 25.8, 16.1, 49.2, 'peanut'],
  ['Walnuts', 654, 15.2, 13.7, 65.2, 'walnut'],
  ['Olive oil', 884, 0, 0, 100],
  ['Butter', 717, 0.9, 0.1, 81.1],
  ['Cheddar cheese', 403, 25, 1.3, 33.1, 'cheddar'],
  ['Whey protein powder', 400, 80, 8, 6, 'whey protein'],
  ['White bread', 266, 8.9, 49, 3.2, 'bread|white bread', 'slice', 30],
  ['Whole wheat bread', 247, 13, 41, 4.2, 'wholemeal bread', 'slice', 30],
  ['Protein bread, average', 270, 21, 33, 6, 'protein bread|high protein bread', 'slice', 40],
  ['Pasta, cooked', 158, 5.8, 30.9, 0.9, 'pasta'],
  ['Quinoa, cooked', 120, 4.4, 21.3, 1.9, 'quinoa'],
  ['Dark chocolate', 598, 7.8, 45.9, 42.6],
]

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const foodIndex = new Map()
for (const [name, calories, proteinGrams, carbohydrateGrams, fatGrams, aliases = '', unit = 'g', gramsPerUnit = 1] of foods) {
  const nutrition = { name, calories, proteinGrams, carbohydrateGrams, fatGrams, unit, gramsPerUnit }
  for (const alias of [name, ...aliases.split('|')]) {
    foodIndex.set(normalize(alias), nutrition)
  }
}

export const FOOD_OPTIONS = foods.map(([name]) => name)

export function getFoodUnit(name) {
  return foodIndex.get(normalize(name))?.unit || 'g'
}

export function estimateFoodNutrition(name, amount) {
  const base = foodIndex.get(normalize(name))
  const quantity = Number(amount)
  if (!base || !Number.isFinite(quantity) || quantity <= 0) return null

  const scale = quantity * base.gramsPerUnit / 100
  return {
    calories: Math.round(base.calories * scale),
    proteinGrams: Math.round(base.proteinGrams * scale * 10) / 10,
    carbohydrateGrams: Math.round(base.carbohydrateGrams * scale * 10) / 10,
    fatGrams: Math.round(base.fatGrams * scale * 10) / 10,
  }
}