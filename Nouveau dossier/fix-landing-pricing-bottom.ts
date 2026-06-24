import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'landing.pricing.compare': 'View Full Feature Comparison Table',
    'landing.pricing.custom.tag': 'CUSTOM',
    'landing.pricing.custom.title': 'CUSTOM',
    'landing.pricing.custom.desc': 'For major e-commerce brands, high-volume agencies, and enterprise organizations seeking next-level scaling.',
    'landing.pricing.custom.btn': 'Contact Us',
    'landing.pricing.custom.eco': 'Enterprise Ecosystem:',
    'landing.pricing.custom.f1': 'Unlimited user seats & custom tooling',
    'landing.pricing.custom.f2': 'Adjusted high-volume API configuration options',
    'landing.pricing.custom.f3': 'Dedicated Slack channel & fast response SLAs',
    'landing.pricing.custom.f4': 'On-demand custom feature development',
`;

const fr = `
    'landing.pricing.compare': 'Voir le Tableau de Comparaison Complet',
    'landing.pricing.custom.tag': 'SUR MESURE',
    'landing.pricing.custom.title': 'SUR MESURE',
    'landing.pricing.custom.desc': 'Pour les grandes marques de e-commerce, les agences à fort volume et les organisations cherchant à évoluer massivement.',
    'landing.pricing.custom.btn': 'Nous Contacter',
    'landing.pricing.custom.eco': 'Écosystème Entreprise:',
    'landing.pricing.custom.f1': 'Sièges illimités & outils personnalisés',
    'landing.pricing.custom.f2': 'Options de configuration API à grand volume',
    'landing.pricing.custom.f3': 'Canal Slack dédié & SLA de réponse rapide',
    'landing.pricing.custom.f4': 'Développement de fonctionnalités sur demande',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');

let landing = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');
landing = landing.replace('View Full Feature Comparison Table', '{translate(\'landing.pricing.compare\')}');
landing = landing.replace('CUSTOM\n                </div>', '{translate(\'landing.pricing.custom.tag\')}\n                </div>');
landing = landing.replace('>CUSTOM</h3', '>{translate(\'landing.pricing.custom.title\')}</h3');
landing = landing.replace('For major e-commerce brands, high-volume agencies, and enterprise organizations seeking next-level scaling.', '{translate(\'landing.pricing.custom.desc\')}');
landing = landing.replace('Contact Us\n                  </Link>', '{translate(\'landing.pricing.custom.btn\')}\n                  </Link>');
landing = landing.replace('Enterprise Ecosystem:', '{translate(\'landing.pricing.custom.eco\')}');
landing = landing.replace('<span>Unlimited user seats & custom tooling</span>', '<span>{translate(\'landing.pricing.custom.f1\')}</span>');
landing = landing.replace('<span>Adjusted high-volume API configuration options</span>', '<span>{translate(\'landing.pricing.custom.f2\')}</span>');
landing = landing.replace('<span>Dedicated Slack channel & fast response SLAs</span>', '<span>{translate(\'landing.pricing.custom.f3\')}</span>');
landing = landing.replace('<span>On-demand custom feature development</span>', '<span>{translate(\'landing.pricing.custom.f4\')}</span>');

fs.writeFileSync('src/pages/Landing.tsx', landing, 'utf-8');
console.log('done bottom pricing features text translation');
