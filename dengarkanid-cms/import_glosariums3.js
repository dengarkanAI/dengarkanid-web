const fs = require('fs');

async function run() {
  const data = JSON.parse(fs.readFileSync('glosariums.json', 'utf8')).data;
  console.log(`Fetched ${data.length} items. Inserting...`);
  
  for (const item of data) {
    // id
    await fetch('http://localhost:1337/api/glosariums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.attributes.term,
          category: item.attributes.category,
          relatedTerms: item.attributes.relatedTerms,
          definition: item.attributes.definition,
          locale: 'id'
        }
      })
    });
    // en
    await fetch('http://localhost:1337/api/glosariums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.attributes.term,
          category: item.attributes.category,
          relatedTerms: item.attributes.relatedTerms,
          definition: item.attributes.definition,
          locale: 'en'
        }
      })
    });
  }
  console.log('Done inserting via API!');
}

run().catch(console.error);
