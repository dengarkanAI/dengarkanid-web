const strapi = require('@strapi/strapi');
const fs = require('fs');

(async () => {
  try {
    console.log('Starting Strapi instance...');
    const app = await strapi.createStrapi().load();

    const contentTypes = [
      'api::homepage.homepage',
      'api::hero.hero',
      'api::feature-section.feature-section',
      'api::faq.faq',
      'api::glosarium.glosarium',
      'api::testimonial.testimonial',
      'api::blog.blog'
    ];

    const data = {};

    for (const ct of contentTypes) {
      console.log(`Exporting ${ct}...`);
      const isSingleType = ct === 'api::homepage.homepage' || ct === 'api::hero.hero';
      
      try {
        if (isSingleType) {
          const doc = await app.documents(ct).findFirst({
            locale: 'id',
            populate: '*',
          });
          data[ct] = doc;
        } else {
          const docs = await app.documents(ct).findMany({
            locale: 'id',
            populate: '*',
          });
          data[ct] = docs;
        }
      } catch (err) {
        console.error(`Error exporting ${ct}:`, err.message);
      }
    }

    fs.writeFileSync('id_content.json', JSON.stringify(data, null, 2));
    console.log('Export complete. Saved to id_content.json');
    
    // Cleanly exit
    process.exit(0);
  } catch (error) {
    console.error('Failed to run export:', error);
    process.exit(1);
  }
})();
