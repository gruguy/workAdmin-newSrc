/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-03 14:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-08 10:52:45
 */
import * as types from "./mutation-types";
import { constantRoutes } from "@/router/router.config";

const mutations = {
  [types.SET_MENUCOLLAPSE]: (state, menuCollapse) => {
    state.menuCollapse = menuCollapse;
  },
  [types.SET_MENULISTSTATE]: (state, newMenuobj) => {
    state.menuListState.push(newMenuobj);
  },
  [types.SET_CURRENTSELECTEDINDEX]: (state, currentSelectedIndex) => {
    state.currentSelectedIndex = currentSelectedIndex;
  },
  set_menu_openkeys(state, openkeys) {
    state.openkeys = openkeys;
  },
  hideAside(state, hideAside) {
    state.hideAside = hideAside;
  },
  showDrawer(state, showDrawer) {
    state.showDrawer = showDrawer;
  },
  setModules(state, modules) {
    state.modules = modules;
  },
  setSidebarRouter(state, routers) {
    state.asyncRouter = routers;
  },
  setButtonAuthList(state, list) {
    state.buttonAuthList = list;
  },
};

export default mutations;
