export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true" focusable="false">
        <rect width="40" height="40" rx="12" fill="#DCECF4" />
        <path
          d="M6 24c5-5 9 5 14 0s9-5 14 0"
          fill="none"
          stroke="#3A667E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M6 31c5-5 9 5 14 0s9-5 14 0"
          fill="none"
          stroke="#C2A07B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M12 19h16l-2.5-5h-11z" fill="#8B6B52" />
      </svg>
      <span className="font-serif text-xl font-semibold tracking-tight text-bark-900">
        Dream
        <span className="ml-1 hidden text-sm font-normal text-sand-700 sm:inline">
          River Cruises
        </span>
      </span>
    </span>
  );
}
