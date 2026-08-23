const fs = require('fs');
let indexTs = fs.readFileSync('src/index.ts', 'utf8');
const syncScript = `
      // Sync Glosariums
      const glosariumCount = await strapi.db.query('api::glosarium.glosarium').count();
      if (glosariumCount === 0) {
        console.log('[BOOTSTRAP] Fetching glosariums from production...');
        try {
          const resp = await fetch('https://cms.dengarkan.id/api/glosariums?pagination[limit]=100');
          const data = await resp.json();
          for (const item of data.data) {
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
          console.log('[BOOTSTRAP] Successfully synced glosariums.');
        } catch (e) {
          console.error('[BOOTSTRAP] Error syncing glosariums:', e);
        }
      }
`;
if (!indexTs.includes('Sync Glosariums')) {
  indexTs = indexTs.replace('} catch (err) {', syncScript + '\n    } catch (err) {');
  fs.writeFileSync('src/index.ts', indexTs);
  console.log('Added sync script to src/index.ts');
}
