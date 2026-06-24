import fs from 'fs';

const path = './src/context/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const translations = {
  fr: {
    title1: "La boîte à outils pour",
    title2: "la croissance E-commerce",
    desc: "L'IA tout-en-un qui aide les entreprises à gérer leur marketing parfaitement pour réaliser plus de ventes et attirer de nouveaux clients facilement."
  },
  en: {
    title1: "The toolkit for",
    title2: "E-commerce growth",
    desc: "The all-in-one AI that helps businesses manage their marketing perfectly to make more sales and attract new customers easily."
  },
  es: {
    title1: "El kit de herramientas para",
    title2: "el crecimiento del E-commerce",
    desc: "La IA todo en uno que ayuda a las empresas a gestionar su marketing a la perfección para realizar más ventas y atraer nuevos clientes fácilmente."
  },
  ru: {
    title1: "Инструментарий для",
    title2: "роста электронной коммерции",
    desc: "Универсальный ИИ, который помогает компаниям идеально управлять своим маркетингом, чтобы увеличить продажи и легко привлекать новых клиентов."
  },
  it: {
    title1: "Il kit di strumenti per",
    title2: "la crescita dell'E-commerce",
    desc: "L'IA tutto-in-uno che aiuta le aziende a gestire il proprio marketing alla perfezione per aumentare le vendite e attirare nuovi clienti facilmente."
  },
  de: {
    title1: "Das Toolkit für",
    title2: "E-Commerce-Wachstum",
    desc: "Die All-in-One-KI, die Unternehmen hilft, ihr Marketing perfekt zu verwalten, um mehr Umsatz zu generieren und einfach neue Kunden zu gewinnen."
  }
};

const escape = (str) => str.replace(/'/g, "\\'");

for (const [lang, vals] of Object.entries(translations)) {
  const blockRegex = new RegExp(`  ${lang}: \\{([\\s\\S]*?)  \\},`);
  const blockMatch = content.match(blockRegex);
  
  if (blockMatch) {
    let block = blockMatch[1];
    
    const heroKeysRegex = /'landing\.hero\.title1':[\s\S]*?'landing\.hero\.desc': '.*?'/;
    const replacement = `'landing.hero.title1': '${escape(vals.title1)}',
    'landing.hero.accent': 'E-commerce',
    'landing.hero.title2': '${escape(vals.title2)}',
    'landing.hero.desc': '${escape(vals.desc)}'`;
    
    block = block.replace(heroKeysRegex, replacement);
    content = content.replace(blockMatch[1], block);
  }
}

fs.writeFileSync(path, content);
console.log('Hero translations fixed with proper escaping');
