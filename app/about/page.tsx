import SectionTitle from "@/components/SectionTitle";

export default function AboutPage() {
  return <div className="container-page py-16"><SectionTitle eyebrow="About ShriShubh" title="Technology with a practical business mindset" description="ShriShubh is a web-development initiative by Shubham Sandeep Salvi and Shriom Suresh Chinkate, focused on building modern digital experiences for customers." /><div className="mx-auto mt-12 max-w-3xl card p-7 text-slate-300"><p className="leading-8">Our goal is to make website development easier for customers who may not know technical terminology. Instead of asking customers to manage a complicated development process, ShriShubh organizes services, requirements, pricing, contracts, payments, communication, and project tracking in one platform.</p><p className="mt-5 leading-8">The platform is designed so the customer-facing experience stays simple while administrative controls remain private and protected on the server.</p></div></div>;
}
