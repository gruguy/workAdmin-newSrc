/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 19:45:56
 * @LastEditTime: 2022-08-17 14:27:36
 * @Description: 组件创建
 */
import * as types from "./mutation-types";
import { AdminBasicLayout, AdminPageView } from "@/layouts";
import { constantRoutes } from "../router/router.config";
import router from "../router";
// const modulesImport = import.meta.glob("../views/**/**.vue");

const actions = {
  setMenuCollapse: ({ commit }, menuCollapse) => {
    return commit(types.SET_MENUCOLLAPSE, menuCollapse);
  },
  setMenuListState: ({ commit }, menuListState) => {
    return commit(types.SET_MENULISTSTATE, menuListState);
  },
  setCurrentSelectedIndex: ({ commit }, currentSelectedIndex) => {
    return commit(types.SET_CURRENTSELECTEDINDEX, currentSelectedIndex);
  },
  setSidebarRouter({ commit }, modules) {
    // state.asyncRouter = transformModulesToMenu(arr, modules);
    const arr = [];
    return new Promise((resolve) => {
      const routers = transformModulesToMenu(arr, modules);
      router.addRoutes(routers);
      constantRoutes[0].children = constantRoutes[0].children.concat(routers);
      commit("setSidebarRouter", constantRoutes);
      resolve(constantRoutes);
    });
    // return commit(types.SET_CURRENTSELECTEDINDEX, currentSelectedIndex);
  },
};

function transformModulesToMenu(menu, module) {
  module
    .filter((item) => item.moduleUrl != "index")
    .forEach((item, index) => {
      const route = {
        name: item.moduleName,
        path: "/" + item.moduleUrl,
        component: item.functionType == 1 ? AdminBasicLayout : item.modulePath,
        hidden: item.moduleShow == 0 ? true : false,
        meta: {
          title: item.moduleName,
          icon: item.moduleIcon,
          hidden: item.moduleShow == 0 ? true : false,
        },
      };

      // console.log(modulesImport);
      console.log(item);
      // if (item.moduleUrl != "index") {
      menu.push(route);
      console.log(router.getRoutes());
      if (item.children && item.children.length) {
        menu[index].children = [];
        transformModulesToMenu(menu[index].children, item.children);
      } else {
        delete item["children"];
        delete item["redirect"];
      }
      // }
    });

  router.addRoute({ path: "*", redirect: "/404", hidden: true });
  console.log("--------+++++++++++++");
  console.log(menu);
  return menu;
}

export default actions;
