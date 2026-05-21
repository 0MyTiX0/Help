"use client";

import { useMemo, useState } from "react";

type FaqCategoryWithFaqs = {
  id: string;
  name: string | null;
  description: string | null;
  faq: Array<{
    id: string;
    name: string | null;
    description: string | null;
    faq_category_id: string | null;
  }>;
};

type FlattenedFaq = {
  id: string;
  question: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
};

export default function FaqSection({
  categories,
}: {
  categories: FaqCategoryWithFaqs[];
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const flattenedFaqs = useMemo<FlattenedFaq[]>(
    () =>
      categories.flatMap((category) =>
        category.faq.map((faq) => ({
          id: faq.id,
          question: faq.name ?? "Question",
          description: faq.description,
          categoryId: category.id,
          categoryName: category.name ?? "Catégorie",
        })),
      ),
    [categories],
  );

  const visibleFaqs = useMemo(() => {
    if (activeCategoryId === "all") {
      return flattenedFaqs;
    }

    return flattenedFaqs.filter((faq) => faq.categoryId === activeCategoryId);
  }, [activeCategoryId, flattenedFaqs]);

  const previewFaqs = visibleFaqs.slice(0, 4);

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.24em] text-rose-700">FAQ</p>
            <h1 className="mt-3 tracking-[-0.03em]">
              Des questions sur Help ?
            </h1>
            <p className="mt-4 leading-7">
              On a rassemblé les interrogations les plus courantes pour vous
              aider à vous projeter rapidement.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end lg:justify-self-end pt-10">
            <button
              type="button"
              onClick={() => setIsFilterOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full bg-[#f7edf2] px-5 py-2.5 shadow-[0_10px_20px_rgba(21,12,18,0.04)] transition hover:-translate-y-0.5"
              aria-expanded={isFilterOpen}
              aria-controls="faq-filters"
            >
              Filtrer
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isFilterOpen ? (
              <div
                id="faq-filters"
                className="flex max-w-2xl flex-wrap gap-3 lg:justify-end"
              >
                <button
                  type="button"
                  onClick={() => setActiveCategoryId("all")}
                  className={`rounded-full px-4 py-2 shadow-[0_10px_20px_rgba(21,12,18,0.04)] transition hover:-translate-y-0.5 ${activeCategoryId === "all" ? "bg-rose-100" : "bg-surface"}`}
                >
                  Toutes
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`rounded-full px-4 py-2 shadow-[0_10px_20px_rgba(21,12,18,0.04)] transition hover:-translate-y-0.5 ${activeCategoryId === category.id ? "bg-rose-100" : "bg-surface"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {previewFaqs.map((faq) => (
            <article
              key={faq.id}
              className="min-h-72 rounded-[1.4rem] bg-[#fff4ea] p-5 shadow-[0_18px_32px_rgba(21,12,18,0.04)]"
            >
              <span className="rounded-full bg-rose-50 px-4 py-2 uppercase tracking-[0.18em] text-rose-700">
                {faq.categoryName}
              </span>
              <div className="mt-40">
                <p className="leading-6">La question posée :</p>
                <h3 className="mt-2 leading-8">{faq.question}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
