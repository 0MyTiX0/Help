import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import SubcategoryCarousel from "@/components/categories/SubcategoryCarousel";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const categories = await prisma.category.findMany({
    include: {
      subcategory: { orderBy: { name: "asc" } },
    },
  });

  const category = categories.find((c) => slugify(c.name) === slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <h1 className="text-center tracking-[-0.03em]">{category.name}</h1>

        <div className="mt-12">
          <SubcategoryCarousel
            categoryName={category.name}
            subcategories={category.subcategory.map((sub) => ({
              id: sub.id,
              name: sub.name,
              description: sub.description,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
