import { useMemo } from 'react'
import { ChartCard, ErrorState, Loader, PriceCard, PriceChangeCard } from '../components/ui'
import { useBitcoinData, type TimeRange } from '../features/btc/hooks/useBitcoinData'
import { useAuthStore } from '../store/authStore'

const RANGE_OPTIONS: Array<{ label: string; value: TimeRange }> = [
  { label: '1H', value: '1H' },
  { label: '24H', value: '24H' },
  { label: '3D', value: '3D' },
  { label: '7D', value: '7D' },
]

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
  const { price, history, loading, error, range, setRange } = useBitcoinData()

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
    <main className="space-y-5 md:space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Signed in as {user?.email ?? 'Unknown user'}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.99] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Date Range
          </p>

          <div className="flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${range === option.value
                  ? 'border-amber-400 bg-amber-400/20 text-amber-700 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ChartCard data={history} title="Bitcoin Price Trend" height={350} />
    </main>
  )
}

export default Dashboard