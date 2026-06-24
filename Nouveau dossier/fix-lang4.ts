import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'landing.reviews.title': 'Approved by high-growth founders & operators',
    'landing.reviews.subtitle': 'Here is what founders, developers, and CFOs are saying about EcomBoost.ai',
`;

const fr = `
    'landing.reviews.title': 'Approuvé par les fondateurs & opérateurs à forte croissance',
    'landing.reviews.subtitle': 'Voici ce que les fondateurs, développeurs et CFO pensent de EcomBoost.ai',
`;

const es = `
    'landing.reviews.title': 'Aprobado por fundadores y operadores de alto crecimiento',
    'landing.reviews.subtitle': 'Esto es lo que dicen los fundadores, desarrolladores y directores financieros sobre EcomBoost.ai',
`;
const de = `
    'landing.reviews.title': 'Von wachstumsstarken Gründern & Betreibern genehmigt',
    'landing.reviews.subtitle': 'Das sagen Gründer, Entwickler und CFOs über EcomBoost.ai',
`;
const it = `
    'landing.reviews.title': 'Approvato da fondatori e operatori ad alta crescita',
    'landing.reviews.subtitle': 'Ecco cosa dicono i fondatori, gli sviluppatori e i CFO di EcomBoost.ai',
`;
const ru = `
    'landing.reviews.title': 'Одобрено основателями и операторами с высокими темпами роста',
    'landing.reviews.subtitle': 'Вот что говорят основатели, разработчики и финансовые директора о EcomBoost.ai',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + es);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + de);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + it);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + ru);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
console.log('Language files updated.');
