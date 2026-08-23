const http = require('https');
const httpLocal = require('http');

console.log('Fetching from production...');
http.get('https://cms.dengarkan.id/api/glosariums?pagination[limit]=100', (resp) => {
  let data = '';
  resp.on('data', chunk => data += chunk);
  resp.on('end', async () => {
    const glosariums = JSON.parse(data).data;
    console.log(`Fetched ${glosariums.length} items. Inserting...`);
    
    for (const item of glosariums) {
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
  });
});
