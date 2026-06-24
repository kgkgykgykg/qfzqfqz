import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

// Insert new translations
const newTranslationsEn = `
    'dashboard.nav.aiKeyActive': 'AI Key Active',
    'dashboard.nav.connectAI': 'Connect AI',
    'dashboard.nav.myProfile': 'My Profile',
`;
const newTranslationsFr = `
    'dashboard.nav.aiKeyActive': 'Clé IA Active',
    'dashboard.nav.connectAI': 'Connecter l\\'IA',
    'dashboard.nav.myProfile': 'Mon Profil',
`;

content = content.replace(/(en:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(fr:\s*\{)/, "$1\n" + newTranslationsFr);
content = content.replace(/(es:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(de:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(it:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(ru:\s*\{)/, "$1\n" + newTranslationsEn);

// Change default language
content = content.replace(/'fr'/g, "'en'");
// But what if we replaced something else? Just the initialization:
content = content.replace(/localStorage\.getItem\('app-language'\);\s*return\ \(saved\ as\ Language\)\ \|\|\ 'en';/g, "localStorage.getItem('app-language');\n    return (saved as Language) || 'en';"); // Let's ensure it's en. it had 'fr' before

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');

// Update Footer.tsx
let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footerContent = footerContent.replace(
  /const languages:[\\s\\S]*?\];/, 
  \`import { FlagFR, FlagUS, FlagES, FlagRU, FlagIT, FlagDE } from './flags';

const languages: { code: Language; label: string; flag: React.ReactNode }[] = [
  { code: 'fr', label: 'Français', flag: <FlagFR /> },
  { code: 'en', label: 'English', flag: <FlagUS /> },
  { code: 'es', label: 'Español', flag: <FlagES /> },
  { code: 'ru', label: 'Русский', flag: <FlagRU /> },
  { code: 'it', label: 'Italiano', flag: <FlagIT /> },
  { code: 'de', label: 'Deutsch', flag: <FlagDE /> },
];\`
);
fs.writeFileSync('src/components/Footer.tsx', footerContent, 'utf-8');

// Update SettingsPanel.tsx
let settingsContent = fs.readFileSync('src/components/SettingsPanel.tsx', 'utf-8');
settingsContent = settingsContent.replace(
  /const languages:[\\s\\S]*?\];/,
  \`import { FlagFR, FlagUS, FlagES, FlagRU, FlagIT, FlagDE } from './flags';

const languages: { code: Language; label: string; flag: React.ReactNode }[] = [
  { code: 'fr', label: 'Français', flag: <FlagFR /> },
  { code: 'en', label: 'English', flag: <FlagUS /> },
  { code: 'es', label: 'Español', flag: <FlagES /> },
  { code: 'ru', label: 'Русский', flag: <FlagRU /> },
  { code: 'it', label: 'Italiano', flag: <FlagIT /> },
  { code: 'de', label: 'Deutsch', flag: <FlagDE /> },
];\`
);
fs.writeFileSync('src/components/SettingsPanel.tsx', settingsContent, 'utf-8');

console.log('Language updates applied.');
