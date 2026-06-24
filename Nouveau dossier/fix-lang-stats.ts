import fs from 'fs';

const path = 'src/context/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf-8');

const newTranslationsEn = `
    'landing.hero.stats.hours': 'Hours Saved',
    'landing.hero.stats.money': 'Money Generated Per client',
    'landing.hero.stats.growth': 'Growth per business',
`;

const newTranslationsFr = `
    'landing.hero.stats.hours': 'Heures Économisées',
    'landing.hero.stats.money': 'Gains par client',
    'landing.hero.stats.growth': 'Croissance par compte',
`;

content = content.replace(/(en:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(fr:\s*\{)/, "$1\n" + newTranslationsFr);
content = content.replace(/(es:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(de:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(it:\s*\{)/, "$1\n" + newTranslationsEn);
content = content.replace(/(ru:\s*\{)/, "$1\n" + newTranslationsEn);

fs.writeFileSync(path, content, 'utf-8');
console.log('Language files updated');
