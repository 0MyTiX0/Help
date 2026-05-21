import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type CategorySeed = {
  name: string;
  description: string;
  subcategories: string[];
};

const categoriesData: CategorySeed[] = [
  {
    name: "Politique & citoyenneté",
    description:
      "Tout comprendre sur tes droits civiques et le fonctionnement des institutions.",
    subcategories: [
      "Les élections : rôles et calendrier",
      "Voter : comment, quand et pourquoi",
      "Carte électorale et procuration",
      "Comprendre les partis politiques",
      "Connaître ses droits en tant que citoyen",
      "La hiérarchie des élections expliquée",
    ],
  },
  {
    name: "Entreprise",
    description: "Démarches, droits et conseils pour ta vie professionnelle.",
    subcategories: [
      "Primes et avantages en entreprise",
      "Contrats de travail expliqués",
      "Alternance : démarches et conseils",
      "Comprendre sa fiche de paie",
      "Harcèlement au travail : que faire ?",
      "Santé mentale et bien-être au travail",
      "Droits et obligations au travail",
      "Préparer un entretien d'embauche",
      "France Travail (chômage) : droits et aides",
    ],
  },
  {
    name: "Handicap",
    description: "Faire valoir tes droits pour une autonomie totale.",
    subcategories: [
      "Les droits des personnes en situation de handicap",
      "Accompagnements et structures disponibles",
      "Les aides financières et matérielles",
      "Démarches MDPH expliquées",
      "Les bons gestes et attitudes à adopter",
      "Scolarité, emploi et handicap",
    ],
  },
  {
    name: "Santé",
    description: "Prendre soin de soi et comprendre la Sécurité sociale.",
    subcategories: [
      "Documents médicaux à conserver",
      "Trouver un médecin traitant",
      "Numéros d'urgence et premiers secours",
      "Mutuelle et complémentaire santé expliquées",
      "Comprendre la Sécurité sociale",
      "Arrêt maladie : droits et obligations",
      "Rappels santé selon l'âge (M'T dents, lunettes...)",
      "Combien de remboursements par an ?",
      "Carte Vitale : démarches et utilisation",
    ],
  },
  {
    name: "Logement",
    description: "Trouver, louer et gérer son propre chez-soi.",
    subcategories: [
      "Préparer son dossier de candidature",
      "Comprendre le contrat de location",
      "Démarches CAF liées au logement",
      "Les droits et devoirs du locataire",
      "Trouver un logement",
      "Souscrire aux abonnements",
      "Assurance habitation : comment bien choisir",
      "Dépôt de garantie et charges",
      "État des lieux : comment bien le faire",
      "Agence immobilière, copropriété et syndic : comprendre le rôle",
    ],
  },
  {
    name: "Banque",
    description: "Gérer son argent, ses comptes et ses économies.",
    subcategories: [
      "Frais bancaires : comment les éviter",
      "Les livrets d'épargne",
      "Ouvrir son premier compte bancaire",
      "Comprendre les prêts et crédits",
      "Changer de banque : démarches et conseils",
    ],
  },
  {
    name: "Permis et véhicules",
    description: "Mobilité, code de la route et assurances.",
    subcategories: [
      "Que faire en cas d'accident ?",
      "Choisir son premier véhicule",
      "Auto-école physique ou en ligne : que choisir ?",
      "Les aides pour passer le permis",
      "Recensement, JDC : ce qu'il faut savoir",
      "Obtenir le code de la route",
      "Comprendre les assurances auto",
    ],
  },
  {
    name: "Aides financières",
    description: "Coups de pouce de l'État et bourses.",
    subcategories: [
      "Aides pour partir en voyage ou à l'étranger",
      "Aides pour les études et la formation",
      "Toutes les aides financières pour les jeunes",
      "RSA : conditions et démarches",
      "Aides au logement",
      "Comment faire une demande d'aide efficacement",
    ],
  },
  {
    name: "Famille",
    description: "Droits familiaux, émancipation et accompagnement.",
    subcategories: [
      "Protection de l'enfant et accompagnements",
      "Parents séparés : droits et obligations",
      "S'émanciper : conditions et démarches",
      "Être parent jeune : droits et aides",
      "Allocations familiales : ce à quoi vous avez droit",
    ],
  },
  {
    name: "Administratif",
    description: "Papiers d'identité, impôts et gestion du quotidien.",
    subcategories: [
      "Changement de situation : que mettre à jour ?",
      "Visa et documents pour l'étranger",
      "Gérer ses comptes administratifs (CAF, Ameli, impôts...)",
      "Carte d'identité et passeport : démarches",
      "Comprendre et déclarer ses impôts",
      "Documents importants à conserver",
    ],
  },
];

