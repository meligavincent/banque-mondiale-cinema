export type Resource = { title: string; description: string; href: string; category: string };
export type Chapter = {
  id: string; name: string; eyebrow: string; lines: [string, string]; description: string;
  cta: string; slug: string; intro: string; resources: Resource[];
};
const wb = 'https://www.banquemondiale.org';
export const chapters: Chapter[] = [
  { id: 'accueil', name: 'Notre mission', eyebrow: 'Le progrès en commun', lines: ['Un avenir.', 'Pour chacun.'],
    description: 'Un monde sans pauvreté. Une planète vivable.', cta: 'Découvrir notre mission', slug: 'mission',
    intro: 'Le développement commence avec les personnes. Le Groupe de la Banque mondiale réunit financement, connaissances et partenaires pour aider les pays à créer des opportunités durables.',
    resources: [
      { title: 'Le Groupe de la Banque mondiale', description: 'Comprendre la mission et les domaines d’intervention de l’institution.', href: wb+'/ext/fr/home', category: 'Institution' },
      { title: 'Mesurer les résultats', description: 'Explorer les indicateurs de la fiche de performance.', href: 'https://scorecard.worldbank.org/', category: 'Impact' },
      { title: 'Travailler ensemble', description: 'Découvrir les possibilités de partenariat.', href: wb+'/ext/fr/work-with-us/partnerships', category: 'Partenariats' },
    ] },
  { id: 'priorites', name: 'Nos priorités', eyebrow: 'Ouvrir des perspectives', lines: ['L’emploi.', 'Une perspective.'],
    description: 'Des opportunités pour travailler, entreprendre et construire son avenir.', cta: 'Explorer nos priorités', slug: 'priorites',
    intro: 'L’emploi est au cœur du développement. Santé, eau, énergie, agriculture et accès au numérique créent les conditions pour que chacun puisse participer à l’économie.',
    resources: [
      { title: 'Emploi', description: 'Créer des opportunités économiques durables.', href: wb+'/ext/fr/jobs', category: 'Économie' },
      { title: 'AgriConnect', description: 'Accompagner les petites exploitations agricoles.', href: wb+'/ext/fr/agriconnect', category: 'Agriculture' },
      { title: 'Eau', description: 'Renforcer la sécurité hydrique.', href: wb+'/ext/fr/water', category: 'Services essentiels' },
      { title: 'Santé', description: 'Améliorer l’accès à des soins abordables.', href: wb+'/ext/fr/health-works', category: 'Services essentiels' },
      { title: 'Mission 300', description: 'Élargir l’accès à l’électricité en Afrique.', href: wb+'/ext/fr/energizingafrica', category: 'Services essentiels' },
      { title: 'Numérique et IA', description: 'Rendre les services numériques plus accessibles.', href: wb+'/ext/fr/digital-ai', category: 'Numérique' },
      { title: 'Égalité femmes-hommes', description: 'Lever les obstacles à la participation économique.', href: wb+'/ext/fr/gender', category: 'Économie' },
    ] },
  { id: 'donnees', name: 'Données', eyebrow: 'Des données pour agir', lines: ['1,2 milliard', 'de jeunes.'],
    description: 'Atteindront l’âge de travailler dans les économies émergentes au cours de la prochaine décennie.', cta: 'Comprendre les chiffres', slug: 'donnees',
    intro: 'Des données ouvertes pour comprendre le monde, éclairer les décisions et suivre les résultats. Explorez les indicateurs et les analyses à leur source.',
    resources: [
      { title: 'La prochaine génération', description: 'L’enjeu de l’emploi pour les jeunes des économies émergentes.', href: wb+'/fr/news/press-release/2024/08/12/world-bank-group-launches-high-level-council-to-tackle-looming-jobs-crisis', category: 'Emploi' },
      { title: 'Données ouvertes', description: 'Rechercher des indicateurs par pays et par thème.', href: 'https://donnees.banquemondiale.org/', category: 'Indicateurs' },
      { title: 'Fiche de performance', description: 'Consulter les résultats du Groupe de la Banque mondiale.', href: 'https://scorecard.worldbank.org/', category: 'Résultats' },
    ] },
  { id: 'publications', name: 'Publications', eyebrow: 'Recherche & publications', lines: ['Le savoir.', 'Pour avancer.'],
    description: 'Des analyses pour comprendre. Des connaissances pour décider.', cta: 'Consulter les publications', slug: 'publications',
    intro: 'Rapports de référence, travaux de recherche et analyses thématiques : accédez aux publications pour approfondir les enjeux du développement.',
    resources: [
      { title: 'Rapport annuel 2026', description: 'L’action du Groupe de la Banque mondiale. Document PDF.', href: 'https://openknowledge.worldbank.org/bitstreams/87d7bbe9-42b7-4e3e-86ef-c52cd7e501f3/download', category: 'Rapports' },
      { title: 'Les Femmes, l’Entreprise et le Droit 2026', description: 'Les droits économiques des femmes et leur application.', href: wb+'/fr/news/press-release/2026/02/24/women-s-economic-opportunity-laws-only-half-enforced-globally', category: 'Analyses' },
      { title: 'Recherche', description: 'Explorer les travaux des économistes de la Banque mondiale.', href: 'https://www.worldbank.org/en/research', category: 'Recherche' },
    ] },
  { id: 'approche', name: 'Notre approche', eyebrow: 'Le savoir en action', lines: ['Apprendre.', 'Transformer.'],
    description: 'Partager l’expérience. Renforcer les capacités. Faire avancer les projets.', cta: 'Découvrir notre approche', slug: 'approche',
    intro: 'Les connaissances prennent toute leur valeur lorsqu’elles se traduisent en actions. Formation, partage d’expérience et mesure des résultats accompagnent les acteurs du développement.',
    resources: [
      { title: 'L’Académie', description: 'Formations et échanges pour les professionnels et les dirigeants.', href: 'https://academy.worldbank.org/', category: 'Formation' },
      { title: 'Les résultats', description: 'Suivre les progrès à travers des indicateurs communs.', href: 'https://scorecard.worldbank.org/', category: 'Évaluation' },
      { title: 'Climat et développement', description: 'Les enseignements tirés de 100 économies.', href: 'https://blogs.worldbank.org/fr/voices/what-100-economies-have-taught-us-about-climate-and-development', category: 'Connaissances' },
    ] },
  { id: 'projets', name: 'Projets', eyebrow: 'Sur le terrain', lines: ['Un impact.', 'Partout.'],
    description: 'Aux côtés des populations, des communautés et des pays.', cta: 'Explorer les projets', slug: 'projets',
    intro: 'Chaque projet répond à un contexte, un besoin et une ambition. Retrouvez les opérations financées par la Banque mondiale et leurs documents dans le portail officiel.',
    resources: [
      { title: 'Tous les projets', description: 'Rechercher une opération par pays, secteur ou statut.', href: 'https://projects.banquemondiale.org/', category: 'Portail' },
      { title: 'La filière cajou en Côte d’Ivoire', description: 'La transformation locale et ses effets sur l’économie.', href: wb+'/fr/results/2025/04/15/agri-processing-adds-value-in-cote-d-ivoire-s-cashew-industry', category: 'Afrique' },
      { title: 'AgriConnect à Djibouti', description: 'Agriculture, emploi et sécurité alimentaire.', href: 'https://blogs.worldbank.org/fr/arabvoices/agriconnect-and-djibouti--creating-jobs-and-boosting-food-securi', category: 'Afrique' },
    ] },
  { id: 'actualites', name: 'À la une', eyebrow: 'Éclairer les enjeux', lines: ['La dette.', 'Un défi mondial.'],
    description: 'Le Rapport sur la dette internationale 2026.', cta: 'Lire les analyses', slug: 'actualites',
    intro: 'Des analyses pour comprendre les défis qui traversent les économies : financement, ressources et transformation numérique.',
    resources: [
      { title: 'Dette internationale 2026', description: 'Un nouvel état des lieux de la dette extérieure des pays en développement.', href: wb+'/fr/news/press-release/2026/11/05/developing-countries-external-debt-surges-to-record-9-4-trillion', category: 'Économie' },
      { title: 'Le cloud et l’eau', description: 'Comprendre les besoins en eau des centres de données.', href: 'https://blogs.worldbank.org/fr/voices/la-monte-en-puissance-du-cloud-dans-un-monde-o-leau-est-de-plus-en-plus-rare-et-dispute', category: 'Numérique' },
      { title: 'Les garanties de la MIGA', description: 'Cinq questions pour comprendre leur rôle.', href: 'https://blogs.worldbank.org/fr/voices/pourquoi-les-garanties-sont-elles-importantes', category: 'Économie' },
    ] },
  { id: 'partenariats', name: 'Partenariats', eyebrow: 'Travailler ensemble', lines: ['Aller plus loin.', 'Ensemble.'],
    description: 'Réunir les idées, les ressources et les personnes qui font la différence.', cta: 'Devenir partenaire', slug: 'partenariats',
    intro: 'Les défis mondiaux appellent une action collective. Partenaires locaux et internationaux apportent leurs connaissances et leurs ressources à des objectifs communs.',
    resources: [
      { title: 'Construire un partenariat', description: 'Découvrir les formes de collaboration avec le Groupe.', href: wb+'/ext/fr/work-with-us/partnerships', category: 'Collaborer' },
      { title: 'Marchés de projets', description: 'Accéder aux opportunités de passation des marchés.', href: wb+'/ext/fr/what-we-do/project-procurement', category: 'Participer' },
    ] },
];
export const sourceUrl = wb+'/ext/fr/home';
