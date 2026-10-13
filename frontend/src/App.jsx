import { useEffect, useState } from 'react'
import { apiRequest } from './services/api.js'

import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider.jsx'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Goals = lazy(() => import('./pages/Goals.jsx'))
const MealForm = lazy(() => import('./pages/MealForm.jsx'))
const Meals = lazy(() => import('./pages/Meals.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Progress = lazy(() => import('./pages/Progress.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const WorkoutForm = lazy(() => import('./pages/WorkoutForm.jsx'))
const Workouts = lazy(() => import('./pages/Workouts.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<main className="route-loading" aria-label="Loading page"><span className="brand-mark">G</span></main>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workouts/new" element={<WorkoutForm />} />
              <Route path="/workouts/:id/edit" element={<WorkoutForm />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/meals/new" element={<MealForm />} />
              <Route path="/meals/:id/edit" element={<MealForm />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}