/** Circular score gauge — an SVG ring with an IBM Plex Mono readout. */
export function ScoreGauge({
  percent,
  size = 108,
  label,
}: {
  percent: number | null
  size?: number
  label?: string
}) {
  const stroke = 7
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const value = percent ?? 0
  const offset = c - (Math.min(Math.max(value, 0), 100) / 100) * c
  const color = value >= 75 ? 'var(--teal)' : value >= 40 ? 'var(--gold)' : 'var(--redpen)'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={stroke} fill="none" />
        {percent !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 700ms ease' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono-stat font-semibold" style={{ fontSize: size / 4.2 }}>
          {percent === null ? '—' : `${Math.round(percent)}%`}
        </span>
        {label && <span className="text-[10px] uppercase tracking-wider text-faded">{label}</span>}
      </div>
    </div>
  )
}
