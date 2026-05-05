import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Logo = ({ subtitle }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-black/5">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
    <span className="font-extrabold tracking-tight text-gray-900 text-lg">MedConnect</span>
    {subtitle ? (
      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold ml-1 ring-1 ring-gray-200">
        {subtitle}
      </span>
    ) : null}
  </div>
)

const BackButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition disabled:opacity-40 disabled:hover:text-gray-500"
    aria-label="Go back"
  >
    <span className="text-lg leading-none transition-transform group-hover:-translate-x-0.5">←</span>
    <span className="hidden sm:inline">Back</span>
  </button>
)

export default function AppHeader({
  role = 'patient',
  title = '',
  links = [],
  onLogout,
  fallbackPath,
  showBack = true,
  subtitle,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const computedFallback = useMemo(() => {
    if (fallbackPath) return fallbackPath
    if (role === 'doctor') return '/doctor/dashboard'
    if (role === 'admin') return '/admin/dashboard'
    return '/home'
  }, [fallbackPath, role])

  const backDisabled = !showBack || location.pathname === computedFallback

  const handleBack = () => {
    if (backDisabled) return
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(computedFallback)
  }

  const isActiveLink = (path) => {
    if (!path) return false
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? <BackButton onClick={handleBack} disabled={backDisabled} /> : null}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />
          <button
            onClick={() => navigate(computedFallback)}
            className="flex items-center gap-2 min-w-0 rounded-xl px-1.5 py-1 hover:bg-gray-50 transition"
          >
            <Logo subtitle={subtitle} />
          </button>
          {title ? (
            <span className="hidden md:inline text-sm text-gray-400 truncate">
              <span className="mx-1.5 text-gray-200">/</span>
              {title}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`relative text-sm font-medium px-2.5 py-1.5 rounded-lg transition ${
                isActiveLink(link.path)
                  ? 'text-green-700 bg-green-50 ring-1 ring-green-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          {typeof onLogout === 'function' ? (
            <button
              onClick={onLogout}
              className="text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition ring-1 ring-red-100"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  )
}

