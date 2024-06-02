import request, { RequestOptionsInit } from 'umi-request';
import { SESSION_STORAGE_KEY } from '@/hooks/useSession';

const url = `${process.env.API_URL || 'http://localhost:3000'}/api`;

export const endpoints = {
  register: `${url}/register`,
  login: `${url}/login`,
  changePassword: `${url}/change-password`,
};

const authorizationHeader = () => {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw || raw.length === 0) {
    return undefined;
  }

  let session = {};
  try {
    session = JSON.parse(raw);
  } catch (err) {
    //
  }

  const { token } = session as Record<string, any>;

  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
};

request.interceptors.request.use(
  (requestUrl, options) =>
  {
    options.headers = {
      ...options.headers,
      ...authorizationHeader(),
    };

    return {
      url: requestUrl,
      options: {
        ...options,
        timeout: 60000,
      },
    };
  },
  { global: true },
);

request.interceptors.response.use((response) => {
  if (
    (response.status === 403 || response.status === 401) &&
    !response.url.endsWith(endpoints.login) &&
    !response.url.endsWith(endpoints.changePassword)
  ) {
    localStorage.clear();
    location.href = '/login';
  }

  return response;
});

export const apiGet = (apiUrl: string, options?: RequestOptionsInit) => request.get(apiUrl, options);

export const apiPost = (apiUrl: string, options?: RequestOptionsInit) => request.post(apiUrl, options);

export const apiPut = (apiUrl: string, options?: RequestOptionsInit) => request.put(apiUrl, options);

export const apiDelete = (apiUrl: string, options?: RequestOptionsInit) => request.delete(apiUrl, options);
