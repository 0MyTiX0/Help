type Stat = {
  value: string;
  label: string;
};

const defaultStats: Stat[] = [
  { value: "148", label: "Adhérents" },
  { value: "3 600", label: "Interventions en école" },
  { value: "120", label: "Nombre de sujets traités" },
];

type Props = {
  title?: string;
  stats?: Stat[];
};

export default function KeyFigures({
  title = "Help. en quelques chiffres",
  stats = defaultStats,
}: Props) {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-4 tracking-[-0.03em]">{title}</h1>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="text-center">
              <div className="leading-none">
                <h1>{stat.value}</h1>
              </div>
              <h2 className="mt-4">{stat.label}</h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
