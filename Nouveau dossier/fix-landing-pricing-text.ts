import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'landing.pricing.featured': 'Featured capabilities:',
    'landing.pricing.cycle.billedQ': ' (b. quarterly)',
    'landing.pricing.cycle.billedY': ' (b. annually)',
`;
const fr = `
    'landing.pricing.featured': 'Fonctionnalités incluses :',
    'landing.pricing.cycle.billedQ': ' (fact. trimestr.)',
    'landing.pricing.cycle.billedY': ' (fact. annuell.)',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');

let landing = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');
landing = landing.replace(
  /<div className="absolute top-0 right-0 bg-accent text-white px-5 py-2 rounded-bl-3xl text-\[10px\] font-bold uppercase tracking-widest">\s*Popular\s*<\/div>/,
  '<div className="absolute top-0 right-0 bg-accent text-white px-5 py-2 rounded-bl-3xl text-[10px] font-bold uppercase tracking-widest">\n                        {translate(\'landing.pricing.pro.popular\')}\n                      </div>'
);
landing = landing.replace(
  /<span className={`text-\[10px\] font-bold uppercase tracking-wider block mb-4 \$\{d \? 'text-text-subtle' : 'text-text-subtle-light'}`}>\s*Featured capabilities:\s*<\/span>/,
  '<span className={`text-[10px] font-bold uppercase tracking-wider block mb-4 ${d ? \'text-text-subtle\' : \'text-text-subtle-light\'}`}>\n                          {translate(\'landing.pricing.featured\')}\n                        </span>'
);
landing = landing.replace(
  /\/mo\{billingCycle === 'month' \? '' : billingCycle === 'quarter' \? ' \(b\. quarterly\)' : ' \(b\. annually\)'\}/,
  '/mo{billingCycle === \'month\' ? \'\' : billingCycle === \'quarter\' ? translate(\'landing.pricing.cycle.billedQ\') : translate(\'landing.pricing.cycle.billedY\')}'
);
fs.writeFileSync('src/pages/Landing.tsx', landing, 'utf-8');
console.log('done text replaces')
