/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-09-08 12:47:17
 * @LastEditTime: 2022-09-08 13:01:08
 * @Description: 组件创建
 */
import Vue from "vue";

Vue.directive("has", {
  inserted: (el, binding, vnode) => {
    console.error(el);
    let isExist = false;
    let btnPermissions = vnode.context.$route.meta.buttonAuth;
    console.log(btnPermissions);
    console.log(btnPermissions && btnPermissions.includes(binding.value));
    if (btnPermissions && btnPermissions.includes(binding.value)) {
      isExist = true;
    }

    if (el.parentNode && !isExist) {
      console.log(333333333);
      el.parentNode.removeChild(el);
      console.log(4444444);
    }
  },
});
