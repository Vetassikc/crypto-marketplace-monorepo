'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Globe,
  Layers3,
  Lock,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react'

const metrics = [
  { label: 'Settlement rails', value: 'Crypto + Fiat', hint: 'Unified checkout orchestration' },
  { label: 'Escrow execution', value: '< 10s', hint: 'Tempo testnet interaction flow' },
  { label: 'AI operations', value: '24/7', hint: 'Search + listing + accountant roadmap' },
]

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Trust by Architecture',
    text: 'Escrow-first transaction design with explicit order state transitions.',
  },
  {
    icon: Globe,
    title: 'Global Payment Reach',
    text: 'Hybrid checkout model for cross-border commerce and crypto-native users.',
  },
  {
    icon: Lock,
    title: 'Security as Product',
    text: 'Identity, authorization, and payment safety are core platform primitives.',
  },
]

const flow = [
  {
    icon: WalletCards,
    title: 'Identity',
    text: 'Wallet-based onboarding with session controls.',
  },
  {
    icon: Layers3,
    title: 'Checkout',
    text: 'Single order lifecycle for fiat and crypto flows.',
  },
  {
    icon: Zap,
    title: 'Settlement',
    text: 'Escrow release and accounting events for auditability.',
  },
]

const roadmap = [
  {
    title: 'Now',
    subtitle: 'Security Baseline',
    points: ['SIWE authentication', 'Ownership guards', 'Rate limits + policy hardening'],
  },
  {
    title: 'Next',
    subtitle: 'Hybrid Payments Core',
    points: ['Fiat provider abstraction', 'Crypto reconciliation worker', 'Idempotent order APIs'],
  },
  {
    title: 'Then',
    subtitle: 'AI Accountant',
    points: ['Ledger domain model', 'P&L reports', 'CSV/JSON exports'],
  },
]

export default function Home() {
  return (
    <main className="relative -mt-16 min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 -z-20">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-35">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0ea5e940,transparent_42%),radial-gradient(circle_at_82%_78%,#34d3992e,transparent_30%),linear-gradient(180deg,#05070f_0%,#070b14_58%,#0b111d_100%)]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[url('/logo.svg')] bg-[length:180px_180px] bg-repeat opacity-[0.02]" />

      <section className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100"
        >
          <Zap className="h-3.5 w-3.5" />
          VartMarkt Protocol Commerce Layer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-8 max-w-5xl text-5xl font-black leading-[1.03] tracking-tight md:text-7xl"
        >
          Build value exchange with
          <span className="block bg-gradient-to-r from-cyan-200 via-white to-emerald-200 bg-clip-text text-transparent">
            secure hybrid payments
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mt-6 max-w-3xl text-lg text-slate-200/85 md:text-xl"
        >
          VartMarkt combines marketplace UX, blockchain escrow, and AI operations into one platform for
          next-generation commerce.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/listings">
            <Button className="h-13 rounded-full border border-cyan-200/20 bg-cyan-500 px-8 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(8,145,178,0.35)] transition-all hover:-translate-y-0.5 hover:bg-cyan-400">
              Explore Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sell">
            <Button
              variant="outline"
              className="h-13 rounded-full border border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/12"
            >
              Open Seller Studio
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-6 md:grid-cols-3">
        {metrics.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-300/75">{item.hint}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Platform Principles</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Engineered for high-trust commerce</h2>
          </div>
          <ShieldCheck className="hidden h-10 w-10 text-cyan-200/70 md:block" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8"
            >
              <item.icon className="h-8 w-8 text-cyan-200" />
              <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300/80">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:p-12">
          <div className="mb-10 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/85">Execution Pipeline</p>
            <h2 className="text-3xl font-bold md:text-4xl">From wallet intent to settlement</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {flow.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/12 bg-slate-950/40 p-6"
              >
                <step.icon className="h-7 w-7 text-emerald-200" />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300/80">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-[2rem] border border-cyan-200/25 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-950 p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
              <Brain className="h-3.5 w-3.5" />
              AI Accountant
            </div>
            <h3 className="mt-6 text-3xl font-bold md:text-4xl">Operational intelligence for every seller</h3>
            <p className="mt-5 max-w-2xl text-slate-200/85">
              Build toward autonomous accounting with deterministic ledgers, reconciliation rules, and
              AI-assisted reporting.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {['Monthly P&L snapshots', 'Fee and payout transparency', 'CSV + JSON export contracts', 'Audit-ready event timeline'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3">
              <Bot className="h-7 w-7 text-cyan-200" />
              <h3 className="text-2xl font-semibold">AI Capabilities</h3>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm font-medium">Smart Search</p>
                <p className="mt-1 text-sm text-slate-300/80">Natural language intent to structured filters.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm font-medium">Magic Write</p>
                <p className="mt-1 text-sm text-slate-300/80">Visual listing drafts from image context.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm font-medium">Accounting Copilot</p>
                <p className="mt-1 text-sm text-slate-300/80">Planned ledger insights and automated summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-6 pb-28">
        <div className="mb-8 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-emerald-200" />
          <h2 className="text-3xl font-bold">Execution Roadmap</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {roadmap.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">{item.title}</p>
              <h3 className="mt-2 text-xl font-bold">{item.subtitle}</h3>
              <div className="mt-5 space-y-2">
                {item.points.map((point) => (
                  <p key={point} className="text-sm text-slate-300/80">
                    • {point}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
