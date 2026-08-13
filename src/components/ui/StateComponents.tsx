interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function LoadingSpinner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card p-6 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full skeleton" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-1/2 skeleton" />
              <div className="h-3 w-1/3 skeleton" />
            </div>
          </div>
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-3/4 skeleton" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 skeleton" />
            <div className="h-6 w-20 skeleton" />
            <div className="h-6 w-14 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="card p-8 text-center max-w-md mx-auto my-12 border-red-900/50 bg-red-950/10">
      <div className="w-12 h-12 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
        ⚠️
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">
        Unable to Load Data
      </h3>
      <p className="text-sm text-slate-400 mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary px-4 py-2 text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No developers found',
  description = 'Try adjusting your search query or filters to find developers.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="card p-12 text-center max-w-lg mx-auto my-12">
      <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
        🔍
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6">{description}</p>
    </div>
  );
}
