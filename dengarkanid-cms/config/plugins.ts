export default () => ({
  'preview-button': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::homepage.homepage',
          draft: {
            url: 'http://localhost:3001',
            query: { preview: 'true' },
          },
          published: {
            url: 'http://localhost:3001',
          },
        },
        {
          uid: 'api::hero.hero',
          draft: {
            url: 'http://localhost:3001',
            query: { preview: 'true' },
          },
          published: {
            url: 'http://localhost:3001',
          },
        },
        {
          uid: 'api::blog.blog',
          draft: {
            url: 'http://localhost:3001/artikel/{slug}',
            query: { preview: 'true' },
          },
          published: {
            url: 'http://localhost:3001/artikel/{slug}',
          },
        },
      ],
    },
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
});
