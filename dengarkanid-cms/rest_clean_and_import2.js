const fs = require('fs');

async function run() {
  console.log('Fetching all glosariums (including drafts)...');
  const resp = await fetch('http://localhost:1337/api/glosariums?publicationState=preview&locale=all&pagination[limit]=1000');
  const data = await resp.json();
  const existing = data.data || [];
  
  console.log(`Deleting ${existing.length} items...`);
  for (const item of existing) {
    try {
      await fetch(`http://localhost:1337/api/glosariums/${item.documentId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.log('Error deleting', item.documentId, e.message);
    }
  }

  const prodData = JSON.parse(fs.readFileSync('prod_glosariums.json', 'utf8')).data;
  console.log(`Inserting ${prodData.length} items from production...`);
  for (const item of prodData) {
    await fetch('http://localhost:1337/api/glosariums?status=published', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.term,
          category: item.category,
          relatedTerms: item.relatedTerms,
          definition: item.definition,
          englishTerm: item.englishTerm,
          locale: 'id'
        }
      })
    });
  }
  console.log('Done!');
}
run().catch(console.error);
