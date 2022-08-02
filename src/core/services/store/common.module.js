import Cookies from 'js-cookie';
// action type
export const SET_USER_ID = 'setUserId';
export const SET_CLIENT_ID = 'setClientId';
export const SET_COMPANY = 'setCompany';
export const SET_COMPANIES = 'setCompanies';
export const SET_PERIOD = 'setPeriod';
export const SET_PERIODS = 'setPeriods';
export const SET_TITLES = 'setTitles';
export const SET_AGE = 'setAge';
export const DELETE_COMPANY = 'deleteCompany';


// mutation types

export const UPDATE_USER_ID = 'updateUserId';
export const UPDATE_CLIENT_ID = 'updateClientId';
export const UPDATE_COMPANY = 'updateCompany';
export const UPDATE_COMPANIES = 'updateCompanies';
export const DELETE_COMPANY_MUTATE = 'deleteCompanyMutate';
export const UPDATE_PERIOD = 'updatePeriod';
export const UPDATE_PERIODS = 'updatePeriods';
export const UPDATE_TITLES = 'updateTitles';
export const UPDATE_AGE = 'updateAge';


const cid = Cookies.get('company_id');
const pid = Cookies.get('period_id');
const uid = Cookies.get('user_id');
const clid = Cookies.get('client_id');
const ccc = localStorage.getItem('companies');

const state = {
  currentClientId: clid ? clid : '',
  currentUserId: uid ? uid : '',
  currentCompanyId: cid ? cid : '',
  currentPeriodId: pid ? pid : '',
  periods: [],
  titles: [],
  companies: ccc ? JSON.parse(ccc) : [],
};

const getters = {
  currentClientId: state => state.currentClientId,
  currentUserId: state => state.currentUserId,
  currentCompanyId: state => state.currentCompanyId,
  currentPeriodId: state => state.currentPeriodId,
  periods: state => state.periods,
  titles: state => state.titles,
  companies: state => state.companies,
  age: state => state.age,
};

const actions = {
  [SET_AGE](state, payload) {
    state.commit(UPDATE_AGE, payload);
  },
  [SET_CLIENT_ID](state, payload) {
    state.commit(UPDATE_CLIENT_ID, payload);
  },
  [SET_USER_ID](state, payload) {
    state.commit(UPDATE_USER_ID, payload);
  },
  [SET_COMPANY](state, payload) {
    state.commit(UPDATE_COMPANY, payload);
  },
  [SET_COMPANIES](state, payload) {
    state.commit(UPDATE_COMPANIES, payload);
  },
  [SET_PERIOD](state, payload) {
    state.commit(UPDATE_PERIOD, payload);
  },
  [SET_PERIODS](state, payload) {
    state.commit(UPDATE_PERIODS, payload);
  },
  [SET_TITLES](state, payload) {
    state.commit(UPDATE_TITLES, payload);
  },
  [DELETE_COMPANY](state, payload) {
    state.commit(DELETE_COMPANY_MUTATE, payload);
  }
};

const mutations = {
  [UPDATE_AGE](state, payload) {
    state.age = payload;
  },
  [UPDATE_CLIENT_ID](state, payload) {
    state.currentClientId = payload;
    Cookies.set('client_id', payload);
  },
  [UPDATE_USER_ID](state, payload) {
    state.currentUserId = payload;
    Cookies.set('user_id', payload);
  },
  [UPDATE_COMPANY](state, payload) {
    state.currentCompanyId = payload;
    Cookies.set('company_id', payload);
  },
  [DELETE_COMPANY_MUTATE](state, payload) {
    var companies = state.companies.filter(item => item.id !== payload);

    state.companies = companies;
    
    localStorage.setitem('companies', JSON.stringify(state.companies));
  },
  [UPDATE_COMPANIES](state, payload) {
    //state.companies = payload;
    var light = [];
    // let arr = [];
    // payload.filter(item => {
    //   const er = item.company.registration.pages;
    //   if (er !== undefined && er.length > 0){
    //     er.filter(i => {
    //       if (i.settings.terms !== undefined && i.settings.terms.length > 0){
    //         arr.push(item.company.company_id)
    //       }
    //     })
    //   }
    // })
    // console.log('Loaded Comapny', arr)
    for (var i = 0; i < payload.length; ++i) {
      light.push({ company_id: payload[i].company.company_id, id: payload[i].company.company_id, name: payload[i].company.name, periods: payload[i].company.periods, titles: payload[i].company.titles, settings: payload[i].company.settings, diag: payload[i].company.diag });

      /*if (payload[i].company.settings !== undefined && payload[i].company.settings.titles !== undefined) {
        console.log('VUEX titles: ');
        console.log(payload[i].company.settings.titles);
      }*/
    }

    light.sort(function(a,b){
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    state.companies = light;
    
    localStorage.setItem('companies', JSON.stringify(light));

    if (Cookies.get('companies') !== undefined) {
      Cookies.remove('companies');
    }
  },
  [UPDATE_PERIOD](state, payload) {
    state.currentPeriodId = payload;
    Cookies.set('period_id', payload);
  },
  [UPDATE_PERIODS](state, payload) {
    state.periods = payload;
  },
  [UPDATE_TITLES](state, payload) {
    state.titles = payload;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
