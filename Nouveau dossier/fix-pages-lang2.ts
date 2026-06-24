import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'security.p5.desc1': '1. <strong>Direct Encrypted Routing</strong>: All network traffic directed to our LLM end-points or our serverless gateways is forced via HTTPS standard TLS 1.3 encryption layers. Direct injections or cross-site query interceptions are safely mitigated.',
    'security.p5.desc2': '2. <strong>Strict IDOR Protection</strong>: We enforce rigid object-level checks so that your profile and payment plans cannot be intercepted or queried by third-party sessions. Security rules are strictly validated server-side.',
    'security.p5.desc3': '3. <strong>Anti-Exploit Measures</strong>: All client variables and inputs undergo deep sanitized parsing to lock down client-to-server or script injection opportunities, and standard developer diagnostic utilities are actively secured to maintain full integrity.',

    'legal.p1.desc1': '<strong>Acceptance of Terms</strong>: By using EcomBoost.org ("the Application"), you irrevocably agree to bound by these terms. We offer offline-friendly SaaS analytical dashboards and spy interfaces designed for solo builders, agency operators and brands.',
    'legal.p1.desc2': '<strong>Account Guidelines & Anti-Sharing</strong>: Every subscription is capped at its designated workspace limits (Starter: 1, Pro: 2, Business: 4 seats). Standard security hooks detect concurrent device usage; account sharing or credential proxying will immediately trigger a permanent lock.',
    'legal.p1.desc3': '<strong>Subscription Cycles & Revocation</strong>: Access is maintained via recurring billing (monthly, quarterly, or yearly) managed by payment processors. If matching fees fail or are revoked, active paid tokens are terminated. All payments are non-refundable except where required by active law.',

    'legal.p2.desc1': '<strong>Client-First Architecture</strong>: Our engineering model values absolute data privacy. EcomBoost.org does not collect, log, index, or store your private product prompts, brand details, or connection tokens on any centralized servers. Everything compiles temporarily inside standard browser client space (localStorage).',
    'legal.p2.desc2': '<strong>Provider Connections</strong>: Custom LLM tokens (such as Claude, ChatGPT, or DeepSeek API Keys) bypass intermediate logs and feed directly to the formal respective server endpoints. They are protected during transit by standard cryptographic TLS layers.',
    'legal.p2.desc3': '<strong>No Tracking Bots</strong>: We run absolutely no telemetry networks, behavior cookies, or data scraper scripts. Your profit margins, operational overheads, and competitive spy queries belong to you and stay private indefinitely.',

    'legal.p3.desc1': '<strong>Financial Estimates</strong>: Margin and CAC/LTV math calculated within our calculators is formulated to resemble standard venture-capital models. However, they remain estimates. All financial decisions, scaling ad spends, and business setups should be reviewed by accredited internal representatives.',
    'legal.p3.desc2': '<strong>Limitation of Liability</strong>: EcomBoost.org, its founders, and partners can under no circumstances be held responsible for direct or indirect losses, ad account bans, marketing campaign failures, or budget over-expenditure resulting from data metrics explored inside the dashboard.',
`;

const fr = `
    'security.p5.desc1': '1. <strong>Routage Crypté Direct</strong> : Tout le trafic réseau dirigé vers nos terminaux LLM ou no passerelles serverless est forcé via les couches de chiffrement HTTPS TLS 1.3 standard. Les injections directes ou les interceptions de requêtes inter-sites sont atténuées en toute sécurité.',
    'security.p5.desc2': '2. <strong>Protection IDOR Stricte</strong> : Nous imposons des contrôles stricts au niveau des objets afin que votre profil et vos plans ne puissent pas être interceptés par des tiers. Les règles de sécurité sont validées côté serveur.',
    'security.p5.desc3': '3. <strong>Mesures Anti-Exploitation</strong> : Toutes les variables clientes subissent une analyse profonde pour verrouiller les opportunités d\\'injection de scripts, et les utilitaires standards de développeurs sont activement sécurisés.',

    'legal.p1.desc1': '<strong>Acceptation des Termes</strong> : En utilisant EcomBoost.org ("l\\'Application"), vous acceptez irrévocablement d\\'être lié par ces termes. Nous proposons des tableaux de bord d\\'analyse SaaS hors ligne et des interfaces d\\'espionnage conçues pour les constructeurs solos, les opérateurs d\\'agence et les marques.',
    'legal.p1.desc2': '<strong>Lignes Directrices de Compte & Anti-Partage</strong> : Chaque abonnement est limité aux limites de son espace de travail. Les crochets de sécurité standard détectent l\\'utilisation simultanée de terminaux ; le partage de compte déclenchera un verrouillage permanent.',
    'legal.p1.desc3': '<strong>Cycles d\\'Abonnement & Révocation</strong> : L\\'accès est maintenu via une facturation récurrente. Si les frais échouent, les jetons payés actifs sont résiliés. Tous les paiements sont non remboursables.',

    'legal.p2.desc1': '<strong>Architecture Orientée Client</strong> : EcomBoost.org ne collecte, ne journalise, n\\'indexe ni ne stocke vos prompts, ni vos jetons sur des serveurs centralisés. Tout est compilé temporairement dans l\\'espace client du navigateur (localStorage).',
    'legal.p2.desc2': '<strong>Connexions Fournisseurs</strong> : Les jetons LLM personnalisés contournent les journaux intermédiaires et alimentent directement les terminaux officiels des serveurs respectifs. Ils sont protégés pendant le transit par des couches cryptographiques.',
    'legal.p2.desc3': '<strong>Pas de Robots de Suivi</strong> : Nous n\\'exécutons aucun réseau de télémétrie, cookies de comportement ou scripts de raclage de données. Vos marges de profit, vos frais opérationnels et vos requêtes espionnes restent privés.',

    'legal.p3.desc1': '<strong>Estimations Financières</strong> : Les mathématiques de marge et de CAC/LTV calculées sont formulées pour ressembler aux modèles standards de capital-risque. Cependant, elles restent des estimations.',
    'legal.p3.desc2': '<strong>Limitation de Responsabilité</strong> : EcomBoost.org ne peut en aucun cas être tenu responsable de pertes directes ou indirectes, d\\'interdictions de compte publicitaire, d\\'échecs de campagne marketing ou de dépassement de budget.',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');

