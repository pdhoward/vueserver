import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

//Vuetify configuration
Vue.use(Vuetify, {
  theme: {
    primary: '#232937',
    secondary: '#282e3c',
    accent: '#303747',
    info: '#323642',
    error: '#ff643d',
  },
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: {
    App,
  },
  router,
  template: '<App/>',
});
