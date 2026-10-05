import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

type Props = {
  title: string;
  description: string;
  price: number;
  features: string[];
};

export default function ServiceCard({ title, description, price, features }: Props) {
  return (
    <article className="card flex h-full flex-col p-6">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-5 text-3xl font-black">₹{price.toLocaleString("en-IN")}</div>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2"><Check size={17} className="mt-0.5 text-yellow-300" />{feature}</li>
        ))}
      </ul>
      <Link href={`/order?service=${encodeURIComponent(title)}`} className="btn-secondary mt-7 w-full">
        Choose service <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}
