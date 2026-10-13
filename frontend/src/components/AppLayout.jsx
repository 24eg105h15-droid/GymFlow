import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Activity, Apple, Dumbbell, Flag, LayoutDashboard, LogOut, MoonStar, SunMedium, UserRound, ChartNoAxesCombined } from 'lucide-react'
import { useAuth } from './AuthProvider.jsx'
import ChatbotPanel from './ChatbotPanel.jsx'

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/exercises', label: 'Exercise library', icon: Activity },
  { to: '/meals', label: 'Nutrition', icon: Apple },
  { to: '/goals', label: 'Goals', icon: Flag },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesCombined },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('gymflow-theme') || 'light')

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('gymflow-theme', theme)
  }, [theme])

  function signOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="GymFlow overview">
          <span className="brand-mark">G</span><span>GYMFLOW</span>
        </NavLink>
        <div className="nav-label">YOUR SPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button type="button" className="theme-toggle" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <MoonStar size={15} /> : <SunMedium size={15} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <NavLink to="/profile" className={({ isActive }) => `profile-link${isActive ? ' active' : ''}`}>
            <span className="avatar">{user?.name?.slice(0, 1).toUpperCase() || 'G'}</span>
            <span className="profile-summary"><strong>{user?.name}</strong><small>My profile</small></span>
            <UserRound size={16} />
          </NavLink>
          <button className="signout-button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <main className="main-content"><Outlet /></main>
      <ChatbotPanel user={user} />
    </div>
  )
}