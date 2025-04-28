import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});
