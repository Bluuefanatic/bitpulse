import { useAuthStore } from '../store/authStore'

function Dashboard() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <main className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Signed in as {user?.email ?? 'Unknown user'}
      </p>

      <button
        type="button"
        onClick={logout}
        className="mt-5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Logout
      </button>
    </main>
  )
}

export default Dashboard