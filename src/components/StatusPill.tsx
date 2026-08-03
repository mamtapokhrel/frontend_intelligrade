const LABELS: Record<string, { className: string; label: string; pulse?: boolean }> = {
  draft: { className: 'pill-draft', label: 'Draft' },
  evaluating: { className: 'pill-evaluating', label: 'Evaluating', pulse: true },
  evaluated: { className: 'pill-evaluated', label: 'Evaluated' },
  uploaded: { className: 'pill-draft', label: 'Uploaded' },
  processing: { className: 'pill-evaluating', label: 'Grading', pulse: true },
  done: { className: 'pill-evaluated', label: 'Graded' },
  error: { className: 'pill-error', label: 'Failed' },
}

export function StatusPill({ status }: { status: string }) {
  const cfg = LABELS[status] ?? { className: 'pill-draft', label: status }
  return (
    <span className={`pill ${cfg.className}`}>
      {cfg.pulse && <span className="pulse-dot" aria-hidden />}
      {cfg.label}
    </span>
  )
}
