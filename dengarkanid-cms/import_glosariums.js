const { createStrapi } = require('@strapi/strapi');
const http = require('https');

createStrapi().start().then(async (app) => {
  console.log('Strapi started. Fetching from production...');
  http.get('https://cms.dengarkan.id/api/glosariums?pagination[limit]=100', (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', async () => {
      const glosariums = JSON.parse(data).data;
      console.log(`Fetched ${glosariums.length} items.`);
      for (const item of glosariums) {
        await app.documents('api::glosarium.glosarium').create({
          data: {
            term: item.attributes.term,
            category: item.attributes.category,
            relatedTerms: item.attributes.relatedTerms,
            definition: item.attributes.definition,
            locale: 'id'
          },
          status: 'published'
        });
        await app.documents('api::glosarium.glosarium').create({
          data: {
            term: item.attributes.term,
            category: item.attributes.category,
            relatedTerms: item.attributes.relatedTerms,
            definition: item.attributes.definition,
            locale: 'en'
          },
          status: 'published'
        });
      }
      console.log('Done inserting!');
      process.exit(0);
    });
  });
});
