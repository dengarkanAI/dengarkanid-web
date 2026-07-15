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
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
});
