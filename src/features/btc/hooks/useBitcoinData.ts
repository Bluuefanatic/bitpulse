import { useEffect, useState } from 'react'
import {
  fetchBitcoinHistory,
  fetchBitcoinPrice,
  type BitcoinPriceResponse,
  type TimeRange,
} from '../services/api'

const POLL_INTERVAL_MS = 60_000

const RANGE_TO_MS: Record<TimeRange, number> = {
  '1H': 60 * 60 * 1000,
  '24H': 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
}

export type BitcoinHistoryEntry = {
  price: number
  timestamp: number
}

type UseBitcoinDataResult = {
  price: number | null
  history: BitcoinHistoryEntry[]
  loading: boolean
  error: string | null
  range: TimeRange
  setRange: (range: TimeRange) => void
}

export function useBitcoinData(): UseBitcoinDataResult {
  const [price, setPrice] = useState<number | null>(null)
  const [history, setHistory] = useState<BitcoinHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<TimeRange>('24H')

  const normalizeHistory = (
    entries: BitcoinPriceResponse[],
    activeRange: TimeRange,
  ): BitcoinHistoryEntry[] => {
    const cutoff = Date.now() - RANGE_TO_MS[activeRange]
    const sorted = [...entries]
      .filter((entry) => entry.timestamp >= cutoff)
      .sort((left, right) => right.timestamp - left.timestamp)

    const seen = new Set<number>()
    const unique: BitcoinHistoryEntry[] = []

    for (const entry of sorted) {
      if (seen.has(entry.timestamp)) {
        continue
      }

      seen.add(entry.timestamp)
      unique.push(entry)
    }

    return unique
  }

  useEffect(() => {
    let isActive = true

    const fetchInitialData = async () => {
      setLoading(true)

      try {
        const [historyData, latest] = await Promise.all([
          fetchBitcoinHistory(range),
          fetchBitcoinPrice(),
        ])

        if (!isActive) {
          return
        }

        setPrice(latest.price)
        setHistory(normalizeHistory([latest, ...historyData], range))
        setError(null)
      } catch (caughtError) {
        if (!isActive) {
          return
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Failed to fetch Bitcoin price'
        setError(message)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    const fetchLatestPrice = async () => {
      try {
        const latest = await fetchBitcoinPrice()
        if (!isActive) {
          return
        }

        setPrice(latest.price)
        setHistory((previous) => normalizeHistory([latest, ...previous], range))
        setError(null)
      } catch (caughtError) {
        if (!isActive) {
          return
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Failed to fetch Bitcoin price'
        setError(message)
      }
    }

    void fetchInitialData()
    const intervalId = window.setInterval(() => {
      void fetchLatestPrice()
    }, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [range])

  return {
    price,
    history,
    loading,
    error,
    range,
    setRange,
  }
}

export type { TimeRange }