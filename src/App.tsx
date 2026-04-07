import { Outlet } from 'react-router-dom'
import ThemeToggle from './components/common/ThemeToggle'
import { useTheme } from './utils/useTheme'

function App() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/75 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
            BitPulse
          </p>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App