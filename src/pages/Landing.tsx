import { Link } from 'react-router-dom'
import { ArrowIcon, BookIcon, QuillIcon, SquiggleIcon, UploadCloudIcon } from '../components/Icons'
import { Marginalia } from '../components/Marginalia'

const benefits = [
  {
    icon: UploadCloudIcon,
    color: 'var(--indigo)',
    title: 'Batch upload',
    body: 'Drop in a batch of scanned PDFs, matched automatically by roll number. No manual sorting needed.',
  },
  {
    icon: SquiggleIcon,
    color: 'var(--teal)',
    title: 'Marked question by question',
    body: 'Every question gets its own mark and a handwritten-style remark, not just a final score.',
  },
  {
    icon: BookIcon,
    color: 'var(--gold)',
    title: 'Results the moment marking ends',
    body: 'Students open their own subject and see exactly where marks were gained or lost.',
  },
]

/** Landing: role selection + the score-badge-on-tilted-paper hero. */
export function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <QuillIcon size={24} className="text-indigo" />
          <span className="font-display text-xl font-semibold tracking-tight">Intelligrade</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/login/student" className="btn-ghost !py-2">
            Student sign in
          </Link>
          <Link to="/login/teacher" className="btn-primary !py-2">
            Teacher sign in
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-14 wide:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p
            className="mb-3 animate-[fade-up-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] text-xs font-medium uppercase tracking-[0.2em] text-redpen"
          >
            AI marking, in a teacher's hand
          </p>
          <h1
            className="mb-5 animate-[fade-up-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] font-display text-4xl font-semibold leading-[1.1] wide:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Every answer read.
            <br />
            Every margin <em className="text-indigo">written in.</em>
          </h1>
          <p
            className="mb-8 max-w-md animate-[fade-up-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] text-base text-faded"
            style={{ animationDelay: '150ms' }}
          >
            Upload a batch of scanned answer sheets. Intelligrade marks each script
            against your sample answers and writes a careful teacher's remarks.
          </p>
          <div
            className="flex animate-[fade-up-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both] flex-wrap gap-3"
            style={{ animationDelay: '220ms' }}
          >
            <Link to="/login/teacher" className="btn-primary">
              Start marking <ArrowIcon size={17} />
            </Link>
            <Link to="/login/student" className="btn-ghost">
              See my results
            </Link>
          </div>
        </section>

        {/* Hero visual: a marked script on tilted paper stack with score badge */}
        <section
          className="group relative mx-auto w-full max-w-sm animate-[fade-up-in_0.8s_cubic-bezier(0.16,1,0.3,1)_both]"
          style={{ animationDelay: '260ms' }}
          aria-hidden
        >
          <div className="card absolute inset-0 translate-x-3 translate-y-4 rotate-[3.5deg] bg-surface transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-5" />
          <div className="card absolute inset-0 translate-x-1.5 translate-y-2 rotate-[1.5deg] bg-surface transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2.5" />
          <div className="card ruled relative rotate-[-1.5deg] p-6 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2.5deg]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-display text-lg">Midterm: Physics II</p>
                <p className="mono-stat text-xs text-faded">Roll 017 · 6 pages</p>
              </div>
              <div className="flex h-16 w-16 rotate-[6deg] items-center justify-center rounded-full border-2 border-redpen text-redpen">
                <span className="font-hand text-2xl font-semibold">42/50</span>
              </div>
            </div>
            <p className="mb-1 text-sm">
              <span className="mono-stat text-faded">Q3.</span> State and prove the
              work-energy theorem…
            </p>
            <Marginalia>
              Clear derivation, though you dropped the friction term in part (b).
              Revisit the free-body diagram.
            </Marginalia>
            <div className="mt-5 flex items-center gap-2 text-xs text-faded">
              <UploadCloudIcon size={16} className="text-indigo" />
              Evaluated in 40 seconds
            </div>
          </div>
        </section>
      </main>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="mb-8 font-display text-2xl">How the marking gets done</h2>
        <div className="grid gap-8 wide:grid-cols-3">
          {benefits.map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="border-t pt-6" style={{ borderColor: 'var(--line)' }}>
              <span className="mb-3 block" style={{ color }}>
                <Icon size={22} />
              </span>
              <h3 className="mb-1.5 font-display text-lg">{title}</h3>
              <p className="text-sm text-faded">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl border-t border-line px-5 py-6 text-xs text-faded">
        Intelligrade, a final year project. Marks are AI-assisted; teachers stay in charge.
      </footer>
    </div>
  )
}
