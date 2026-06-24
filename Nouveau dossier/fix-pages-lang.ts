import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'contact.title1': 'Operator Alliance',
    'contact.desc1': 'Need enterprise support, API routing configuration, or billing assistance? Our dedicated intelligence agents are available.',
    'contact.item1.title': 'Global Comm Link',
    'contact.item1.desc': 'General Ops & Support',
    'contact.item1.badge': 'response SLA: 12 hours',
    'contact.item2.title': 'Venture & Growth',
    'contact.item2.desc': 'Enterprise SaaS scaling',
    'contact.item3.title': 'Legal Desk',
    'contact.item3.desc': 'Compliance and data routing',
    'contact.form.title': 'Direct Inquiry',
    'contact.form.desc': 'Secure Ticket Submission',
    'contact.form.success.title': 'Message Compiled!',
    'contact.form.success.desc': 'Your secure report is ready. If your mail client didn\\'t open, send to',
    'contact.form.success.btn': 'Send New Inquiry',
    'contact.form.label1': 'Operator Identity',
    'contact.form.placeholder1': 'Your verified email address',
    'contact.form.label2': 'Inquiry Subject',
    'contact.form.placeholder2': 'Subject of your request',
    'contact.form.label3': 'Detailed Intel',
    'contact.form.placeholder3': 'Describe the technical anomaly or growth barrier...',
    'contact.form.security': 'Security Protocol: Message will be compiled locally and launched via your authorized mail client to ensure absolute data privacy.',
    'contact.form.submit': 'Submit Secure Inquiry',
    
    'security.title': 'Security & Trust',
    'security.subtitle': 'We implement industry-standard decentralized protocols and direct-end-point connections to ensure your proprietary product margins and API credentials stay 100% private.',
    'security.p1.title': 'Decentralized Storage',
    'security.p1.desc': 'Unlike typical SaaS sites that copy and centralize store connection details on external remote servers, EcomBoost.org stores your credentials directly inside your browser\\'s secure client-side database (localStorage). Your data never touches our servers.',
    'security.p2.title': 'No API Surcharges or Markups',
    'security.p2.desc': 'By supporting custom "Bring Your Own API Key" configurations, you communicate directly with Anthropic, OpenAI, and DeepSeek servers with zero middle-man markups or prompt inspection, guaranteeing untracked marketing intelligence campaigns.',
    'security.p3.title': 'Zero Logging of Prompts',
    'security.p3.desc': 'We run absolutely zero analytics algorithms or logging scripts on your custom marketing setups, margin calculations, or spy inputs. All business prompts evaluate strictly during active sessions and disappear instantly on logout.',
    'security.p4.title': 'Multi-Device Access Controls',
    'security.p4.desc': 'Our workspace security models allow exactly one active session lock per authenticated subscription. This blocks credential sharing, protects premium spy database searches, and secures your workspace logs against corporate intrusion.',
    'security.p5.title': 'Secure Practices & Safe Compliance',
    
    'legal.title': 'Legal & Compliance Docs',
    'legal.subtitle': 'Our Terms of Service and Privacy Framework document the rules governing our localized analytics sandbox, user seats, and the use of the EcomBoost.org platform.',
    'legal.p1.title': '1. Terms of Service',
    'legal.p2.title': '2. Privacy Protocol',
    'legal.p3.title': '3. Financial & Operational Disclaimer',
