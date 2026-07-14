export default {
  routes: [
    {
      method: 'GET',
      path: '/feature-sections',
      handler: 'feature-section.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/feature-sections/:id',
      handler: 'feature-section.findOne',
      config: {
        auth: false,
      },
    }
  ],
};
