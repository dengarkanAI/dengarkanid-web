const { createStrapi } = require('@strapi/strapi');
async function run() {
  const strapi = createStrapi({ distDir: './dist' });
  await strapi.load();
  await strapi.db.query('api::global-setting.global-setting').deleteMany({});
  process.exit(0);
}
run();
