const fs = require('fs');

async function run() {
  const data = JSON.parse(fs.readFileSync('prod_glosariums.json', 'utf8')).data;
  console.log(`Fetched ${data.length} items. Inserting...`);
  
  for (const item of data) {
    await fetch('http://localhost:1337/api/glosariums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.term,
          category: item.category,
          relatedTerms: item.relatedTerms,
          definition: item.definition,
          englishTerm: item.englishTerm,
        }
      })
    });
  }
  console.log('Done inserting via API!');
}

run().catch(console.error);
