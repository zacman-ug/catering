export default function ApiErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-semibold text-brand-800 hover:text-brand-900"
        >
          Retry
        </button>
      )}
    </div>
  );
}
