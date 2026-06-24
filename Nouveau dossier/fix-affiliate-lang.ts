import fs from 'fs';

let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf-8');

const en = `
    'affiliate.title': 'Partner Program',
    'affiliate.subtitle.pre': 'You earn ',
    'affiliate.subtitle.hl': '50% of all sales',
    'affiliate.subtitle.post': ' from users who sign up through your link.',
    'affiliate.step1.title': 'Generate Link',
    'affiliate.step1.desc': 'Click the button below to generate your unique tracking URL.',
    'affiliate.step2.title': 'Share With Audience',
    'affiliate.step2.desc': 'Post it on your social media, blog, or send it to your friends.',
    'affiliate.step3.title': 'Earn 50% Commision',
    'affiliate.step3.desc': 'When they subscribe, you instantly earn half of the revenue.',
    'affiliate.generate.btn': 'Generate Affiliate Link',
    'affiliate.generated.label': 'Your Tracking Link:',
`;

const fr = `
    'affiliate.title': 'Programme Partenaire',
    'affiliate.subtitle.pre': 'Vous gagnez ',
    'affiliate.subtitle.hl': '50% des ventes',
    'affiliate.subtitle.post': ' des utilisateurs qui s\\'inscrivent via votre lien.',
    'affiliate.step1.title': 'Générer le Lien',
    'affiliate.step1.desc': 'Cliquez sur le bouton ci-dessous pour générer votre URL de suivi unique.',
    'affiliate.step2.title': 'Partager avec votre Audience',
    'affiliate.step2.desc': 'Publiez-le sur vos réseaux sociaux, votre blog ou envoyez-le à vos amis.',
    'affiliate.step3.title': 'Gagnez 50% de Commission',
    'affiliate.step3.desc': 'Lorsqu\\'ils s\\'abonnent, vous gagnez instantanément la moitié des revenus.',
    'affiliate.generate.btn': 'Générer le Lien d\\'Affiliation',
    'affiliate.generated.label': 'Votre Lien de Suivi :',
`;

content = content.replace(/(en:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(fr:\s*\{)/, "$1" + "\n" + fr);
content = content.replace(/(es:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(de:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(it:\s*\{)/, "$1" + "\n" + en);
content = content.replace(/(ru:\s*\{)/, "$1" + "\n" + en);

fs.writeFileSync('src/context/LanguageContext.tsx', content, 'utf-8');
