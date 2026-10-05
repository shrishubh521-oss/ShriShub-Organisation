import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

const benefits = [
  "Clear scope before development",
  "Fixed starting prices",
  "Secure customer accounts",
  "Project tracking and messaging",
  "Contract-first workflow",
  "Payment-ready architecture",
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/5 px-3 py-1.5 text-xs font-bold text-yellow-200">
              <Sparkles size={14} /> Modern websites. Simple process.
            </div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Your idea deserves a <span className="text-yellow-300">better website.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">ShriShubh helps businesses, creators, startups, and individuals turn requirements into polished websites and digital products.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/order" className="btn-primary">Start your project <ArrowRight size={18} /></Link>
              <Link href="/pricing" className="btn-secondary">View pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="card p-6"><Zap className="text-yellow-300" /><h2 className="mt-5 text-xl font-black">Fast communication</h2><p className="mt-2 text-sm leading-6 text-slate-400">Keep requirements, updates, and messages organized around your project.</p></div>
          <div className="card p-6"><ShieldCheck className="text-yellow-300" /><h2 className="mt-5 text-xl font-black">Transparent process</h2><p className="mt-2 text-sm leading-6 text-slate-400">Review scope, pricing, and contract details before work begins.</p></div>
          <div className="card p-6"><Sparkles className="text-yellow-300" /><h2 className="mt-5 text-xl font-black">Built for growth</h2><p className="mt-2 text-sm leading-6 text-slate-400">Start with a website today and evolve into a larger web application later.</p></div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="card p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Why ShriShubh</p><h2 className="mt-3 text-3xl font-black">A client journey designed to be easy.</h2></div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {benefits.map((item) => <li key={item} className="flex gap-2 text-sm text-slate-300"><CheckCircle2 size={17} className="mt-0.5 text-yellow-300" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
