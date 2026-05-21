"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export type SubcategoryItem = {
  id: string;
  name: string;
  description: string | null;
};

type Props = {
  categoryName: string;
  subcategories: SubcategoryItem[];
};

function formatIndex(index: number) {
  return `${String(index + 1).padStart(2, "0")}.`;
}

function SubcategoryCard({
  index,
  subcategory,
  categoryName,
}: {
  index: number;
  subcategory: SubcategoryItem;
  categoryName: string;
}) {
  return (
    <article className="flex h-full min-h-72 w-full flex-col gap-6 px-2 py-4">
      <div className="text-3xl font-bold text-rose-100">
        {formatIndex(index)}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="leading-snug">{subcategory.name}</h3>
        <p>{categoryName}</p>
      </div>

      <div className="mt-auto">
        <Link
          href={`/categories/subcategories/${subcategory.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-6 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
        >
          <h3>En savoir plus →</h3>
        </Link>
      </div>
    </article>
  );
}

export default function SubcategoryCarousel({
  categoryName,
  subcategories,
}: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const total = subcategories.length;
  const canNavigate = total > 1;

  if (total === 0) {
    return (
      <p className="text-center">
        Aucune sous-catégorie disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="relative">
        <Swiper
          className="subcategory-carousel"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          centerInsufficientSlides
          rewind
          speed={650}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {subcategories.map((sub, index) => (
            <SwiperSlide key={sub.id} className="h-auto py-4">
              <SubcategoryCard
                index={index}
                subcategory={sub}
                categoryName={categoryName}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {canNavigate ? (
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-20 bg-surface text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-10"
              aria-label="Sous-catégorie précédente"
              onClick={() => swiperRef.current?.slidePrev()}
              type="button"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="m15 18-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Sous-catégorie suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-20 bg-surface text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="m9 6 6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
