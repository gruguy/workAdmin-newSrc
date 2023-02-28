/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-02-28 10:46:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-24 13:50:41
 */
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"; //持久化

import menu from "./modules/menu";
import user from "./modules/user";
import getters from "./getters";
import actions from "./actions";
// import mutations from './mutations'

Vue.use(Vuex);

export default new Vuex.Store({
  debug: true,
  modules: {
    menu,
    user,
  },
  getters,
  actions,
  // mutations
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
