import Image from "next/image";
import Link from "next/link";

export default function IAmSchoolSection() {
  return (
    <section className="bg-rose-10 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text column */}
          <div className="max-w-lg">
            <h1 className="tracking-[-0.03em]">Je suis une école</h1>
            <p className="mt-6 leading-7">
              L&apos;entrée dans la vie active est une étape charnière pour vos
              élèves. Entre la recherche de logement, les premières démarches
              administratives et les aides financières disponibles, beaucoup se
              retrouvent dépassés, sans savoir vers qui se tourner.
            </p>
            <p className="mt-4 leading-7">
              Help. vient compléter votre travail d&apos;accompagnement. En
              intégrant notre outil dans votre établissement, vous offrez à vos
              élèves un guide clair et personnalisé pour naviguer dans leur vie
              admin, bien avant qu&apos;ils ne soient livrés à eux-mêmes.
            </p>
            <Link
              href="/je-suis-une-ecole"
              className="mt-8 inline-flex rounded-full bg-amber-100 px-7 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <h3>En savoir +</h3>
            </Link>
          </div>

          {/* Image column */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/homepage_iamschool.png"
                alt="Élèves utilisant Help. sur un ordinateur"
                width={560}
                height={520}
                className="h-auto w-full rounded-tr-[40px] rounded-bl-[40px] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
