/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-03 14:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-08 10:52:54
 */
import mutations from "../mutations";
const menu = {
  state: {
    menuCollapse: false,
    openkeys: [],
    menuListState: [{ name: "首页", path: "/" }],
    currentSelectedIndex: 0,
    hideAside: false,
    showDrawer: false,
    modules: [],
    asyncRouter: [],
    buttonAuthList: [],
  },
  mutations: mutations,
};

export default menu;
