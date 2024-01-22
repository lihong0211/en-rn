import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  timeout: 3000,
  headers: {'X-Custom-Header': 'foobar'},
});

instance.interceptors.response.use(
  res => {
    if (res?.data?.code === 200) {
      return Promise.resolve(res?.data?.data);
    } else {
      return Promise.reject(res?.data?.msg);
    }
  },
  err => {
    throw err;
  },
);

export default instance;