`;

const fr = `
    'contact.title1': 'Alliance Opérateur',
    'contact.desc1': 'Besoin d\\'assistance entreprise, d\\'une configuration de routage API ou d\\'aide à la facturation ? Nos agents spécialisés sont disponibles.',
    'contact.item1.title': 'Lien de Comm Mondial',
    'contact.item1.desc': 'Opérations & Support Général',
    'contact.item1.badge': 'SLA de réponse : 12 heures',
    'contact.item2.title': 'Venture & Croissance',
    'contact.item2.desc': 'Mise à l\\'échelle SaaS entreprise',
    'contact.item3.title': 'Bureau Légal',
    'contact.item3.desc': 'Conformité et gestion des données',
    'contact.form.title': 'Demande Directe',
    'contact.form.desc': 'Soumission de Ticket Sécurisée',
    'contact.form.success.title': 'Message Compilé !',
    'contact.form.success.desc': 'Votre rapport sécurisé est prêt. Si votre client de messagerie ne s\\'est pas ouvert, envoyez-le à',
    'contact.form.success.btn': 'Envoyer une Nouvelle Demande',
    'contact.form.label1': 'Identité de l\\'Opérateur',
    'contact.form.placeholder1': 'Votre adresse e-mail vérifiée',
    'contact.form.label2': 'Sujet de la Demande',
    'contact.form.placeholder2': 'Sujet de votre requête',
    'contact.form.label3': 'Informations Détaillées',
    'contact.form.placeholder3': 'Décrivez l\\'anomalie technique ou l\\'obstacle à la croissance...',
    'contact.form.security': 'Protocole de sécurité : Le message sera compilé localement et lancé via votre client de messagerie autorisé pour assurer une confidentialité absolue des données.',
    'contact.form.submit': 'Soumettre la Demande',

    'security.title': 'Sécurité & Confiance',
    'security.subtitle': 'Nous mettons en œuvre des protocoles décentralisés standard et des connexions directes avec les terminaux pour garantir que vos marges produit et vos identifiants API restent 100% privés.',
    'security.p1.title': 'Stockage Décentralisé',
    'security.p1.desc': 'Contrairement aux sites SaaS classiques qui copient et centralisent les détails de connexion de la boutique sur des serveurs distants externes, EcomBoost.org stocke vos informations d\\'identification directement dans la base de données sécurisée côté client de votre navigateur (localStorage). Vos données ne touchent jamais nos serveurs.',
    'security.p2.title': 'Aucune Surcharge ou Majoration API',
    'security.p2.desc': 'En prenant en charge les configurations personnalisées "Apportez Votre Propre Clé API", vous communiquez directement avec les serveurs Anthropic, OpenAI et DeepSeek sans majorations d\\'intermédiaires ou d\\'inspection des requêtes, garantissant des campagnes marketing intraçables.',
    'security.p3.title': 'Aucun Journal de Prompts',
    'security.p3.desc': 'Nous n\\'exécutons absolument aucun algorithme d\\'analyse ou script de journalisation sur vos configurations marketing personnalisées, vos calculs de marges ou vos requêtes espions. Toutes vos demandes professionnelles sont évaluées strictement pendant les sessions actives et disparaissent instantanément à la déconnexion.',
    'security.p4.title': 'Contrôle d\\'Accès Multi-Appareils',
    'security.p4.desc': 'Nos modèles de sécurité de l\\'espace de travail autorisent exactement un verrou de session actif par abonnement authentifié. Cela empêche le partage d\\'identifiants et protège les connexions du compte.',
    'security.p5.title': 'Pratiques Sécurisées & Conformité Garantie',

    'legal.title': 'Documents Légaux & Conformité',
    'legal.subtitle': 'Nos Conditions de Service et notre Cadre de Confidentialité documentent les règles régissant notre sandbox d\\'analyse localisée, les sièges d\\'utilisateurs et l\\'utilisation de la plateforme EcomBoost.org.',
    'legal.p1.title': '1. Conditions de Service',
    'legal.p2.title': '2. Protocole de Confidentialité',
    'legal.p3.title': '3. Avis de Non-Responsabilité Financier',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');

// Modify Contact.tsx
let contact = fs.readFileSync('src/pages/Contact.tsx', 'utf-8');
contact = contact.replace('Operator Alliance', '{t(\'contact.title1\')}');
contact = contact.replace('Need enterprise support, API routing configuration, or billing assistance? Our dedicated intelligence agents are available.', '{t(\'contact.desc1\')}');
contact = contact.replace("title: 'Global Comm Link'", "title: t('contact.item1.title')");
contact = contact.replace("desc: 'General Ops & Support'", "desc: t('contact.item1.desc')");
contact = contact.replace("badge: 'response SLA: 12 hours'", "badge: t('contact.item1.badge')");

contact = contact.replace("title: 'Venture & Growth'", "title: t('contact.item2.title')");
contact = contact.replace("desc: 'Enterprise SaaS scaling'", "desc: t('contact.item2.desc')");

contact = contact.replace("title: 'Legal Desk'", "title: t('contact.item3.title')");
contact = contact.replace("desc: 'Compliance and data routing'", "desc: t('contact.item3.desc')");

