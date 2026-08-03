import type { ReactNode } from 'react'

/** Inkwell-styled empty state: a small ruled sheet with a hand-drawn icon,
 * a serif headline, and one clear next action. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="card flex flex-col items-center px-8 py-12 text-center">
      <div className="ruled card mb-5 flex h-20 w-16 rotate-[-3deg] items-center justify-center text-indigo shadow-card">
        {icon}
      </div>
      <h3 className="mb-1 font-display text-xl">{title}</h3>
      <p className="mb-5 max-w-sm text-sm text-faded">{body}</p>
      {action}
    </div>
  )
}
