const http = require('https');

http.get('https://cms.dengarkan.id/api/glosariums?pagination[limit]=100', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', async () => {
    const glosariums = JSON.parse(data).data;
    console.log(`Fetched ${glosariums.length} items from production.`);
    for (const item of glosariums) {
      await strapi.documents('api::glosarium.glosarium').create({
        data: {
          term: item.attributes.term,
          categoryIdentifier: item.attributes.categoryIdentifier,
          relatedTerms: item.attributes.relatedTerms,
          description: item.attributes.description,
          locale: 'id'
        },
        status: 'published'
      });
      // also create english version
      await strapi.documents('api::glosarium.glosarium').create({
        data: {
          term: item.attributes.term,
          categoryIdentifier: item.attributes.categoryIdentifier,
          relatedTerms: item.attributes.relatedTerms,
          description: item.attributes.description,
          locale: 'en'
        },
        status: 'published'
      });
    }
    console.log('Done inserting to local DB.');
    process.exit(0);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
  process.exit(1);
});
