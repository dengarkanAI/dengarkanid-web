const { createStrapi } = require('@strapi/strapi');
const fs = require('fs');

createStrapi().start().then(async (app) => {
  console.log('Strapi started. Cleaning up glosariums...');
  
  // 1. Delete all existing glosariums
  const existing = await app.documents('api::glosarium.glosarium').findMany({ limit: 1000 });
  console.log(`Found ${existing.length} existing glosariums to delete.`);
  for (const item of existing) {
    try {
      await app.documents('api::glosarium.glosarium').delete({ documentId: item.documentId });
    } catch (e) {}
  }
  
  // 2. Insert exactly the 9 items from production
  const data = JSON.parse(fs.readFileSync('prod_glosariums.json', 'utf8')).data;
  console.log(`Inserting ${data.length} items from production...`);
  
  for (const item of data) {
    await app.documents('api::glosarium.glosarium').create({
      data: {
        term: item.term,
        category: item.category,
        relatedTerms: item.relatedTerms,
        definition: item.definition,
        englishTerm: item.englishTerm,
        locale: 'id'
      },
      status: 'published'
    });
  }
  
  console.log('Done cleaning and importing!');
  process.exit(0);
}).catch(console.error);
