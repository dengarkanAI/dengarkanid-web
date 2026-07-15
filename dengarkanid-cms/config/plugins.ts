export default ({ env }: { env: any }) => ({
  'export-csv': {
    enabled: true,
    config: {
      contentTypes: {
        'api::lead.lead': {
          batchSize: 50,
        },
      },
    },
  },
  upload: {
    config: {
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/tiff',
        'image/bmp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm',
        'application/pdf',
      ],
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
});
