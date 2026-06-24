import fs from 'fs';

const path = './src/context/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const updateBlock = (lang, title1, accent, title2) => {
  const startMarker = `  ${lang}: {`;
  const endMarker = `  },`;
  
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return;
  
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx === -1) return;
  
  let block = content.substring(startIdx, endIdx);
  
  const lines = block.split('\n');
  const newLines = lines.map(line => {
    if (line.includes("'landing.hero.title1':")) return `    'landing.hero.title1': '${title1.replace(/'/g, "\\'")}',`;
    if (line.includes("'landing.hero.accent':")) return `    'landing.hero.accent': '${accent.replace(/'/g, "\\'")}',`;
    if (line.includes("'landing.hero.title2':")) return `    'landing.hero.title2': '${title2.replace(/'/g, "\\'")}',`;
    return line;
  });
  
  const newBlock = newLines.join('\n');
  content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
};

updateBlock('fr', "La boîte à outils pour", "E-commerce", "croissante");
updateBlock('en', "The toolkit for", "E-commerce", "growth");
updateBlock('es', "El kit de herramientas para", "E-commerce", "crecimiento");
updateBlock('ru', "Инструментарий для", "E-commerce", "роста");
updateBlock('it', "Il kit di strumenti per", "E-commerce", "crescita");
updateBlock('de', "Das Toolkit für", "E-Commerce", "Wachstum");

fs.writeFileSync(path, content);
console.log('Hero translations updated to avoid duplication');
