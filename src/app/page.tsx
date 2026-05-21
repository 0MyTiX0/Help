import Footer from "@/components/Footer";
import CategoryWheel from "@/components/home/CategoryWheel";
import FaqSection from "@/components/home/FaqSection";
import HowItWorks from "@/components/home/HowItWorks";
import IAmSchoolSection from "@/components/home/IAmSchoolSection";
import KeyFigures from "@/components/home/KeyFigures";
import PromiseSection from "@/components/home/PromiseSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import { prisma } from "@/lib/prisma";
import { getReviews } from "@/lib/reviews";

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

export default async function Home() {
  const [categories, reviewRows, faqCategories] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    }),
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
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }) as Promise<FaqCategoryWithFaqs[]>,
  ]);

  return (
    <main className="bg-surface">
      <section className="pt-6 pb-4 sm:pt-10">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h1 className="tracking-[-0.03em]">
            L&apos;administratif devient enfin clair.
          </h1>
          <p className="mt-4 leading-7">
            Les démarches administratives, les aides, les droits… help.
            rassemble tout ce dont tu as besoin, étape par étape. Gratuit,
            clair, fait pour toi.
          </p>
        </div>
      </section>

      <CategoryWheel categories={categories} />

      <HowItWorks />

      <PromiseSection />

      <KeyFigures />

      <IAmSchoolSection />

      <FaqSection categories={faqCategories} />
      <Footer />
    </main>
  );
}
