import AntD from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(AntD);
axios.defaults.baseURL = process.env.NODE_ENV === 'dev' ? 'http://localhost:9090/v1' : 'https://api.sicnurpz.online/v1';
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
