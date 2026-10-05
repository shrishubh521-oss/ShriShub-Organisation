import SectionTitle from "@/components/SectionTitle";

const steps = [
  ["1", "Choose a service", "Select the type of website or application closest to your goal."],
  ["2", "Share requirements", "Describe pages, features, design preferences, integrations, and timeline."],
  ["3", "Review price and contract", "Review the proposed scope and price, then accept the digital service agreement."],
  ["4", "Payment and development", "Complete the configured payment step and the project moves into development."],
  ["5", "Track progress", "Use your account to follow project status and communicate with ShriShubh."],
];

export default function HowItWorksPage() {
  return <div className="container-page py-16"><SectionTitle eyebrow="Process" title="How ShriShubh works" description="A structured journey from your first idea to project delivery." /><div className="mx-auto mt-12 max-w-3xl space-y-4">{steps.map(([number, title, text]) => <div key={number} className="card flex gap-5 p-6"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-yellow-400 font-black text-black">{number}</div><div><h2 className="font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div></div>)}</div></div>;
}
