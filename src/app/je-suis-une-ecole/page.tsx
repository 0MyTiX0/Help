import Link from "next/link";
import Footer from "@/components/Footer";
import FaqSection from "@/components/home/FaqSection";
import KeyFigures from "@/components/home/KeyFigures";
import ReviewsSection from "@/components/home/ReviewsSection";
import { prisma } from "@/lib/prisma";
import { getReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const stats = [
  { value: "148", label: "Adhérents" },
  { value: "3 600", label: "Interventions en école" },
  { value: "120", label: "Nombre de sujets traités" },
];

const proofPoints = [
  {
    title: "67 % des jeunes ratent des aides",
    text: "Faute d'information au bon moment sur la CAF, la MDPH ou les aides locales.",
  },
  {
    title:
      "64 % déclarent rencontré des difficultés dans leurs démarches administratives",
    text: "Non par désintérêt, mais par manque de compréhension des démarches à suivre",
  },
  {
    title: "84% des jeunes souhaitent être mieux informés à l'école",
    text: "Pour être mieux préparés à la vie adulte, et ne pas se sentir perdus face à l'administration.",
  },
];

const offers = [
  {
    step: "ETAPE 1",
    title: "Ateliers & interventions en classe",
    text: "Nos intervenants viennent directement dans vos classes pour animer des ateliers participatifs de 1h à 2h sur les thèmes qui comptent pour vos élèves.",
    bullets: [
      "Intervention pour amener le thème",
      "Vérificatif de nos informations",
      "Intervention ludique et animé",
    ],
  },
  {
    step: "ETAPE 2",
    title: "Accès à la SERIA pour vos élèves",
    text: "Donnez à tous vos élèves un accès à Help., la plateforme qui explique les droits, les aides et les démarches en langage simple, avec un suivi personnalisé.",
    bullets: [
      "Compte personnel & progression",
      "Fiches mémo téléchargeables",
      "Tableau de bord pour le CPE",
    ],
  },
  {
    step: "ETAPE 3",
    title: "Formation des équipes éducatives",
    text: "Une demi-journée de formation pour vos CPE, professeurs principaux ou équipe vie scolaire, pour qu'ils deviennent les premiers relais de l'information auprès des élèves.",
    bullets: [
      "Kit pédagogique complet",
      "Accès enseignant à la plateforme",
      "Ressources imprimables",
      "Support par e-mail dédié",
    ],
  },
];

const steps = [
  {
    title: "On se rencontre (en ligne ou sur place)",
    text: "30 minutes pour comprendre votre contexte, vos élèves, vos priorités et ce que vous attendez de Help.",
  },
  {
    title: "On construit la proposition ensemble",
    text: "Ateliers, accès plateforme, formation d'équipe — on adapte en fonction de votre calendrier scolaire et de vos objectifs pédagogiques.",
  },
  {
    title: "On planifie les interventions",
    text: "Vous choisissez les dates qui vous conviennent. Nos intervenants s'adaptent à votre emploi du temps scolaire.",
  },
  {
    title: "On intervient et on fait le bilan",
    text: "Compte-rendu, retours des élèves, ajustements. On est là dans la durée, pas juste pour une intervention.",
  },
];

type FaqCategoryWithFaqs = {
  id: string;
  name: string | null;
  description: string | null;
  faq: Array<{
    id: string;
    name: string | null;
    description: string | null;
    answer?: string | null;
    faq_category_id: string | null;
  }>;
};

export default async function JeSuisUneEcole() {
  const [reviewRows, faqCategories] = await Promise.all([
    getReviews(10),
    prisma.faq_category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        faq: {
          select: {
            id: true,
            name: true,
            description: true,
            answer: true,
            faq_category_id: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }) as Promise<FaqCategoryWithFaqs[]>,
  ]);

  return (
    <main>
      <section className="bg-rose-100 overflow-hidden bg-[linear-gradient(180deg,--color-rose-100_0%,--color-rose-100_100%)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-6 pb-16 pt-10 md:px-10 lg:px-12 lg:pb-24 lg:pt-16">
          <div className="max-w-2xl space-y-7 pt-8">
            <div className="space-y-6">
              <h1 className="max-w-xl leading-[0.95] tracking-[-0.03em]">
                Préparer vos élèves à la vie adulte, vraiment.
              </h1>
              <p className="max-w-xl leading-6 text-white/80">
                À 18 ans, la majorité des jeunes ne sait pas comment s'inscrire
                sur les listes électorales, demander l'AAH, trouver une aide au
                logement ou faire valoir ses droits au travail. Ce n'est pas un
                manque de volonté, c'est un manque d'information accessible.
              </p>
            </div>

            <Link
              href="#contact"
              className="inline-flex rounded-full bg-amber-100 px-6 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.32)] transition-transform hover:-translate-y-0.5"
            >
              <h2>Prendre rendez-vous →</h2>
            </Link>
          </div>
        </div>
      </section>

      <KeyFigures title="Help. en quelques chiffres" stats={stats} />

      <section className="bg-amber-10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:px-12">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.24em] text-rose-100">
              Changer ça
            </p>
            <h2 className="mt-2 tracking-[-0.03em]">
              Ce que l’école ne leur apprend pas encore.
            </h2>
            <p className="mt-4 max-w-md leading-7">
              À 18 ans, la majorité des jeunes ne savent pas comment demander de
              l’aide, comprendre un contrat ou identifier un interlocuteur
              fiable. Help intervient pour combler ce manque avec une pédagogie
              accessible, pratique et rassurante.
            </p>
          </div>

          <div className="space-y-5">
            {proofPoints.map((item) => (
              <article
                key={item.title}
                className="rose-card-frame p-5 shadow-[0_16px_32px_rgba(187,34,95,0.06)] backdrop-blur"
              >
                <h3 className="leading-6">{item.title}</h3>
                <p className="mt-2 leading-6">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="mx-auto text-center">
            <h2 className="tracking-[-0.03em]">
              Trois façons dont Help accompagne votre établissement
            </h2>
            <p className="mt-3 leading-6">
              Une offre modulaire, conçue pour s’adapter à vos besoins, vos
              contraintes et votre calendrier.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {offers.map((offer) => (
              <article
                key={offer.title}
                className="rose-card-frame p-6 shadow-[0_18px_40px_rgba(21,12,18,0.04)]"
              >
                <p className="uppercase tracking-[0.24em] text-rose-100">
                  {offer.step}
                </p>
                <h3 className="mt-4 leading-8">{offer.title}</h3>
                <p className="mt-4 leading-7">{offer.text}</p>
                <ul className="mt-5 space-y-3">
                  {offer.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span aria-hidden="true">✅</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="#contact"
              className="rounded-full bg-amber-100 px-6 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <h3>Contactez-nous</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.24em] text-rose-100">
              Comment ça marche ?
            </p>
            <h1 className="mt-3 tracking-[-0.03em]">
              De la prise de contact à la première intervention
            </h1>
            <p className="mt-5 leading-7">
              On fait simple. Pas de dossier interminable, pas de réunion en
              réunion. Un rendez-vous, une proposition sur mesure, et on
              s'occupe du reste.
            </p>

            <Link
              href="#contact"
              className="mt-7 inline-flex rounded-full bg-amber-100 px-6 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <h3>Contactez-nous</h3>
            </Link>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="grid grid-cols-[auto_1fr] gap-5 p-3"
              >
                <div className="mt-1 flex flex-col items-center">
                  <span className="h-6 w-6 rounded-full bg-amber-100" />
                  <span className="mt-2 h-18 w-px bg-amber-100" />
                </div>
                <div>
                  <h3 className="pl-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-2 leading-6">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-rose-10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 md:px-10 lg:px-12">
          <div className="text-center">
            <h1 className="tracking-[-0.03em]">Contactez-nous</h1>
            <p className="mt-3 leading-6">
              Rejoignez des milliers de jeunes adultes qui reprennent confiance
              grâce à des actions concrètes.
            </p>
          </div>

          <form className="mt-10 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="pl-1">Prénom</span>
                <input
                  className="w-full rounded-2xl border border-amber-100 bg-amber-10 mt-1 px-4 py-3 outline-none transition focus:border-amber-100"
                  placeholder="Camille"
                />
              </label>
              <label className="space-y-2">
                <span className="pl-1">Nom</span>
                <input
                  className="w-full rounded-2xl border border-amber-100 bg-amber-10 mt-1 px-4 py-3 outline-none transition focus:border-amber-100"
                  placeholder="Martin"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="pl-1">Sujet du message</span>
              <input
                className="w-full rounded-2xl border border-amber-100 bg-amber-10 mt-1 px-4 py-3 outline-none transition focus:border-amber-100"
                placeholder="Demande d'information"
              />
            </label>

            <label className="block space-y-2">
              <span className="pl-1">Message</span>
              <textarea
                className="min-h-32 w-full rounded-2xl border border-amber-100 bg-amber-10 mt-1 px-4 py-3 outline-none transition focus:border-amber-100"
                placeholder="Décrivez votre besoin, votre établissement et vos délais."
              />
            </label>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="rounded-full bg-amber-100 px-7 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-transform hover:-translate-y-0.5"
              >
                <h3>Envoyer</h3>
              </button>
            </div>
          </form>
        </div>
      </section>

      <ReviewsSection reviews={reviewRows} />
      <FaqSection categories={faqCategories} />
      <Footer />
    </main>
  );
}
