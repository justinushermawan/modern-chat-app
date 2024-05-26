import { extend } from 'umi-request';

export const API_BASE_URL = 'http://localhost:3000';

const request = extend({
  prefix: `${API_BASE_URL}/api`,
});

export default request;
