const { createStrapi } = require('@strapi/strapi');
async function run() {
  const strapi = createStrapi({ distDir: './dist' });
  await strapi.load();
  await strapi.db.query('api::global-setting.global-setting').deleteMany({});
  
  const doc = await strapi.documents('api::global-setting.global-setting').create({
    data: { footerInterestedTitle: "ID" },
    locale: 'id'
  });
  
  console.log("Created ID doc with documentId:", doc.documentId);
  
  const docEn = await strapi.documents('api::global-setting.global-setting').update({
    documentId: doc.documentId,
    data: { footerInterestedTitle: "EN" },
    locale: 'en'
  });
  
  console.log("Created/Updated EN doc with documentId:", docEn.documentId);
  
  process.exit(0);
}
run();
