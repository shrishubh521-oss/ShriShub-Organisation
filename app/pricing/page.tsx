import SectionTitle from "@/components/SectionTitle";
import { services } from "@/lib/pricing";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <SectionTitle eyebrow="Pricing" title="Simple starting prices" description="These are starting packages for common website needs. Custom functionality can change the final quote after scope review." />
      <div className="mt-12 overflow-x-auto card">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-slate-300"><tr><th className="p-5">Service</th><th className="p-5">Starting price</th><th className="p-5">Best for</th><th className="p-5"></th></tr></thead>
          <tbody>{services.map((service) => <tr key={service.id} className="border-b border-white/10 last:border-0"><td className="p-5 font-bold">{service.title}</td><td className="p-5 font-black">₹{service.price.toLocaleString("en-IN")}</td><td className="p-5 text-slate-400">{service.description}</td><td className="p-5"><Link href={`/order?service=${encodeURIComponent(service.title)}`} className="text-yellow-300">Start →</Link></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
