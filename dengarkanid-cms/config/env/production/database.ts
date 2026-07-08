import path from 'path';

export default ({ env }) => {
  // Parse the DATABASE_URL environment variable provided by Render PostgreSQL
  const dbUrl = env('DATABASE_URL');
  let connection = {};
  
  if (dbUrl) {
    const url = new URL(dbUrl);
    connection = {
      client: 'postgres',
      connection: {
        host: url.hostname,
        port: url.port,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        ssl: {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF_SIGNED', false),
        },
      },
      debug: false,
    };
  }

  return {
    connection: connection
  };
};
