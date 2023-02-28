/*
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 19:45:56
 * @LastEditTime: 2022-09-08 12:44:27
 * @Description: 组件创建
 */
import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "@/router";
import store from "@/store";
import { AdminPageView, AdminBasicLayout } from "@/layouts";

Vue.use(VueRouter);

function transformModulesToMenu(menu, module, buttonAuthList) {
  module.forEach((item, index) => {
    console.log(item.functionType);
    if (item.functionType == 3) {
      buttonAuthList.push(item.moduleUid);
    }
    menu.push({
      name: item.moduleName,
      path: "/" + item.moduleUrl,
      component:
        item.functionType == 1
          ? AdminPageView
          : () => import(`@/views/${item.modulePath}`),
      meta: {
        icon: item.moduleIcon,
        hide: item.moduleShow == 0 ? true : false,
        title: item.moduleName,
        type: item.functionType,
        buttonAuth: [],
      },
      // children: [],
    });
    // console.log(item.children);
    // console.log("item.children");
    if (item.children && item.children.length) {
      if (item.children[0].functionType == "3") {
        item.children.forEach((it) => {
          menu[index].meta.buttonAuth.push(it.moduleUid);
          // buttonAuthList.push(it.moduleUid);
        });
      } else {
        menu[index].children = [];
        transformModulesToMenu(
          menu[index].children,
          item.children,
          buttonAuthList
        );
        menu[index].redirect = menu[index].children[0].path;
        console.log("menu[index]", menu[index]);
      }
    } else {
      delete item["children"];
      delete item["redirect"];
    }
  });
  console.log(menu);
  return menu;
}

NProgress.configure({ ease: "ease", speed: 500 });
const whiteList = ["/user/login"];
router.beforeEach((to, from, next) => {
  NProgress.start();
  let token = store.state.user.token;
  // 判断当前的token是否存在
  if (token) {
    if (to.path === "/user/login") {
      next({ path: "" });
      // next();
      NProgress.done();
    } else {
      // 初始化菜单
      let arr = [];
      // 按钮权限
      const buttonAuthList = [];
      const modules = store.state.menu.modules;
      const asyncRouter = transformModulesToMenu(arr, modules, buttonAuthList);
      // asyncRouter.forEach((router) => {
      //   console.log(router.component);
      //   console.log("--------------------");
      // });
      store.commit("setSidebarRouter", asyncRouter);
      store.commit("setButtonAuthList", buttonAuthList);
      console.log(router);
      const notFoundRouter = {
        path: "*",
        redirect: "/404",
        hidden: true,
      };
      if (router.getRoutes().length < 5) {
        const routers = [
          {
            path: "",
            name: "首页",
            component: AdminBasicLayout,
            meta: { title: "首页", icon: "icon-person1" },
            redirect: "/sourceInfo",
            children: asyncRouter,
          },
        ];
        routers.push(notFoundRouter);
        router.addRoutes(routers);
        console.log(router);
        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
      } else {
        console.log(router.getRoutes());
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      // 白名单直接进入
      next();
    } else {
      next(`/user/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
