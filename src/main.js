import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueAgile from "vue-agile";
import VeeValidate from "vee-validate";
import axios from "axios";
import Croppa from 'vue-croppa'

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// import { VueEditor } from "vue2-editor";
// import { VueEditor, Quill } from "vue2-editor";

// Import  CSS
import "./styles/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'vue-croppa/dist/vue-croppa.css'

// Global Use
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueAgile);
Vue.use(VeeValidate);
Vue.use(Croppa, { componentName: 'image-cropper' })       

const base = axios.create({
  baseURL: "http://localhost:8000/",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
Vue.prototype.$http = base;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
