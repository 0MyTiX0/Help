"use client";

import { useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getProfileColorStyle } from "@/lib/profileColors";
import type { ReviewRow } from "@/lib/reviews";

const ratingStars = [1, 2, 3, 4, 5];

function formatDate(value: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function initials(firstname: string | null, lastname: string | null) {
  const firstLetter = firstname?.trim().charAt(0) ?? "H";
  const lastLetter = lastname?.trim().charAt(0) ?? "";

  return `${firstLetter}${lastLetter}`.toUpperCase();
}

function StarRow() {
  return (
    <div className="flex items-center gap-1 text-[#f4b400]">
      {ratingStars.map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-current"
          aria-hidden="true"
        >
          <path d="m12 2.6 2.95 6.2 6.82.87-4.93 4.72 1.31 6.71L12 17.82 5.85 21.1l1.31-6.71L2.23 9.67l6.82-.87L12 2.6z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewRow }) {
  return (
    <article
      className="flex h-full min-h-84 w-full flex-col rounded-[1.2rem] bg-[#fff4ea] p-5 sm:min-h-88 lg:min-h-92 xl:min-h-96"
      data-review-card
    >
      <div className="flex items-center justify-between gap-3">
        <StarRow />
        <span>{formatDate(review.created_at)}</span>
      </div>
      <p className="mt-4 flex-1 leading-6 line-clamp-6">{review.comment}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-[#f1d8c6] pt-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={getProfileColorStyle(review.id)}
        >
          {initials(review.firstname, review.lastname)}
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="text-sm font-bold">
            {review.firstname} {review.lastname}
          </div>
          <div className="text-sm">{review.role}</div>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeSecondaryIndex, setActiveSecondaryIndex] = useState(0);
  const featuredReview = reviews[0] ?? null;
  const secondaryReviews = reviews.slice(1);
  const totalSecondaryReviews = secondaryReviews.length;
  const canNavigate = totalSecondaryReviews > 1;

  function goToPreviousReview() {
    swiperRef.current?.slidePrev();
  }

  function goToNextReview() {
    swiperRef.current?.slideNext();
  }

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.24em] text-rose-700">
              Ils nous font confiance
            </p>
            <h2 className="mt-3 tracking-[-0.03em]">
              Ce que disent les établissements.
            </h2>
            <p className="mt-4 leading-7">
              Des retours d’établissements partenaires, chargés depuis la base
              de données, pour mettre en avant l’impact réel de Help.
            </p>
          </div>

          <div className="flex items-end justify-end gap-4 lg:justify-end">
            <div className="text-right">
              {/* Ne pas toucher a text-[64px] */}
              <div className="text-[64px] leading-none">4,9</div>
              <div className="mt-2 flex justify-end">
                <StarRow />
              </div>
              <p className="mt-2">Basé sur les avis d’établissements</p>
            </div>
          </div>
        </div>

        {featuredReview ? (
          <div className="mt-12 rounded-[1.4rem] bg-[#f4dde7] p-8 lg:px-12 lg:py-10">
            <div className="flex items-start gap-5">
              <div className="leading-none text-[#6b1d43]">“</div>
              <div className="max-w-4xl">
                <p className="leading-8">{featuredReview.comment}</p>
                <div className="mt-6 flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={getProfileColorStyle(featuredReview.id)}
                  >
                    {initials(
                      featuredReview.firstname,
                      featuredReview.lastname,
                    )}
                  </div>
                  <div>
                    <p>
                      {featuredReview.firstname} {featuredReview.lastname}
                    </p>
                    <p>{featuredReview.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {secondaryReviews.length > 0 ? (
          <div className="mt-8 overflow-hidden">
            <div className="mx-auto max-w-full px-4 md:px-8 lg:px-10 xl:px-12 pt-2">
              {/* controls moved below carousel */}

              <div className="relative min-h-112 py-2 sm:min-h-124 sm:py-4 lg:min-h-136 xl:min-h-144">
                <Swiper
                  className="review-carousel"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) =>
                    setActiveSecondaryIndex(swiper.realIndex)
                  }
                  centerInsufficientSlides
                  rewind
                  speed={1650}
                  slidesPerView={1.05}
                  spaceBetween={16}
                  breakpoints={{
                    640: {
                      slidesPerView: 2.05,
                      spaceBetween: 16,
                    },
                    1024: {
                      slidesPerView: 3.05,
                      spaceBetween: 16,
                    },
                    1280: {
                      slidesPerView: 4,
                      spaceBetween: 18,
                    },
                  }}
                >
                  {secondaryReviews.map((review) => (
                    <SwiperSlide
                      key={review.id}
                      className="flex items-center justify-center py-4 sm:py-5"
                    >
                      <div className="w-full max-w-88 sm:max-w-92 lg:max-w-96 xl:max-w-104">
                        <ReviewCard review={review} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="absolute left-1/2 bottom-4 z-10 -translate-x-1/2 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={goToPreviousReview}
                    disabled={!canNavigate}
                    aria-label="Voir les reviews précédentes"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-surface text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
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

                  <div className="min-w-16 text-center text-sm uppercase tracking-[0.22em] text-rose-700">
                    {totalSecondaryReviews > 0
                      ? `${activeSecondaryIndex + 1}/${totalSecondaryReviews}`
                      : "0/0"}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextReview}
                    disabled={!canNavigate}
                    aria-label="Voir les reviews suivantes"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-surface text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
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
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
