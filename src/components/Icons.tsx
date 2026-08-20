/** Hand-drawn inline SVG icon set — thin 1.6–1.8px stroke, no fill.
 * Part of the Intelligrade identity; do not swap for an icon library. */

type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function QuillIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 19c5.5-1.5 11-6.5 14-14-6.5 2.5-12 7.5-14 14z" />
      <path d="M5 19c2.5-5 6-8.5 9.5-11" strokeWidth={1.5} />
    </svg>
  )
}

export function CheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 12.5c2 1.5 3.5 3.5 4.5 5.5 2-5.5 5.5-10 10.5-13.5" />
    </svg>
  )
}

export function UploadCloudIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 16.5c-2.5.2-4.5-1.4-4.5-3.7 0-2 1.5-3.4 3.3-3.6C6.2 6.4 8.7 4.5 12 4.5s5.6 1.9 6.1 4.7c1.9.2 3.4 1.6 3.4 3.6 0 2.3-2 3.9-4.5 3.7" />
      <path d="M12 20v-8" />
      <path d="M9 14.5c1-1.2 2-2.2 3-2.7 1 .5 2 1.5 3 2.7" />
    </svg>
  )
}

export function ArrowIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12.2c5.5-.4 10.5-.3 15.5-.2" />
      <path d="M15 7c2 2 3.5 3.7 4.5 5-1 1.3-2.5 3-4.5 5" />
    </svg>
  )
}

export function BackArrowIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M20 12.2c-5.5-.4-10.5-.3-15.5-.2" />
      <path d="M9 7c-2 2-3.5 3.7-4.5 5 1 1.3 2.5 3 4.5 5" />
    </svg>
  )
}

/** Quote-squiggle used beside every marginalia remark. */
export function SquiggleIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.6}>
      <path d="M4 14c2-4 4-6 5.5-6-1 2-1.5 3.5-1 4.5.8-1 2-2.5 3.5-3-.5 1.5-.5 2.5.2 3.2 1-.7 2.3-1.7 3.8-2.2-.8 2.2-.3 3.5 2 3.5" />
    </svg>
  )
}

export function BookIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 6.5C10 5 7.5 4.4 4.5 4.7c-.3 4.7-.2 9.3 0 13.8 3-.3 5.5.3 7.5 1.8 2-1.5 4.5-2.1 7.5-1.8.2-4.5.3-9.1 0-13.8-3-.3-5.5.3-7.5 1.8z" />
      <path d="M12 6.5v13.3" strokeWidth={1.5} />
    </svg>
  )
}

export function FlaskIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9.5 4h5M10.5 4.5v5L5.8 17.6c-.7 1.3.2 2.7 1.6 2.7h9.2c1.4 0 2.3-1.4 1.6-2.7L13.5 9.5v-5" />
      <path d="M8 15.5c2.5-1 5.5-1 8 .2" strokeWidth={1.5} />
    </svg>
  )
}

export function SigmaIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M17.5 5.5c-3.7-.4-7.2-.4-10.8 0 2.5 2.3 4.7 4.4 6.5 6.5-1.8 2.1-4 4.2-6.5 6.5 3.6.4 7.1.4 10.8 0" />
    </svg>
  )
}

export function GlobeIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="7.6" />
      <path d="M12 4.4c-2.4 2.4-3.5 5-3.5 7.6s1.1 5.2 3.5 7.6c2.4-2.4 3.5-5 3.5-7.6s-1.1-5.2-3.5-7.6z" strokeWidth={1.5} />
      <path d="M4.8 12h14.4" strokeWidth={1.5} />
    </svg>
  )
}

export function PageIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6.2 3.8c3.5-.3 6-.3 8.3-.1l3.3 3.5c.2 4.2.2 8.4 0 12.9-3.8.3-7.6.3-11.6 0-.2-5.5-.2-10.9 0-16.3z" />
      <path d="M14 3.8c0 1.4 0 2.5.1 3.6 1.2.1 2.4.1 3.7 0" strokeWidth={1.5} />
      <path d="M9 12c2-.3 4-.3 6 0M9 15.5c1.6-.2 3.2-.2 5 0" strokeWidth={1.5} />
    </svg>
  )
}

