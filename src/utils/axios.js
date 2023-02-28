/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 17:01:09
 * @LastEditTime: 2022-08-24 14:09:31
 * @Description: 组件创建
 */
import axios from "axios";
// import qs from "qs";
import Router from "../router";
import store from "../store";

axios.defaults.baseURL = process.env.VUE_APP_API_BASEURL; // /api
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  "content-type": "application/json",
};
// axios.defaults.headers["Authorization"] =
//   sessionStorage.getItem("access_token") || "";
// axios.defaults.transformRequest = [
//   function(data) {
//     return qs.stringify(data);
//   }
// ];
axios.interceptors.request.use(
  (config) => {
    // let token = "";
    // if (sessionStorage.getItem("vuex")) {
    //   token = JSON.parse(sessionStorage.getItem("vuex")).user.token;
    // }
    const token = store.state.user.token;
    console.log(token);
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.defaults.timeout = 36000000; // 设置超时时间

axios.interceptors.response.use(
  (response) => {
    // 检测某种状态进行重定向
    if (response.data.code === 403 || response.data.code === -888) {
      console.log("pppppppppppppppppp");
      console.log(response.data.code);
      console.log(Router);
      // window.location.href = "/user/login";
      Router.push({
        path: "/user/login",
      });
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
