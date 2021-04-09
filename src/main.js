import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueAgile from "vue-agile";
import VeeValidate from "vee-validate";
import axios from "axios";
import Croppa from "vue-croppa";
import moment from "moment";
import Helper from "./helpers/index";

// Import  CSS
import "./styles/main.scss";
import 'vue-croppa/dist/vue-croppa.css'

// Global Use
Vue.use(VueAgile);
Vue.use(VeeValidate);
Vue.use(moment);
Vue.use(Croppa, { componentName: 'image-cropper' })       



localStorage.setItem("fullScreen", 0);
const base = axios.create({
  baseURL: "http://127.0.0.1:8000/", 
});


Vue.prototype.$http = base;
Vue.prototype.$helper = Helper;

// base.defaults.headers.common['Authorization'] = "Bearer " +localStorage.getItem("token");
Vue.prototype.$http.interceptors.request.use(
  config => {
      let accessToken = localStorage.getItem('token');
      if (accessToken) {
          config.headers = Object.assign({
              Authorization: `Bearer ${accessToken}`
          }, config.headers);
      }
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