// Update Security.tsx
let security = fs.readFileSync('src/pages/Security.tsx', 'utf-8');
security = security.replace(
  '1. <strong>Direct Encrypted Routing</strong>: All network traffic directed to our LLM end-points or our serverless gateways is forced via HTTPS standard TLS 1.3 encryption layers. Direct injections or cross-site query interceptions are safely mitigated.',
  "<span dangerouslySetInnerHTML={{ __html: t('security.p5.desc1') }} />"
);
security = security.replace(
  '2. <strong>Strict IDOR Protection</strong>: We enforce rigid object-level checks so that your profile and payment plans cannot be intercepted or queried by third-party sessions. Security rules are strictly validated server-side.',
  "<span dangerouslySetInnerHTML={{ __html: t('security.p5.desc2') }} />"
);
security = security.replace(
  '3. <strong>Anti-Exploit Measures</strong>: All client variables and inputs undergo deep sanitized parsing to lock down client-to-server or script injection opportunities, and standard developer diagnostic utilities are actively secured to maintain full integrity.',
  "<span dangerouslySetInnerHTML={{ __html: t('security.p5.desc3') }} />"
);
fs.writeFileSync('src/pages/Security.tsx', security, 'utf-8');

// Update Legal.tsx
let legal = fs.readFileSync('src/pages/Legal.tsx', 'utf-8');
legal = legal.replace(
  '<strong>Acceptance of Terms</strong>: By using EcomBoost.org ("the Application"), you irrevocably agree to bound by these terms. We offer offline-friendly SaaS analytical dashboards and spy interfaces designed for solo builders, agency operators and brands.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p1.desc1') }} />"
);
legal = legal.replace(
  '<strong>Account Guidelines & Anti-Sharing</strong>: Every subscription is capped at its designated workspace limits (Starter: 1, Pro: 2, Business: 4 seats). Standard security hooks detect concurrent device usage; account sharing or credential proxying will immediately trigger a permanent lock.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p1.desc2') }} />"
);
legal = legal.replace(
  '<strong>Subscription Cycles & Revocation</strong>: Access is maintained via recurring billing (monthly, quarterly, or yearly) managed by payment processors. If matching fees fail or are revoked, active paid tokens are terminated. All payments are non-refundable except where required by active law.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p1.desc3') }} />"
);

legal = legal.replace(
  '<strong>Client-First Architecture</strong>: Our engineering model values absolute data privacy. EcomBoost.org does not collect, log, index, or store your private product prompts, brand details, or connection tokens on any centralized servers. Everything compiles temporarily inside standard browser client space (localStorage).',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p2.desc1') }} />"
);
legal = legal.replace(
  '<strong>Provider Connections</strong>: Custom LLM tokens (such as Claude, ChatGPT, or DeepSeek API Keys) bypass intermediate logs and feed directly to the formal respective server endpoints. They are protected during transit by standard cryptographic TLS layers. ',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p2.desc2') }} />"
);
legal = legal.replace(
  '<strong>No Tracking Bots</strong>: We run absolutely no telemetry networks, behavior cookies, or data scraper scripts. Your profit margins, operational overheads, and competitive spy queries belong to you and stay private indefinitely.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p2.desc3') }} />"
);

legal = legal.replace(
  '<strong>Financial Estimates</strong>: Margin and CAC/LTV math calculated within our calculators is formulated to resemble standard venture-capital models. However, they remain estimates. All financial decisions, scaling ad spends, and business setups should be reviewed by accredited internal representatives.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p3.desc1') }} />"
);
legal = legal.replace(
  '<strong>Limitation of Liability</strong>: EcomBoost.org, its founders, and partners can under no circumstances be held responsible for direct or indirect losses, ad account bans, marketing campaign failures, or budget over-expenditure resulting from data metrics explored inside the dashboard.',
  "<span dangerouslySetInnerHTML={{ __html: t('legal.p3.desc2') }} />"
);

fs.writeFileSync('src/pages/Legal.tsx', legal, 'utf-8');
console.log('Done secondary texts updates');
