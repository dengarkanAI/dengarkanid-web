const fs = require('fs');
let indexTs = fs.readFileSync('src/index.ts', 'utf8');

const regex = /\/\/ 2\. Migrate Glosarium Data if empty[\s\S]*?(?=\/\/ 3\. Migrate Lead Data if empty)/;
indexTs = indexTs.replace(regex, '');

fs.writeFileSync('src/index.ts', indexTs);
console.log('Removed faulty block in src/index.ts');
