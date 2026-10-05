import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/20">
      <div className="container-page flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-black">ShriShubh</div>
          <p className="mt-1 text-sm text-slate-400">Websites and digital solutions built around your requirements.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <a href="https://www.instagram.com/shrishubh2026_web_builder/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:shrishubh521@gmail.com">Email</a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} ShriShubh. All rights reserved.</div>
    </footer>
  );
}
