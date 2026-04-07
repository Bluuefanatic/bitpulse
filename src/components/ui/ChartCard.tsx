import PriceLineChart, { type PriceLinePoint } from './PriceLineChart'

type PriceHistoryPoint = PriceLinePoint

type ChartCardProps = {
  data: PriceHistoryPoint[]
  title?: string
  height?: number
}

function ChartCard({ data, title = 'Price History', height = 320 }: ChartCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <PriceLineChart data={data} height={height} />
    </section>
  )
}

export type { ChartCardProps, PriceHistoryPoint }
export default ChartCard