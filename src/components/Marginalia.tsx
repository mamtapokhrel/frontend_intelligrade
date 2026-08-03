import { SquiggleIcon } from './Icons'

/** The one true treatment for AI-written remarks: handwritten Caveat in
 * red-pen ink beside a thin red border and a quote-squiggle. Reused for
 * question-level and submission-level remarks alike. */
export function Marginalia({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`marginalia ${className}`}>
      <SquiggleIcon size={16} className="squiggle" />
      {children}
    </div>
  )
}
