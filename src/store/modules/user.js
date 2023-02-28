/*
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-02 13:57:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-07 11:05:14
 */
const user = {
  state: {
    username: "",
    token: "",
    roles: [],
  },
  mutations: {
    setUserName(state, user) {
      state.username = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    logout(state) {
      state.username = "";
      state.token = "";
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setOrgId(state, orgId) {
      state.orgId = orgId;
    },
  },
};

export default user;
