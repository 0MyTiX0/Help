type Promise = {
  title: string;
  subtitle: string;
  text: string;
};

type Props = {
  title?: string;
  largeCard: Promise;
  smallCards: [Promise, Promise];
};

const defaultProps: Props = {
  title: "Exemple de promesse",
  largeCard: {
    title: "Ne rien rater",
    subtitle:
      "Les aides existent.\nIl faut juste savoir qu'elles sont là, c'est notre job.",
    text: "C'est la promesse la plus concrète et la plus différenciante. Elle pointe un vrai problème vécu par tous les jeunes.",
  },
  smallCards: [
    {
      title: "Personnalisation",
      subtitle: "help. ne te montre que ce qui te concerne vraiment.",
      text: "Court, direct, ça résume en une phrase pourquoi créer un compte vaut le coup versus juste googler.",
    },
    {
      title: "Sérénité",
      subtitle: "Tu n'as plus à gérer ta vie admin seul.",
      text: "C'est l'émotion. Ça touche au fond du problème, l'isolement face à l'administratif, et ça donne envie de faire confiance à help.",
    },
  ],
};

function PromiseCard({
  promise,
  className = "",
}: {
  promise: Promise;
  className?: string;
}) {
  return (
    <article className={`rounded-3xl bg-amber-40 p-8 ${className}`}>
      <h2 className="tracking-[-0.02em]">{promise.title}</h2>
      <p className="mt-4 font-bold leading-6">
        {promise.subtitle.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < promise.subtitle.split("\n").length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
      <p className="mt-4 leading-6">{promise.text}</p>
    </article>
  );
}

export default function PromiseSection({
  title = defaultProps.title,
  largeCard = defaultProps.largeCard,
  smallCards = defaultProps.smallCards,
}: Partial<Props> = {}) {
  return (
    <section className="bg-amber-10 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="tracking-[-0.03em]">{title}</h1>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Large card — spans full height on the left */}
          <PromiseCard
            promise={largeCard}
            className="flex flex-col justify-between"
          />

          {/* Two small cards stacked on the right */}
          <div className="flex flex-col gap-6">
            {smallCards.map((card, i) => (
              <PromiseCard key={i} promise={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
