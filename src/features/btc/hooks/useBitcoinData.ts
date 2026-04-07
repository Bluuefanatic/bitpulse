import { useEffect, useState } from 'react'
import { fetchBitcoinPrice } from '../services/api'

const POLL_INTERVAL_MS = 60_000
const MAX_HISTORY_ENTRIES = 50

export type BitcoinHistoryEntry = {
  price: number
  timestamp: number
}

type UseBitcoinDataResult = {
  price: number | null
  history: BitcoinHistoryEntry[]
  loading: boolean
  error: string | null
}

export function useBitcoinData(): UseBitcoinDataResult {
  const [price, setPrice] = useState<number | null>(null)
  const [history, setHistory] = useState<BitcoinHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const fetchLatestPrice = async (isInitialFetch: boolean) => {
      if (isInitialFetch) {
        setLoading(true)
      }

      try {
        const latest = await fetchBitcoinPrice()
        if (!isActive) {
          return
        }

        setPrice(latest.price)
        setHistory((previous) => [latest, ...previous].slice(0, MAX_HISTORY_ENTRIES))
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
        if (isInitialFetch && isActive) {
          setLoading(false)
        }
      }
    }

    fetchLatestPrice(true)
    const intervalId = window.setInterval(() => {
      void fetchLatestPrice(false)
    }, POLL_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [])

  return {
    price,
    history,
    loading,
    error,
  }
}