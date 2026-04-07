import { useMemo } from 'react'
import { ChartCard, ErrorState, Loader, PriceCard, PriceChangeCard } from '../components/ui'
import { useBitcoinData } from '../features/btc/hooks/useBitcoinData'
import { useAuthStore } from '../store/authStore'

function calculateChangePercent(
  latestPrice: number | null,
  oldestPrice: number | null,
): number | null {
  if (latestPrice === null || oldestPrice === null || oldestPrice === 0) {
    return null
  }

  return ((latestPrice - oldestPrice) / oldestPrice) * 100
}

function Dashboard() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const { price, history, loading, error } = useBitcoinData()

  const latestTimestamp = history.length > 0 ? history[0].timestamp : null
  const oldestPoint = history.length > 0 ? history[history.length - 1] : null

  const changePercent = useMemo(
    () => calculateChangePercent(price, oldestPoint?.price ?? null),
    [price, oldestPoint],
  )

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading && history.length === 0) {
    return <Loader label="Loading Bitcoin data..." size="lg" />
  }

  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Signed in as {user?.email ?? 'Unknown user'}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </section>

      {error ? <ErrorState message={error} onRetry={handleRetry} /> : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PriceCard price={price} updatedAt={latestTimestamp} />
        <PriceChangeCard
          changePercent={changePercent}
          periodLabel="Since earliest cached point"
        />
      </section>

      <ChartCard data={history} title="Bitcoin Price Trend" height={360} />
    </main>
  )
}

export default Dashboard