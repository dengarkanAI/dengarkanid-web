import compress from 'koa-compress';

export default (config: any, { strapi }: any) => {
  return compress({
    threshold: 1024,
  });
};
