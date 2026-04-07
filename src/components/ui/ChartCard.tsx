import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type PriceHistoryPoint = {
  price: number
  timestamp: number
}

type ChartCardProps = {
  data: PriceHistoryPoint[]
  title?: string
  height?: number
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function ChartCard({ data, title = 'Price History', height = 320 }: ChartCardProps) {
  const chartData = [...data]
    .sort((left, right) => left.timestamp - right.timestamp)
    .map((point) => ({
      ...point,
      label: formatTime(point.timestamp),
    }))

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>

      {chartData.length === 0 ? (
        <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No chart data yet.
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} minTickGap={24} />
              <YAxis
                tick={{ fontSize: 12 }}
                width={90}
                tickFormatter={(value: number) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value) => {
                  const numericValue =
                    typeof value === 'number' ? value : Number(value ?? 0)
                  return formatCurrency(numericValue)
                }}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as PriceHistoryPoint | undefined
                  return item ? formatTime(item.timestamp) : ''
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export type { ChartCardProps, PriceHistoryPoint }
export default ChartCard