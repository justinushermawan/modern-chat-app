import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

export default axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
