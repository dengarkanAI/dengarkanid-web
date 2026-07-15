export default ({ env }) => ({
  'preview-button': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::homepage.homepage',
          draft: {
            url: env('FRONTEND_URL', 'http://127.0.0.1:3001'),
            query: { preview: 'true' },
          },
          published: {
            url: env('FRONTEND_URL', 'http://127.0.0.1:3001'),
          },
        },
        {
          uid: 'api::hero.hero',
          draft: {
            url: env('FRONTEND_URL', 'http://127.0.0.1:3001'),
            query: { preview: 'true' },
          },
          published: {
            url: env('FRONTEND_URL', 'http://127.0.0.1:3001'),
          },
        },
        {
          uid: 'api::blog.blog',
          draft: {
            url: `${env('FRONTEND_URL', 'http://127.0.0.1:3001')}/artikel/{slug}`,
            query: { preview: 'true' },
          },
          published: {
            url: `${env('FRONTEND_URL', 'http://127.0.0.1:3001')}/artikel/{slug}`,
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
