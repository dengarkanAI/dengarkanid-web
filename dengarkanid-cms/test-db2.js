const { createStrapi } = require('@strapi/strapi');
async function run() {
  const strapi = createStrapi({ distDir: './dist' });
  await strapi.load();
  
  await strapi.db.query('api::global-setting.global-setting').deleteMany({});
  
  const doc = await strapi.documents('api::global-setting.global-setting').create({
    data: { footerInterestedTitle: "ID" },
    locale: 'id'
  });
  
  const docEn = await strapi.db.query('api::global-setting.global-setting').create({
    data: {
      documentId: doc.documentId,
      footerInterestedTitle: "EN",
      locale: 'en',
      publishedAt: new Date()
    }
  });
  
  console.log("Created EN doc with documentId:", docEn.documentId);
  process.exit(0);
}
run();
