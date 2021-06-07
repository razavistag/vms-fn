import Vue from "vue";
import VueRouter from "vue-router";
import router from "../router/index";
const CryptoJS = require("crypto-js");
Vue.use(VueRouter);
export default {
  enc_dec_key: "vms-key-code",
  projectURL: {
    store: "projects/",
  },

  Unauthorized(status) {
    if (status === 401) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    }
    return status;
  },

  EncKey(value) {
    let data = CryptoJS.AES.encrypt(value, this.enc_dec_key).toString();
    return data;
  },
  DecKey(value) {
    var bytes = CryptoJS.AES.decrypt(value, this.enc_dec_key);
    var data = bytes.toString(CryptoJS.enc.Utf8);
    return data;
  },

  AccessCheck(i) {
    try {
      let DecKey = this.DecKey(localStorage.getItem("token_access"));
      let access = JSON.parse(DecKey);

      if (i == "project") {
        if (access[1] != 0) {
          return 1;
        } else {
          return 0;
        }
      }

      if (i == "systems") {
        if (access[2] != 0) {
          return 1;
        } else {
          return 0;
        }
      }

      if (i == "tasks") {
        if (access[3] != 0) {
          return 1;
        } else {
          return 0;
        }
      }

      if (i == "users") {
        if (access[4] != 0) {
          return 1;
        } else {
          return 0;
        }
      }

      if (i == "po") {
        if (access[5] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
      if (i == "order") {
        if (access[6] != 0) {
          return 1;
        } else {
          return 0;
        }
      }

      if (i == "account") {
        if (access[7] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
      if (i == "holiday") {
        if (access[8] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
      if (i == "location") {
        if (access[9] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
      if (i == "recurring") {
        if (access[10] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
      if (i == "item") {
        if (access[11] != 0) {
          return 1;
        } else {
          return 0;
        }
      }
    } catch (e) {
      // console.log(0)
    }
  },

  ///* Safari *//* IE11 *//* Chrome */
  onFullscreenDataTable(elem) {
    var elem = document.getElementById(elem);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      return true;
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      return true;
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      return true;
    }
  },
  onExitFullScreenDataTable() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      return true;
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      return true;
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      return true;
    }
  },
};
