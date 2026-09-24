type Props = {
  compact?: boolean;
  onClick?: () => void;
};

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "wordmark wordmark--compact" : "wordmark"} aria-label="WunnaGo">
      <span className="wordmark-wunna">Wunna</span>
      <span className="wordmark-go">Go</span>
      <span className="wordmark-route" aria-hidden="true">
        <svg viewBox="0 0 80 54" role="img">
          <path d="M10 43 C 31 37, 48 41, 48 27 C48 16 33 17 36 8 C39 0 55 5 67 2" />
          <circle cx="10" cy="43" r="5" />
          <circle cx="67" cy="2" r="4" />
        </svg>
      </span>
    </span>
  );
}

export function Wordmark({ compact = false, onClick }: Props) {
  if (!onClick) return <Mark compact={compact} />;

  return (
    <button className="wordmark-button" type="button" onClick={onClick} aria-label="Return to WunnaGo start">
      <Mark compact={compact} />
    </button>
  );
}
