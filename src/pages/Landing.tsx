import { Link } from 'react-router-dom'
import { ArrowIcon, CheckIcon, QuillIcon, UploadCloudIcon } from '../components/Icons'
import { Marginalia } from '../components/Marginalia'

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
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-redpen">
            AI marking, in a teacher's hand
          </p>
          <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.1] wide:text-5xl">
            Every answer read.
            <br />
            Every margin <em className="text-indigo">written in.</em>
          </h1>
          <p className="mb-8 max-w-md text-base text-faded">
            Upload a batch of scanned answer sheets. Intelligrade reads each script
            question by question, awards marks against your sample answers, and leaves
            the kind of remarks a careful teacher would.
          </p>
          <div className="mb-10 flex flex-wrap gap-3">
            <Link to="/login/teacher" className="btn-primary">
              Start marking <ArrowIcon size={17} />
            </Link>
            <Link to="/login/student" className="btn-ghost">
              See my results
            </Link>
          </div>
          <ul className="space-y-2.5 text-sm text-ink/80">
            {[
              'Batch-upload scanned PDFs, matched by roll number',
              'Per-question marks with handwritten-style remarks',
              'Students browse subjects and results the moment marking ends',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <CheckIcon size={18} className="mt-0.5 shrink-0 text-teal" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Hero visual: a marked script on tilted paper stack with score badge */}
        <section className="relative mx-auto w-full max-w-sm" aria-hidden>
          <div className="card absolute inset-0 translate-x-3 translate-y-4 rotate-[3.5deg] bg-surface" />
          <div className="card absolute inset-0 translate-x-1.5 translate-y-2 rotate-[1.5deg] bg-surface" />
          <div className="card ruled relative rotate-[-1.5deg] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-display text-lg">Midterm — Physics II</p>
                <p className="mono-stat text-xs text-faded">Roll 017 · 6 pages</p>
              </div>
              <div className="flex h-16 w-16 rotate-[6deg] items-center justify-center rounded-full border-2 border-redpen text-redpen">
                <span className="font-hand text-2xl font-semibold">42/50</span>
              </div>
            </div>
            <p className="mb-1 text-sm">
              <span className="mono-stat text-faded">Q3.</span> State and prove the
              work–energy theorem…
            </p>
            <Marginalia>
              Clear derivation — but you dropped the friction term in part (b). Revisit
              the free-body diagram.
            </Marginalia>
            <div className="mt-5 flex items-center gap-2 text-xs text-faded">
              <UploadCloudIcon size={16} className="text-indigo" />
              Evaluated in 40 seconds
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl border-t border-line px-5 py-6 text-xs text-faded">
        Intelligrade — final year project. Marks are AI-assisted; teachers stay in charge.
      </footer>
    </div>
  )
}
