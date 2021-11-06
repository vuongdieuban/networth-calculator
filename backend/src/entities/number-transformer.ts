import { ValueTransformer } from 'typeorm';

export const numberTransformer: ValueTransformer = {
  to(data) {
    return data;
  },
  from(data) {
    return parseFloat(data);
  },
};
