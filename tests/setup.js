import Vue from "vue";
import axios from "axios";
import Vuetify from "vuetify";
Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
