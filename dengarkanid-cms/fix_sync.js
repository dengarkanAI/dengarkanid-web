const fs = require('fs');
let indexTs = fs.readFileSync('src/index.ts', 'utf8');

indexTs = indexTs.replace(/const data = await resp\.json\(\);/g, 'const data = (await resp.json()) as any;');
indexTs = indexTs.replace(/categoryIdentifier: item\.attributes\.categoryIdentifier/g, 'category: item.attributes.category');
indexTs = indexTs.replace(/description: item\.attributes\.description/g, 'definition: item.attributes.definition');

fs.writeFileSync('src/index.ts', indexTs);
console.log('Fixed types and fields in src/index.ts');