contact = contact.replace('>Direct Inquiry<', '>{t(\'contact.form.title\')}<');
contact = contact.replace('>Secure Ticket Submission<', '>{t(\'contact.form.desc\')}<');

contact = contact.replace('>Message Compiled!<', '>{t(\'contact.form.success.title\')}<');
contact = contact.replace(/Your secure report is ready\. If your mail client didn't open, send to/, '{t(\'contact.form.success.desc\')}');

contact = contact.replace('>Send New Inquiry<', '>{t(\'contact.form.success.btn\')}<');

contact = contact.replace(/Operator Identity/, '{t(\'contact.form.label1\')}');
contact = contact.replace(/Your verified email address/, '{t(\'contact.form.placeholder1\')}');

contact = contact.replace(/Inquiry Subject/, '{t(\'contact.form.label2\')}');
contact = contact.replace(/Subject of your request/, '{t(\'contact.form.placeholder2\')}');

contact = contact.replace(/Detailed Intel/, '{t(\'contact.form.label3\')}');
contact = contact.replace(/Describe the technical anomaly or growth barrier\.\.\./, '{t(\'contact.form.placeholder3\')}');

contact = contact.replace(/Security Protocol: Message will be compiled locally and launched via your authorized mail client to ensure absolute data privacy\./, '{t(\'contact.form.security\')}');

contact = contact.replace(/Submit Secure Inquiry/, '{t(\'contact.form.submit\')}');

fs.writeFileSync('src/pages/Contact.tsx', contact, 'utf-8');

// Modify Security.tsx
let security = fs.readFileSync('src/pages/Security.tsx', 'utf-8');
security = security.replace('>Security & Trust<', '>{t(\'security.title\')}<');
security = security.replace('We implement industry-standard decentralized protocols and direct-end-point connections to ensure your proprietary product margins and API credentials stay 100% private.', '{t(\'security.subtitle\')}');

security = security.replace('>Decentralized Storage<', '>{t(\'security.p1.title\')}<');
security = security.replace('Unlike typical SaaS sites that copy and centralize store connection details on external remote servers, EcomBoost.org stores your credentials directly inside your browser\'s secure client-side database (localStorage). Your data never touches our servers.', '{t(\'security.p1.desc\')}');

security = security.replace('>No API Surcharges or Markups<', '>{t(\'security.p2.title\')}<');
security = security.replace('By supporting custom "Bring Your Own API Key" configurations, you communicate directly with Anthropic, OpenAI, and DeepSeek servers with zero middle-man markups or prompt inspection, guaranteeing untracked marketing intelligence campaigns.', '{t(\'security.p2.desc\')}');

security = security.replace('>Zero Logging of Prompts<', '>{t(\'security.p3.title\')}<');
security = security.replace('We run absolutely zero analytics algorithms or logging scripts on your custom marketing setups, margin calculations, or spy inputs. All business prompts evaluate strictly during active sessions and disappear instantly on logout.', '{t(\'security.p3.desc\')}');

security = security.replace('>Multi-Device Access Controls<', '>{t(\'security.p4.title\')}<');
security = security.replace('Our workspace security models allow exactly one active session lock per authenticated subscription. This blocks credential sharing, protects premium spy database searches, and secures your workspace logs against corporate intrusion.', '{t(\'security.p4.desc\')}');

security = security.replace('>Secure Practices & Safe Compliance<', '>{t(\'security.p5.title\')}<');

fs.writeFileSync('src/pages/Security.tsx', security, 'utf-8');

// Modify Legal.tsx
let legal = fs.readFileSync('src/pages/Legal.tsx', 'utf-8');
legal = legal.replace('>Legal & Compliance Docs<', '>{t(\'legal.title\')}<');
legal = legal.replace('Our Terms of Service and Privacy Framework document the rules governing our localized analytics sandbox, user seats, and the use of the EcomBoost.org platform.', '{t(\'legal.subtitle\')}');

legal = legal.replace('>1. Terms of Service<', '>{t(\'legal.p1.title\')}<');
legal = legal.replace('>2. Privacy Protocol<', '>{t(\'legal.p2.title\')}<');
legal = legal.replace('>3. Financial & Operational Disclaimer<', '>{t(\'legal.p3.title\')}<');

fs.writeFileSync('src/pages/Legal.tsx', legal, 'utf-8');

console.log('Language files updated Pages.');
