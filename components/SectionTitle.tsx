type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({ eyebrow, title, description }: Props) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">{eyebrow}</p>}
      <h1 className="text-3xl font-black tracking-tight md:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">{description}</p>}
    </div>
  );
}
