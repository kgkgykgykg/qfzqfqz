import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'landing.pricing.pro.name': 'PRO',
    'landing.pricing.pro.desc': 'Accelerate growth with high-precision ad spy trackers, swipes, and multi-model AI.',
    'landing.pricing.pro.feat1': 'Everything in STARTER plan included',
    'landing.pricing.pro.feat2': '2 Active Workspace Seats included',
    'landing.pricing.pro.feat3': 'Advanced Ad Spy & Swipe-Files boards',
    'landing.pricing.pro.feat4': 'Unlock Pro Multi-Model AI Strategy Chat',
    'landing.pricing.pro.feat5': 'Full-scale BrandTracker Assets (30 tracks)',
    'landing.pricing.pro.feat6': 'Niche global Micro-Brand Explorers',
    'landing.pricing.pro.feat7': 'Interactive Visual Margin Audiences',
    'landing.pricing.pro.feat8': 'Priority Fast Support (under 4h SLA)',
    'landing.pricing.pro.btn': 'Subscribe to Pro',
    'landing.pricing.pro.popular': 'MOST POPULAR',
    'landing.pricing.business.name': 'BUSINESS',
    'landing.pricing.business.desc': 'Maximize scaling volume with agency trackers, custom API, and ultimate speed.',
    'landing.pricing.business.feat1': 'Everything in PRO plan included',
    'landing.pricing.business.feat2': '4 Active Workspace Seats included',
    'landing.pricing.business.feat3': 'Enterprise custom developer API access',
    'landing.pricing.business.feat4': 'Unlimited BrandTrackers & Competitor checks',
    'landing.pricing.business.feat5': 'Dedicated Business Growth Representative',
    'landing.pricing.business.feat6': 'Custom AI Prompt Fine-Tuning audits',
    'landing.pricing.business.feat7': 'Organized Team boards & collection folders',
    'landing.pricing.business.feat8': 'Premium 99.9% uptime & global cloud sync',
    'landing.pricing.business.btn': 'Subscribe to Business',
`;

const fr = `
    'landing.pricing.pro.name': 'PRO',
    'landing.pricing.pro.desc': 'Accélérez la croissance avec des outils d\\'espionnage de précision, des swipes et une IA multi-modèles.',
    'landing.pricing.pro.feat1': 'Tout ce qui est dans le plan STARTER est inclus',
    'landing.pricing.pro.feat2': '2 Sièges d\\'Espace de Travail Actifs inclus',
    'landing.pricing.pro.feat3': 'Outils d\\'espionnage avancés & Swipe-Files',
    'landing.pricing.pro.feat4': 'Débloquez le Chat Stratégique IA Multi-Modèle',
    'landing.pricing.pro.feat5': 'Actifs BrandTracker (30 suivis)',
    'landing.pricing.pro.feat6': 'Explorateurs de micro-marques mondiales',
    'landing.pricing.pro.feat7': 'Audiences Visuelles Interactives',
    'landing.pricing.pro.feat8': 'Support Prioritaire (SLA - 4h)',
    'landing.pricing.pro.btn': 'S\\'abonner à Pro',
    'landing.pricing.pro.popular': 'LE PLUS POPULAIRE',
    'landing.pricing.business.name': 'BUSINESS',
    'landing.pricing.business.desc': 'Maximisez le volume avec des suivis d\\'agence, des API personnalisées et une vitesse maximale.',
    'landing.pricing.business.feat1': 'Tout ce qui est dans le plan PRO est inclus',
    'landing.pricing.business.feat2': '4 Sièges d\\'Espace de Travail Actifs inclus',
    'landing.pricing.business.feat3': 'Accès API développeur personnalisé',
    'landing.pricing.business.feat4': 'Suivi de marques et concurrents illimité',
    'landing.pricing.business.feat5': 'Représentant dédié à la croissance business',
    'landing.pricing.business.feat6': 'Audits de personnalisation des prompts IA',
    'landing.pricing.business.feat7': 'Tableaux d\\'équipe et dossiers organisés',
    'landing.pricing.business.feat8': 'Uptime de 99.9% et synchronisation cloud',
    'landing.pricing.business.btn': 'S\\'abonner à Business',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
console.log('pricing features updated');
