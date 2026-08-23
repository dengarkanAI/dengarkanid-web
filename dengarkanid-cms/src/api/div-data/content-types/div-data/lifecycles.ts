import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

export default {
  beforeUpdate(event: any) {
    throw new ApplicationError('Leads are view-only and cannot be edited.');
  },
};
