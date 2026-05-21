import Link from "next/link";

type Step = {
  number: string;
  title: string;
  text: string;
  imageSrc?: string;
  imageAlt?: string;
};

const defaultSteps: Step[] = [
  {
    number: "01.",
    title: "Je créer un compte",
    text: "En quelques minutes, je crée mon compte, j'indique ma situation (études, emploi, logement...) et je suis guidé pas à pas, avec des rappels pour ne rien oublier.",
    imageSrc: "/images/HowItWorks_1.png",
    imageAlt: "Écran de création de compte Help.",
  },
  {
    number: "02.",
    title: "L'algo construit ton parcours",
    text: "Nos questions cernent ta situation, et Help. te propose un parcours et un suivis sur mesure avec uniquement les démarches qui te concernent",
    imageSrc: "/images/HowItWorks_2.png",
    imageAlt: "Sélection des thèmes qui t'intéressent",
  },
  {
    number: "03.",
    title: "help. t'accompagne pas à pas",
    text: "Une interface de progression te montre où tu en es, avec des notifications au bon moment, et un accès direct aux guides et liens officiels.",
    imageSrc: "/images/HowItWorks_3.png",
    imageAlt: "Interface de progression Help.",
  },
];

type Props = {
  title?: string;
  steps?: Step[];
  ctaLabel?: string;
  ctaHref?: string;
};

export default function HowItWorks({
  title = "Comment ça marche ?",
  steps = defaultSteps,
  ctaLabel = "S'inscrire",
  ctaHref = "/auth/register",
}: Props) {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="tracking-[-0.03em]">{title}</h1>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="flex flex-col">
              <p className="text-rose-100">{step.number}</p>

              <div className="rose-card-frame mt-4 aspect-[4/3] w-full overflow-hidden bg-rose-10">
                {step.imageSrc ? (
                  <img
                    src={step.imageSrc}
                    alt={step.imageAlt ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <h3 className="mt-6 text-center">{step.title}</h3>
              <p className="mt-3 text-center leading-6">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={ctaHref}
            className="rounded-full bg-amber-100 px-7 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-transform hover:-translate-y-0.5"
          >
            <h3>{ctaLabel}</h3>
          </Link>
        </div>
      </div>
    </section>
  );
}
