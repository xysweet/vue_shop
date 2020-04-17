import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.scss'
import TreeTable from 'vue-table-with-tree-grid';

import Nprogress from "nprogress";
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

import axios from 'axios';
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config=>{
  Nprogress.start();
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
});

axios.interceptors.response.use(config=>{
  Nprogress.done();
  return config;
})
Vue.prototype.$http=axios;

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable);

Vue.filter('dateFormat',function (dateTime) {
const dataT=new Date(dateTime*1000);
const Y=(dataT.getFullYear()+'').padStart(2,'0');
const M=(dataT.getMonth()+1+'').padStart(2,'0');
const D=(dataT.getDay()+'').padStart(2,'0');
const h=(dataT.getHours()+'').padStart(2,'0');
const mm=(dataT.getMinutes()+'').padStart(2,'0');
const ss=(dataT.getSeconds()+'').padStart(2,'0');
return `${Y}-${M}-${D} ${h}-${mm}-${ss}`;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
