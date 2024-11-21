const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://www.kabiflow.com/api/v1/'
    : 'http://localhost:5000/api/v1';

export default BASE_URL;