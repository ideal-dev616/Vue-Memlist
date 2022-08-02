import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth.module';
import memauth from './client.auth.module';
import htmlClass from './htmlclass.module';
import config from './config.module';
import breadcrumbs from './breadcrumbs.module';
import common from './common.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    memauth,
    htmlClass,
    config,
    breadcrumbs,
    common
  }
});
