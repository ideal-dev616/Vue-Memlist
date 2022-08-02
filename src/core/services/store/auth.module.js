import Cookies from 'js-cookie';

// action types
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const SET_ACCESS = 'setAccess';
export const SET_TALONGADMIN = 'setTalongAdmin';

// mutation types
export const PURGE_AUTH = 'logOut';
export const SET_AUTH = 'setUser';
export const UPDATE_ACCESS = 'updateAccess';
export const UPDATE_TALONGADMIN = 'updateTalongAdmin';

const userc = Cookies.get('user');
const acl = Cookies.get('acl');
const talongadminc = Cookies.get('talongadmin');

const state = {
  user: 'undefined' === typeof userc ? null : JSON.parse(Cookies.get('user')),
  acl: ('undefined' === typeof acl || acl === undefined || acl === 'undefined') ? null : JSON.parse(Cookies.get('acl')),
  talongadmin: ('undefined' === typeof talongadminc || talongadminc === undefined || talongadminc === 'undefined') ? null : Cookies.get('talongadmin'),
  token: Cookies.get('token')
};

console.log(state.access);

const getters = {
  currentUser: state => state.user,
  currentAccess: state => state.acl,
  isTalongAdmin: state => state.talongadmin === 'Y',
  token: state => state.token,
  isAuthenticated: state => state.user !== null
};

const actions = {
  [SET_TALONGADMIN](context, data) {
    context.commit(UPDATE_TALONGADMIN, data);
  },
  [SET_ACCESS](context, data) {
    context.commit(UPDATE_ACCESS, data);
  },
  [LOGIN](context, data) {
    context.commit(SET_AUTH, data);
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  }
};

const mutations = {
  [UPDATE_TALONGADMIN](state, data) {
    state.talongadmin = data;

    Cookies.set('talongadmin', data);
  },
  [UPDATE_ACCESS](state, data) {
    state.acl = data;

    Cookies.set('acl', JSON.stringify(data));
  },
  [SET_AUTH](state, data) {
    state.user = data.user;
    state.token = data.token;

    var expire = new Date();
    // Add two weeks
    expire.setDate(expire.getDate() + 14);

    Cookies.set('user', JSON.stringify(data.user));
    Cookies.set('token', data.token, { expires: expire });

  },
  [PURGE_AUTH](state) {
    state.user = null;
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('company_id');
    Cookies.remove('period_id');
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
