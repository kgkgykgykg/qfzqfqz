import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

// Insert new translations
const newTranslationsEn = "\n    'dashboard.nav.aiKeyActive': 'AI Key Active',\n    'dashboard.nav.connectAI': 'Connect AI',\n    'dashboard.nav.myProfile': 'My Profile',\n";
const newTranslationsFr = "\n    'dashboard.nav.aiKeyActive': 'Clé IA Active',\n    'dashboard.nav.connectAI': 'Connecter l\\'IA',\n    'dashboard.nav.myProfile': 'Mon Profil',\n";
const newTranslationsEs = "\n    'dashboard.nav.aiKeyActive': 'Clave de IA activa',\n    'dashboard.nav.connectAI': 'Conectar IA',\n    'dashboard.nav.myProfile': 'Mi perfil',\n";
const newTranslationsDe = "\n    'dashboard.nav.aiKeyActive': 'KI-Schlüssel aktiv',\n    'dashboard.nav.connectAI': 'KI verbinden',\n    'dashboard.nav.myProfile': 'Mein Profil',\n";
const newTranslationsIt = "\n    'dashboard.nav.aiKeyActive': 'Chiave IA attiva',\n    'dashboard.nav.connectAI': 'Connetti IA',\n    'dashboard.nav.myProfile': 'Il mio profilo',\n";
const newTranslationsRu = "\n    'dashboard.nav.aiKeyActive': 'Ключ ИИ активен',\n    'dashboard.nav.connectAI': 'Подключить ИИ',\n    'dashboard.nav.myProfile': 'Мой профиль',\n";

content = content.replace(/(en:\s*\{)/, "$1" + newTranslationsEn);
content = content.replace(/(fr:\s*\{)/, "$1" + newTranslationsFr);
content = content.replace(/(es:\s*\{)/, "$1" + newTranslationsEs);
content = content.replace(/(de:\s*\{)/, "$1" + newTranslationsDe);
content = content.replace(/(it:\s*\{)/, "$1" + newTranslationsIt);
content = content.replace(/(ru:\s*\{)/, "$1" + newTranslationsRu);

// Change default language
content = content.replace(/localStorage\.getItem\('app-language'\);\s*return\ \(saved\ as\ Language\)\ \|\|\ 'fr';/g, "localStorage.getItem('app-language');\n    return (saved as Language) || 'en';");
content = content.replace(/localStorage\.getItem\('app-language'\);\s*return\ \(saved\ as\ Language\)\ \|\|\ 'en';/g, "localStorage.getItem('app-language');\n    return (saved as Language) || 'en';"); // Just to be sure

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
console.log('Done');
