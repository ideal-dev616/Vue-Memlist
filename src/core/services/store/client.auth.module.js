import Cookies from 'js-cookie';

// action types
export const CLIENT_LOGIN = 'clientlogin';
export const CLIENT_LOGOUT = 'clientlogout';
export const CLIENT_SET_COMPANY = 'setClientCompany';

export const CLIENT_UPDATE_COMPANY = 'updateClientCompany';

// mutation types
export const CLIENT_PURGE_AUTH = 'clientlogOut';
export const CLIENT_SET_AUTH = 'setClient';

const clientc = Cookies.get('client');

const state = {
  client: 'undefined' === typeof clientc ? null : JSON.parse(Cookies.get('client')),
  mtoken: Cookies.get('mtoken')
};

const getters = {
  //currentClientCompany: state => state.clientcompany,
  currentClient: state => state.client,
  mtoken: state => state.mtoken,
  isMemAuthenticated: state => state.client !== null
};

const actions = {
  [CLIENT_LOGIN](context, data) {
    context.commit(CLIENT_SET_AUTH, data);
  },
  [CLIENT_LOGOUT](context) {
    context.commit(CLIENT_PURGE_AUTH);
  },
  [CLIENT_SET_COMPANY](state, payload) {
    state.commit(CLIENT_UPDATE_COMPANY, payload);
  },
};

const mutations = {
  [CLIENT_SET_AUTH](state, data) {
    state.client = data.client;
    state.mtoken = data.token;
    state.company = data.company;

    var expire = new Date();
    // Add two weeks
    expire.setDate(expire.getDate() + 14);

    //Cookies.set('clientcompany', JSON.stringify(data.company));
    Cookies.set('client', JSON.stringify(data.client));
    Cookies.set('mtoken', data.token, { expires: expire });

  },
  [CLIENT_PURGE_AUTH](state) {
    state.client = null;
    Cookies.remove('client');
    Cookies.remove('mtoken');
    Cookies.remove('clientcompany');
  },
  [CLIENT_UPDATE_COMPANY](state, data) {
    state.company = data.company;
    //Cookies.set('clientcompany', JSON.stringify(data.company));
  }

};

export default {
  state,
  actions,
  mutations,
  getters
};
