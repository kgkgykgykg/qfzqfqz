import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'login.title': 'Welcome Back',
    'login.subtitle': 'Log in to continue to your dashboard',
    'login.cta': 'Continue with Google',
`;

const fr = `
    'login.title': 'Bon retour',
    'login.subtitle': 'Connectez-vous pour accéder à votre tableau de bord',
    'login.cta': 'Continuer avec Google',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
