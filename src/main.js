import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.scss'
import TreeTable from 'vue-table-with-tree-grid';

import axios from 'axios';
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
});
Vue.prototype.$http=axios;

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
