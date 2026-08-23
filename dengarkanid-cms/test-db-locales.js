const { createStrapi } = require('@strapi/strapi');
async function run() {
  const strapi = createStrapi({ distDir: './dist' });
  await strapi.load();
  const docs = await strapi.documents('api::global-setting.global-setting').findMany({ locale: 'all', populate: 'localizations' });
  console.log(JSON.stringify(docs, null, 2));
  process.exit(0);
}
run();
