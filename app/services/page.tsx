import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/pricing";

export default function ServicesPage() {
  return (
    <div className="container-page py-16">
      <SectionTitle eyebrow="Services" title="Choose what you want to build" description="Start with a clear service and tell us exactly what you need. Custom requirements can be reviewed before the final scope is locked." />
      <div className="mt-12 grid gap-5 md:grid-cols-2">{services.map((service) => <ServiceCard key={service.id} {...service} />)}</div>
    </div>
  );
}
