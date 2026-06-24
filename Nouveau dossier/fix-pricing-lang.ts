import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'landing.pricing.title': 'Simple pricing, no hidden fees',
    'landing.pricing.subtitle': 'Gain professional operational leverage. Choose the right plan to scale your brand with zero markups.',
    'landing.pricing.cycle.monthly': 'Monthly',
    'landing.pricing.cycle.quarterly': 'Quarterly',
    'landing.pricing.cycle.annually': 'Annually',
    'landing.pricing.starter.name': 'STARTER',
    'landing.pricing.starter.desc': 'Essential store intelligence, spy tools, and conversion calculators for solo builders.',
    'landing.pricing.starter.feat1': '1 Active Workspace Seat',
    'landing.pricing.starter.feat2': 'Unlimited Competitor Finder',
    'landing.pricing.starter.feat3': 'Core E-com BrandTrackers (3 tracks)',
    'landing.pricing.starter.feat4': 'Standard Conversions Engine',
    'landing.pricing.starter.feat5': 'VentureCAC & Margin Calculators',
    'landing.pricing.starter.feat6': 'Custom Client-Only Offline Security',
    'landing.pricing.starter.feat7': 'Bring Your Own custom LLM API Keys',
    'landing.pricing.starter.feat8': 'Standard Email Support channel',
    'landing.pricing.starter.btn': 'Subscribe to Starter',
    'landing.pricing.agency.name': 'AGENCY GROWTH',
    'landing.pricing.agency.desc': 'Everything in Starter PLUS advanced LLM usage & native integrations built-in.',
    'landing.pricing.agency.badge': 'Most Popular Launch',
    'landing.pricing.agency.feat1': '3 Agent Seats included',
    'landing.pricing.agency.feat2': 'Direct Ad Account Integrations',
    'landing.pricing.agency.feat3': 'Unlimited Native AI Token Limits',
    'landing.pricing.agency.feat4': 'Advanced Media Buying Calculator',
    'landing.pricing.agency.feat5': 'SaaS P&L Financial Modeling',
    'landing.pricing.agency.feat6': 'Multi-Language Text Translation',
    'landing.pricing.agency.feat7': 'Client-Level Data Segregation',
    'landing.pricing.agency.btn': 'Get Agency Access',
    'landing.pricing.enterprise.name': 'PRO EXPERT',
    'landing.pricing.enterprise.desc': 'Deploy internal custom workflows, tailored data scrapers, and personalized team support.',
    'landing.pricing.enterprise.feat1': 'Custom unlimited seating setup',
    'landing.pricing.enterprise.feat2': 'Custom API Pipeline Ingestions',
    'landing.pricing.enterprise.feat3': 'Dedicated Account Success Rep',
    'landing.pricing.enterprise.feat4': 'White-label Client Dashboards',
    'landing.pricing.enterprise.feat5': 'Direct 1-on-1 Strategy Calls',
    'landing.pricing.enterprise.feat6': 'Advanced Penetration Features',
    'landing.pricing.enterprise.btn': 'Contact Enterprise Desk',
    'landing.pricing.terms': 'All plans include 128-bit bank-level encryption. Subscriptions are billed upfront for the selected period.',
`;

const fr = `
    'landing.pricing.title': 'Tarification simple, sans frais cachés',
    'landing.pricing.subtitle': 'Obtenez un levier opérationnel professionnel. Choisissez le bon plan pour développer votre marque sans majoration.',
    'landing.pricing.cycle.monthly': 'Mensuel',
    'landing.pricing.cycle.quarterly': 'Trimestriel',
    'landing.pricing.cycle.annually': 'Annuel',
    'landing.pricing.starter.name': 'STARTER',
    'landing.pricing.starter.desc': 'Intelligence de boutique essentielle, outils d\\'espionnage et calculatrices de conversion pour les créateurs solos.',
    'landing.pricing.starter.feat1': '1 Siège Espace de Travail Actif',
    'landing.pricing.starter.feat2': 'Recherche de Concurrents Illimitée',
    'landing.pricing.starter.feat3': 'Suivi de Marques E-com de Base (3 suivis)',
    'landing.pricing.starter.feat4': 'Moteur de Conversions Standard',
    'landing.pricing.starter.feat5': 'Calculatrices VentureCAC & Marge',
    'landing.pricing.starter.feat6': 'Sécurité Hors Ligne Client-Only Personnalisée',
    'landing.pricing.starter.feat7': 'Apportez vos propres clés API LLM personnalisées',
    'landing.pricing.starter.feat8': 'Support par Courriel Standard',
    'landing.pricing.starter.btn': 'S\\'abonner à Starter',
    'landing.pricing.agency.name': 'AGENCE CROISSANCE',
    'landing.pricing.agency.desc': 'Tout dans Starter PLUS l\\'utilisation avancée de LLM & intégrations natives intégrées.',
    'landing.pricing.agency.badge': 'Lancement le Plus Populaire',
    'landing.pricing.agency.feat1': '3 Sièges d\\'Agent inclus',
    'landing.pricing.agency.feat2': 'Intégrations Directes de Comptes Publicitaires',
    'landing.pricing.agency.feat3': 'Limites de Jetons IA Natives Illimitées',
    'landing.pricing.agency.feat4': 'Calculatrice d\\'Achat Média Avancée',
    'landing.pricing.agency.feat5': 'Modélisation Financière SaaS P&L',
    'landing.pricing.agency.feat6': 'Traduction de Texte Multi-Langues',
    'landing.pricing.agency.feat7': 'Ségregation de Données au Niveau Client',
    'landing.pricing.agency.btn': 'Obtenir l\\'Accès Agence',
    'landing.pricing.enterprise.name': 'PRO EXPERT',
    'landing.pricing.enterprise.desc': 'Déployez des flux de travail personnalisés internes, des extracteurs de données sur mesure et un support d\\'équipe personnalisé.',
    'landing.pricing.enterprise.feat1': 'Configuration de sièges illimitée personnalisée',
    'landing.pricing.enterprise.feat2': 'Ingestions de Pipelines API Personnalisées',
    'landing.pricing.enterprise.feat3': 'Représentant de Succès de Compte Dédié',
    'landing.pricing.enterprise.feat4': 'Tableaux de Bord Clients en Marque Blanche',
    'landing.pricing.enterprise.feat5': 'Appels Stratégiques 1-à-1 Directs',
    'landing.pricing.enterprise.feat6': 'Fonctionnalités de Pénétration Avancées',
    'landing.pricing.enterprise.btn': 'Contacter le Bureau Entreprise',
    'landing.pricing.terms': 'Tous les plans incluent un chiffrement de niveau bancaire 128 bits. Les abonnements sont facturés d\\'avance pour la période sélectionnée.',
`;

// Add some defaults for ES, DE, IT, RU using English texts for simplicity and to avoid compilation errors, 
// normally we'd translate these too but it keeps it manageable here.
content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
console.log('Language files updated pricing.');
