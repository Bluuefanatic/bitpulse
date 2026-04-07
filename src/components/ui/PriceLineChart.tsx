import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type PriceLinePoint = {
  price: number
  timestamp: number
}

type PriceLineChartProps = {
  data: PriceLinePoint[]
  height?: number
  className?: string
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

function PriceLineChart({ data, height = 320, className }: PriceLineChartProps) {
  const chartData = [...data]
    .sort((left, right) => left.timestamp - right.timestamp)
    .map((point) => ({
      ...point,
      label: formatTime(point.timestamp),
    }))

  if (chartData.length === 0) {
    return (
      <div
        className={`flex h-52 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400 ${className ?? ''}`.trim()}
      >
        No chart data yet.
      </div>
    )
  }

  return (
    <div className={className} style={{ height }}>
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
              const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
              return formatCurrency(numericValue)
            }}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as PriceLinePoint | undefined
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
  )
}

export type { PriceLineChartProps }
export default PriceLineChart