/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-23 16:22:03
 * @LastEditTime: 2022-09-08 12:52:19
 * @Description: 组件创建
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import antd from "ant-design-vue";
import { ConfigProvider } from "ant-design-vue";
// import './mock'
// import VueAwesomeSwiper from "vue-awesome-swiper";
// require styles
// import "swiper/dist/css/swiper.css";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./router/permission";
import axios from "./utils/axios";
// import globalAdmin from './components/API'
import vuescroll from "vuescroll/dist/vuescroll-native";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import "./utils/directives";
Vue.use(VueViewer);
// import echarts from "echarts";
// import "vuescroll/dist/vuescroll.css";
// import animate from "animate.css";
// Vue.use(animate);

Vue.use(vuescroll);
Vue.use(antd);
// Vue.use(VueAwesomeSwiper);
Vue.use(ConfigProvider);
// Vue.use(AMap);

// Vue.prototype.ADMINAPI = globalAdmin // 挂载到Vue实例上面

// Vue.prototype.$echarts = echarts;

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
