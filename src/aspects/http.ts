export const createQueryString = (object: object) => {
  const searchParams = new URLSearchParams();

  Object.entries(object).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
    }

    if (value !== undefined) {
      searchParams.append(key, encodeURIComponent(String(value)));
    }
  });

  return searchParams.toString();
};

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const ContentType = {
  JSON: 'application/json',
  PLAIN: 'text/plain',
  HTML: 'text/html',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];
