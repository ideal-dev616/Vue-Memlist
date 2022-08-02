import axios from 'axios';
import store from './store';

import { PURGE_AUTH } from './store/auth.module';

axios.interceptors.request.use(request => {
  const token = store.getters.token;
  if (token) {
    request.headers.common['X-Access-Token'] = token;
  }

  const mtoken = store.getters.mtoken;

  if (mtoken) {
    request.headers.common['X-Client-Token'] = mtoken;
  }

  return request;
});

axios.interceptors.response.use(
  response => response,
  error => {
    const { status } = error.response;

    if (status === 401 && store.getters.isAuthenticated) {
      store.commit(PURGE_AUTH);
      //router.push({ name: 'login' });
    } else {
      return error.response;
    }
  }
);
