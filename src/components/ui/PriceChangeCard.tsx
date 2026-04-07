type PriceChangeCardProps = {
  changePercent: number | null
  periodLabel?: string
  title?: string
}

function PriceChangeCard({
  changePercent,
  periodLabel = '24h',
  title = 'Price Change',
}: PriceChangeCardProps) {
  const isPositive = (changePercent ?? 0) >= 0
  const toneClass =
    changePercent === null
      ? 'text-slate-500 dark:text-slate-400'
      : isPositive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${toneClass}`}>
        {changePercent === null
          ? '--'
          : `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`}
      </p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{periodLabel}</p>
    </section>
  )
}

export type { PriceChangeCardProps }
export default PriceChangeCard