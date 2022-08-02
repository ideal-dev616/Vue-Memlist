require('dotenv').config({path: __dirname + '/.env'})

console.log(__dirname);

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/core/services/store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueGoogleMap from 'vuejs-google-maps'
import VueTables2 from 'vue-tables-2';

Vue.use(VueAxios, axios);

if (process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION ENVIRONMENT');
  Vue.axios.defaults.baseURL = '/api/v3';
}
else if (process.env.NODE_ENV === 'development') {
  console.log('LOCAL ENVIRONMENT');
  Vue.axios.defaults.baseURL = 'https://test.memlist.se/api/v3';
}

// Vue.axios.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest'}
Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//Vue.axios.defaults.withCredentials = true;

import '@/core/services/axios.service';

Vue.config.productionTip = false;

// Global 3rd party plugins
import 'popper.js';
import 'tooltip.js';
import PerfectScrollbar from 'perfect-scrollbar';
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from 'clipboard';
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from '@/core/plugins/vue-i18n';
import vuetify from '@/core/plugins/vuetify';
import '@/core/plugins/portal-vue';
import '@/core/plugins/bootstrap-vue';
import '@/core/plugins/perfect-scrollbar';
import '@tinymce/tinymce-vue';

// import '@/core/plugins/highlight-js';
import '@/core/plugins/inline-svg';
// import '@/core/plugins/apexcharts';
// import '@/core/plugins/treeselect';
import '@/core/plugins/metronic';
import '@mdi/font/css/materialdesignicons.css';
import '@/core/plugins/formvalidation';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(Loading);

import DatetimePicker from 'vuetify-datetime-picker'
Vue.use(DatetimePicker);

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

import fullscreen from 'vue-fullscreen';
Vue.use(fullscreen);

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas);
library.add(far);

Vue.component('fa-icon', FontAwesomeIcon);

import { func } from '@/core/services/func.service.js';

Vue.prototype.$func = func;

Vue.use(VueTables2.ClientTable);

Vue.use(VueGoogleMap, {
  load: {
    apiKey: 'AIzaSyBO45yIwbGUaTsuSv9BfKJGY4kmeJTO8vE',
    libraries: []
  }
});

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app');
