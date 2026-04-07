type ErrorStateProps = {
  message: string
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="mt-2 text-sm opacity-90">{message}</p>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-rose-400 px-3 py-1.5 text-sm font-medium transition hover:bg-rose-100 dark:border-rose-700 dark:hover:bg-rose-900/50"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}

export type { ErrorStateProps }
export default ErrorState