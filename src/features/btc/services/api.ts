type BitcoinPriceResponse = {
  price: number
  timestamp: number
}

type TimeRange = '1H' | '24H' | '3D' | '7D'

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_last_updated_at=true'

function isValidPricePayload(payload: unknown): payload is {
  bitcoin: {
    usd: number
    last_updated_at?: number
  }
} {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const bitcoin = (payload as Record<string, unknown>).bitcoin
  if (!bitcoin || typeof bitcoin !== 'object') {
    return false
  }

  const usd = (bitcoin as Record<string, unknown>).usd
  const lastUpdatedAt = (bitcoin as Record<string, unknown>).last_updated_at

  const hasValidUsd = typeof usd === 'number' && Number.isFinite(usd)
  const hasValidTimestamp =
    lastUpdatedAt === undefined ||
    (typeof lastUpdatedAt === 'number' && Number.isFinite(lastUpdatedAt))

  return hasValidUsd && hasValidTimestamp
}

export async function fetchBitcoinPrice(): Promise<BitcoinPriceResponse> {
  let response: Response

  try {
    response = await fetch(COINGECKO_URL)
  } catch {
    throw new Error('Failed to reach CoinGecko API')
  }

  if (!response.ok) {
    throw new Error(`CoinGecko API request failed with status ${response.status}`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('CoinGecko API returned invalid JSON')
  }

  if (!isValidPricePayload(payload)) {
    throw new Error('Unexpected CoinGecko response shape')
  }

  const timestampInMs = payload.bitcoin.last_updated_at
    ? payload.bitcoin.last_updated_at * 1000
    : Date.now()

  return {
    price: payload.bitcoin.usd,
    timestamp: timestampInMs,
  }
}

function isValidHistoryPayload(payload: unknown): payload is {
  prices: Array<[number, number]>
} {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const prices = (payload as Record<string, unknown>).prices
  if (!Array.isArray(prices)) {
    return false
  }

  return prices.every(
    (entry) =>
      Array.isArray(entry) &&
      entry.length >= 2 &&
      typeof entry[0] === 'number' &&
      Number.isFinite(entry[0]) &&
      typeof entry[1] === 'number' &&
      Number.isFinite(entry[1]),
  )
}

function getRangeWindowSeconds(range: TimeRange): number {
  switch (range) {
    case '1H':
      return 60 * 60
    case '24H':
      return 24 * 60 * 60
    case '3D':
      return 3 * 24 * 60 * 60
    case '7D':
      return 7 * 24 * 60 * 60
    default:
      return 24 * 60 * 60
  }
}

export async function fetchBitcoinHistory(
  range: TimeRange,
): Promise<BitcoinPriceResponse[]> {
  const to = Math.floor(Date.now() / 1000)
  const from = to - getRangeWindowSeconds(range)

  const url =
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range` +
    `?vs_currency=usd&from=${from}&to=${to}`

  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new Error('Failed to reach CoinGecko API')
  }

  if (!response.ok) {
    throw new Error(`CoinGecko API request failed with status ${response.status}`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new Error('CoinGecko API returned invalid JSON')
  }

  if (!isValidHistoryPayload(payload)) {
    throw new Error('Unexpected CoinGecko response shape')
  }

  return payload.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
  }))
}

export type { BitcoinPriceResponse, TimeRange }