const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com/api/v1'
    : 'http://localhost:5000/api/v1';

export default BASE_URL;