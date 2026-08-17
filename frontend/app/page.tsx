export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20 mb-6">
          <span>GitHub Issue #2</span>
          <span>&bull;</span>
          <span>Frontend Foundation Ready</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          FreshAgent Hub
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
          High-performance customer support agent workspace built with Next.js, TypeScript, and Tailwind CSS. The frontend foundation is successfully running.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-200">Login</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Planned</span>
            </div>
            <p className="text-xs text-zinc-400">JWT Authentication & user login entry point.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-200">Agent Dashboard</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Planned</span>
            </div>
            <p className="text-xs text-zinc-400">Overview of active support workload and ticket queues.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-200">Single Ticket View</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">Saud Lane</span>
            </div>
            <p className="text-xs text-zinc-400">Single-ticket paginated navigation, optimistic UI & retry UI.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-200">Admin Dashboard</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Planned</span>
            </div>
            <p className="text-xs text-zinc-400">Role-based administrative management and user roles.</p>
          </div>
        </div>

        {/* Foundation Summary List */}
        <div className="mt-10 pt-8 border-t border-zinc-800/80">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Foundation Checklist
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Next.js App Router configured
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> TypeScript strict configuration
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Tailwind CSS styling initialized
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Application shell & layout setup
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> API client location (<code className="text-xs font-mono bg-zinc-800 px-1 py-0.5 rounded">lib/api/client.ts</code>)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Type definitions (<code className="text-xs font-mono bg-zinc-800 px-1 py-0.5 rounded">types/index.ts</code>)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