type FaqCategorySeed = {
  name: string;
  description: string;
  faqs: Array<{
    name: string;
    description: string;
  }>;
};

const faqCategoriesData: FaqCategorySeed[] = [
  {
    name: "Écoles",
    description: "Questions sur l’adhésion et le compte établissement.",
    faqs: [
      {
        name: "Comment mon établissement peut-il rejoindre Help ?",
        description: "Nous convenons d’un premier échange pour présenter le dispositif et vérifier le contexte de votre établissement.",
      },
    ],
  },
  {
    name: "Interventions",
    description: "Questions sur les ateliers et l’organisation.",
    faqs: [
      {
        name: "Comment se passe une intervention en classe ?",
        description: "L’intervention est préparée en amont, pensée pour le niveau des élèves et animée par un intervenant dédié.",
      },
    ],
  },
  {
    name: "Compte",
    description: "Questions sur les comptes élèves et le suivi.",
    faqs: [
      {
        name: "Les élèves gardent-ils leur compte après avoir quitté l’établissement ?",
        description: "Oui, le compte reste actif afin qu’ils puissent poursuivre leur suivi et retrouver leurs repères.",
      },
    ],
  },
  {
    name: "Suivi",
    description: "Questions sur le suivi pédagogique et les progrès.",
    faqs: [
      {
        name: "En tant qu’enseignant, puis-je suivre la progression de mes élèves ?",
        description: "Oui, un suivi synthétique permet de visualiser les étapes principales et l’avancement des élèves.",
      },
    ],
  },
  {
    name: "Tarifs",
    description: "Questions sur les coûts et la gratuité.",
    faqs: [
      {
        name: "Est-ce que Help est vraiment gratuit ?",
        description: "Oui, l’accès initial est gratuit pour les établissements partenaires sur le périmètre prévu par le dispositif.",
      },
    ],
  },
  {
    name: "Organisation",
    description: "Questions sur les délais et la planification.",
    faqs: [
      {
        name: "Combien de temps faut-il pour organiser une action ?",
        description: "En général, l’organisation se fait rapidement dès que les besoins et le calendrier sont validés ensemble.",
      },
    ],
  },
];

async function main() {
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.resource.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.faq_category.deleteMany();
  console.log("✅ Base de données vierge.");

  console.log("🌱 Plantation des catégories et sous-catégories...");

  for (const category of categoriesData) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
        subcategory: {
          create: category.subcategories.map((subcategoryName) => ({
            name: subcategoryName,
            description: "",
          })),
        },
      },
    });
    console.log(
      `- Catégorie créée : ${createdCategory.name} (${category.subcategories.length} sous-catégories)`,
    );
  }

  console.log("🌱 Plantation des FAQ...");

  for (const faqCategory of faqCategoriesData) {
    const createdFaqCategory = await prisma.faq_category.create({
      data: {
        name: faqCategory.name,
        description: faqCategory.description,
        faq: {
          create: faqCategory.faqs.map((faq) => ({
            name: faq.name,
            description: faq.description,
          })),
        },
      },
    });

    console.log(`- FAQ catégorie créée : ${createdFaqCategory.name} (${faqCategory.faqs.length} questions)`);
  }

  console.log("🚀 Opération terminée avec succès ! L'arborescence est prête.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