export function AlertIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4.5c2.8 4.3 5.2 8.6 7.2 13.1-4.9.6-9.5.6-14.4 0 2-4.5 4.4-8.8 7.2-13.1z" />
      <path d="M12 10v3.5" strokeWidth={1.6} />
      <path d="M12 16.4v.2" strokeWidth={2.2} />
    </svg>
  )
}

export function RetryIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M18.5 11.5c.2-4-2.6-6.9-6.4-7-3.9-.1-6.8 2.8-7 6.6-.2 3.9 2.7 6.9 6.6 7 2.4.1 4.4-1 5.8-2.8" />
      <path d="M18.7 8.2c.1 1.2 0 2.3-.2 3.4-1.1-.2-2.2-.5-3.2-1" />
    </svg>
  )
}

export function LogoutIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13.5 4.5c-2.4-.3-4.6-.3-7-.1-.3 5.1-.3 10.1 0 15.2 2.4.2 4.6.2 7-.1" />
      <path d="M10 12h10M17 8.5c1.4 1.2 2.4 2.4 3 3.5-.6 1.1-1.6 2.3-3 3.5" />
    </svg>
  )
}

export function PlusIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5.5c-.3 4.4-.3 8.7 0 13M5.5 12c4.4-.3 8.7-.3 13 0" />
    </svg>
  )
}

export function EditIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M15 4.8c1.6-1.5 3.1-1.4 4.4.1 1.2 1.4 1.2 2.8-.2 4.2L8.5 19.7 4 20.5l1-4.4z" />
      <path d="M13.3 6.6c1 1.3 2 2.3 3.3 3.2" strokeWidth={1.5} />
    </svg>
  )
}

export function TrashIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.7 7.4c4.9-.7 9.7-.6 14.6.1" />
      <path d="M9.2 7c-.3-1.7.3-2.6 1.7-2.8 1.5-.2 2.4.6 2.4 2.2" strokeWidth={1.5} />
      <path d="M6.8 8c.1 4.3.4 8.4 1 12.1 3-.1 5.9-.1 8.8.1.6-3.8.9-7.9 1-12.1" />
    </svg>
  )
}

export function DownloadIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4v11" />
      <path d="M8 11.5c1 1.3 2.3 2.6 4 4 1.7-1.4 3-2.7 4-4" strokeWidth={1.5} />
      <path d="M5 17.5c4.7.9 9.3.9 14 0" />
    </svg>
  )
}

export function SettingsIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 4.8v2.4M19 7.6l-1.8 1.7M19.4 15.8l-2.1 1M13 19.4l-.6-2.5M5.2 17.4l1.7-1.9M5 8.4l2.2-1" strokeWidth={1.5} />
    </svg>
  )
}

export function UsersIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8.3" r="3" />
      <path d="M3.5 19c.6-3.2 2.6-4.8 5.5-4.8s4.9 1.6 5.5 4.8" />
      <path d="M15.5 6.2c1.4.2 2.4 1.3 2.4 2.8 0 1.4-1 2.5-2.3 2.8" strokeWidth={1.5} />
      <path d="M15 14.4c2.4.2 4 1.8 4.5 4.6" strokeWidth={1.5} />
    </svg>
  )
}

/** Subject icons cycle by index so each subject card gets a hand-drawn mark. */
export const subjectIcons = [BookIcon, FlaskIcon, SigmaIcon, GlobeIcon, PageIcon]

/** Subject accent colors (left borders, card top bars) keyed by subject id.
 * The red-pen color is reserved for remarks and errors, never subjects. */
export const subjectAccents = ['var(--indigo)', 'var(--teal)', 'var(--gold)', '#6d5470', '#a05a3a']

export function subjectAccent(id: number) {
  return subjectAccents[id % subjectAccents.length]
}

export function SubjectGlyph({ id, size = 20, className }: { id: number; size?: number; className?: string }) {
  const Icon = subjectIcons[id % subjectIcons.length]
  return <Icon size={size} className={className} />
}
