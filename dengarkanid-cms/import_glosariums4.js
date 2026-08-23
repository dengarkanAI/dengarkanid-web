async function run() {
  const resp = await fetch('https://www.dengarkan.id/api/glosariums?pagination[limit]=100');
  const data = await resp.json();
  const items = data.data;
  console.log(`Fetched ${items.length} items. Inserting...`);
  
  for (const item of items) {
    // id
    await fetch('http://localhost:1337/api/glosariums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.attributes ? item.attributes.term : item.term,
          category: item.attributes ? item.attributes.category : item.category,
          relatedTerms: item.attributes ? item.attributes.relatedTerms : item.relatedTerms,
          definition: item.attributes ? item.attributes.definition : item.definition,
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
          term: item.attributes ? item.attributes.term : item.term,
          category: item.attributes ? item.attributes.category : item.category,
          relatedTerms: item.attributes ? item.attributes.relatedTerms : item.relatedTerms,
          definition: item.attributes ? item.attributes.definition : item.definition,
          locale: 'en'
        }
      })
    });
  }
  console.log('Done inserting via API!');
}

run().catch(console.error);
