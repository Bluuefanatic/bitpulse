type BitcoinPriceResponse = {
  price: number
  timestamp: number
}

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