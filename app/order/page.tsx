import SectionTitle from "@/components/SectionTitle";
import OrderBuilder from "@/components/forms/OrderBuilder";

export default function OrderPage() {
  return <div className="container-page py-16"><SectionTitle eyebrow="Start a project" title="Tell us what you need" description="Choose a service and describe your requirements. Your account will keep the project information organized." /><div className="mx-auto mt-12 max-w-4xl"><OrderBuilder /></div></div>;
}
