import { useEffect, useRef, useState } from 'react'

type PriceCardProps = {
  price: number | null
  title?: string
  currency?: string
  updatedAt?: number | null
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(price)
}

function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)
}

function PriceCard({
  price,
  title = 'BTC Price',
  currency = 'USD',
  updatedAt = null,
}: PriceCardProps) {
  const previousPrice = useRef<number | null>(null)
  const [isPriceUpdated, setIsPriceUpdated] = useState(false)

  useEffect(() => {
    const hadPreviousValue = previousPrice.current !== null
    const didChange = hadPreviousValue && previousPrice.current !== price

    previousPrice.current = price

    if (!didChange || price === null) {
      return
    }

    setIsPriceUpdated(true)
    const timeoutId = window.setTimeout(() => {
      setIsPriceUpdated(false)
    }, 650)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [price])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 ${
          isPriceUpdated ? 'price-flash' : ''
        }`}
      >
        {price === null ? '--' : formatPrice(price, currency)}
      </p>
      {updatedAt !== null ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Updated at {formatTimestamp(updatedAt)}
        </p>
      ) : null}
    </section>
  )
}

export type { PriceCardProps }
export default PriceCard