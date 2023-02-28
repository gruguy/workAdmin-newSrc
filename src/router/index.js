/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 19:45:56
 * @LastEditTime: 2022-08-21 12:56:08
 * @Description: 组件创建
 */
import Vue from "vue";
import Router from "vue-router";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

import { constantRoutes, dynamicRoutes } from "./router.config";

Vue.use(Router);

export default new Router({
  mode: "hash",
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: constantRoutes,
});
