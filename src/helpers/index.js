import Vue from "vue";

export default {
  apiGet() {
    // console.log("log API GET");
    let url = "projects?page=1";
    let config = {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    };

    let responseData=[];
    Vue.prototype.$http
      .get(url, config)
      .then((res) => {
        // console.log("From Helper", res);
         responseData.push(res.data);
      })
      .catch((e) => {
        console.log(e);
      });

    return responseData;
  },
};
