async function run() {
  // 1. Fetch all local glosariums
  const localResp = await fetch('http://localhost:1337/api/glosariums?locale=all&pagination[limit]=1000');
  const localData = await localResp.json();
  const localItems = localData.data || [];
  
  console.log(`Deleting ${localItems.length} local items...`);
  for (const item of localItems) {
    const docId = item.documentId;
    await fetch(`http://localhost:1337/api/glosariums/${docId}`, { method: 'DELETE' });
  }

  // 2. Fetch from production
  const prodResp = await fetch('https://www.dengarkan.id/api/glosariums?locale=all&pagination[limit]=1000');
  const prodData = await prodResp.json();
  const prodItems = prodData.data || [];
  
  console.log(`Fetched ${prodItems.length} items from production. Inserting...`);
  
  for (const item of prodItems) {
    const locale = item.locale || 'id';
    await fetch(`http://localhost:1337/api/glosariums?locale=${locale}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          term: item.term,
          category: item.category,
          relatedTerms: item.relatedTerms,
          definition: item.definition,
          englishTerm: item.englishTerm
        }
      })
    });
  }
  console.log('Done fixing glosariums!');
}

run().catch(console.error);
