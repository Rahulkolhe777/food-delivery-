/**
 * PageLoader — full-screen loading state used while auth is initialising.
 */
import Spinner from "./Spinner";

export default function PageLoader({ message = "Loading…" }) {
  return (
    <div
      className="fixed inset-0 bg-base flex flex-col items-center justify-center gap-4 z-[9999]"
      role="status"
      aria-label={message}
    >
      {/* Brand mark */}
      <span className="font-display text-2xl font-semibold text-saffron-500 tracking-tight select-none">
        FoodHub
      </span>
      <Spinner size="md" />
      <p className="text-sm text-ink-secondary">{message}</p>
    </div>
  );
}

