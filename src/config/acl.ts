import 'dotenv/config';

export const acl = {
  'fcm-backend': {
    API_ENDPOINT: process.env.FCM_BACKEND_API_ENDPOINT || 'http://localhost:80/api/',
  },
} as const;
