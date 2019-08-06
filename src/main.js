import {
  Button, Icon, Input, InputNumber, Row, BackTop,
  Radio, Select, Card, Tabs, Alert, message,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Button);
Vue.use(BackTop);
Vue.use(Icon);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Card);
Vue.use(Tabs);
Vue.use(Alert);
Vue.use(Row);

// axios.defaults.baseURL = 'http://localhost:9090/v1';
axios.defaults.baseURL = 'https://api.sicnurpz.online/v1';
Vue.prototype.$http = axios;
Vue.prototype.$message = message;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
