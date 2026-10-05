export const services = [
  {
    id: "landing",
    title: "Landing Page",
    description: "A focused single-page website for a product, service, event, or personal brand.",
    price: 4999,
    features: ["Responsive design", "Contact/CTA section", "Basic SEO setup"],
  },
  {
    id: "business",
    title: "Business Website",
    description: "A professional multi-section website for a small business, startup, or organization.",
    price: 9999,
    features: ["Up to 6 core pages", "Responsive UI", "Contact form"],
  },
  {
    id: "ecommerce",
    title: "E-commerce Website",
    description: "An online store experience with products, cart, checkout-ready architecture, and order flow.",
    price: 19999,
    features: ["Product catalogue", "Cart flow", "Payment-ready architecture"],
  },
  {
    id: "custom",
    title: "Custom Web App",
    description: "A custom application or dashboard designed around your business workflow.",
    price: 29999,
    features: ["Custom features", "Database-ready", "Scalable architecture"],
  },
];

export function getServiceByTitle(title: string) {
  return services.find((service) => service.title === title);
}
