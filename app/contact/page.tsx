import SectionTitle from "@/components/SectionTitle";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return <div className="container-page py-16"><SectionTitle eyebrow="Contact" title="Tell us what you want to build" description="Send a message or start a project directly from the platform." /><div className="mx-auto mt-12 max-w-3xl"><ContactForm /></div></div>;
}
