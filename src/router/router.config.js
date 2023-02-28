import { AdminBasicLayout, AdminPageView } from "@/layouts";
import { UserLayout } from "@/layouts/user";
import NotFound from "@/components/NotFound";
import store from "@/store/index.js";
const asyncRouter = store.state.menu.asyncRouter;
console.log("gruguy", asyncRouter);

/**
 * 基础路由
 * @type { *[] }
 */

export const rootRouter = [
  {
    key: "",
    name: "index",
    path: "",
    component: AdminBasicLayout,
    redirect: "/sourceInfo",
    meta: {
      title: "首页",
      icon: "icon-person1",
    },
    children: [],
  },
];

rootRouter.children = asyncRouter;

// rootRouter.push(notFoundRouter);

// export const dynamicRoutes = [
//   {
//     path: "",
//     name: "首页",
//     component: AdminBasicLayout,
//     meta: { title: "首页", icon: "icon-person1" },
//     redirect: "/sourceInfo",
//     children: asyncRouter,
// children: [
//   {
//     path: "/sourceInfo",
//     name: "实名登记管理",
//     redirect: "/sourceInfo/index",
//     component: AdminPageView,
//     meta: { icon: "icon-person1", key: 1, title: "实名登记管理" },
//     children: [
//       {
//         path: "/sourceInfo/index",
//         name: "个人信息列表",
//         meta: { icon: "icon-cubelifangti", title: "个人信息列表" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/sourceInfo/index/index"
//           ),
//       },
//       {
//         path: "/sourceInfo/InfoDetailPage/:id",
//         name: "InfoDetailPage",
//         meta: {
//           icon: "icon-cubelifangti",
//           title: "个人信息详情",
//           hidden: true,
//         },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/sourceInfo/index/pageDetail"
//           ),
//       },
//       {
//         path: "/sourceInfo/workType",
//         name: "工种管理",
//         meta: { icon: "icon-cubelifangti", title: "工种管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/sourceInfo/workType/index"
//           ),
//       },
//       {
//         path: "/sourceInfo/badRecord",
//         name: "不良记录登记",
//         meta: { icon: "icon-cubelifangti", title: "不良记录登记" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/badRecord/index"
//           ),
//       },
//     ],
//   },
//   {
//     path: "/report",
//     name: "报表管理",
//     meta: { icon: "icon-chart", title: "报表管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/report/attendance",
//         name: "小时工考勤统计",
//         meta: { icon: "icon-cubelifangti", title: "小时工考勤统计" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/report/attendance"
//           ),
//       },
//       {
//         path: "/report/dayworker",
//         name: "天工考勤统计",
//         meta: { icon: "icon-cubelifangti", title: "天考勤统计" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/report/dayworker"
//           ),
//       },
//       {
//         path: "/report/monthWorker",
//         name: "月考勤统计",
//         meta: { icon: "icon-cubelifangti", title: "月考勤统计" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/report/monthWorker"
//           ),
//       },
//       // {
//       //   path: "/report/salary",
//       //   name: "薪酬发放情况表",
//       //   meta: { icon: "icon-cubelifangti", title: "薪酬发放情况表" },
//       //   component: () =>
//       //     import(
//       //       /* webpackChunkName: "appAssets" */ "@/views/report/salary"
//       //     ),
//       // },
//     ],
//   },
//   {
//     path: "/useExam",
//     name: "用工管理",
//     meta: { icon: "icon-idcard", title: "用工管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/useExam/apply",
//         name: "用工申请列表",
//         meta: { icon: "icon-cubelifangti", title: "用工申请列表" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/useExam/apply/index"
//           ),
//       },
//       {
//         path: "/useExam/index",
//         name: "用工审批列表",
//         meta: { icon: "icon-cubelifangti", title: "用工审批列表" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/useExam/index/index"
//           ),
//       },
//       // {
//       //   path: "/useExam/apply",
//       //   name: "用工申请列表",
//       //   meta: { icon: "icon-cubelifangti" },
//       //   component: () =>
//       //     import(
//       //       /* webpackChunkName: "appAssets" */ "@/views/useExam/apply"
//       //     )
//       // },
//       {
//         path: "/useExam/history",
//         name: "用工审批历史列表",
//         meta: { icon: "icon-cubelifangti", title: "用工审批历史列表" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/useExam/history"
//           ),
//       },
//     ],
//   },
//   {
//     path: "/contract",
//     name: "合同管理",
//     meta: { icon: "icon-contract_pending_line", title: "合同管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/contract/index",
//         name: "合同模板管理",
//         meta: { icon: "icon-cubelifangti", title: "合同模板管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/contract/index"
//           ),
//       },
//     ],
//   },
//   {
//     path: "/pay",
//     name: "薪酬管理",
//     meta: { icon: "icon-Salarymanagement", title: "薪酬管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/pay/check",
//         name: "考勤记录",
//         meta: { icon: "icon-cubelifangti", title: "考勤记录" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/pay/check/index"
//           ),
//       },

//       {
//         path: "/pay/index",
//         name: "薪酬发放",
//         meta: { icon: "icon-cubelifangti", title: "薪酬发放" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/pay/index/index"
//           ),
//       },
//     ],
//   },
//   {
//     path: "/farmtools",
//     name: "农具使用",
//     meta: { icon: "icon-Salarymanagement", title: "农具使用" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/farmtools/dryRicePrice",
//         name: "水稻旱直播稻价格",
//         meta: { icon: "icon-cubelifangti", title: "水稻旱直播稻价格" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/farmtools/dryRicePrice/index"
//           ),
//       },
//       {
//         path: "/farmtools/waterMachinePrice",
//         name: "水稻机插秧价格",
//         meta: { icon: "icon-cubelifangti", title: "水稻机插秧价格" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/farmtools/waterMachinePrice/index"
//           ),
//       },
//       {
//         path: "/farmtools/waterRicePrice",
//         name: "水稻水直播",
//         meta: { icon: "icon-cubelifangti", title: "水稻水直播价格" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/farmtools/waterRicePrice/index"
//           ),
//       },
//       {
//         path: "/farmtools/wheatPrice",
//         name: "三麦价格",
//         meta: { icon: "icon-cubelifangti", title: "三麦价格" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/farmtools/wheatPrice/index"
//           ),
//       },
//       {
//         path: "/farmtools/useList",
//         name: "使用情况",
//         meta: { icon: "icon-cubelifangti", title: "使用情况" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/farmtools/uselist/index"
//           ),
//       },
//     ],
//   },
//   {
//     path: "/safeEducation",
//     name: "安全教育管理",
//     meta: { icon: "icon-safety", title: "安全教育管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/safeEducation/knowlegeType",
//         name: "知识分类",
//         meta: { icon: "icon-cubelifangti", title: "知识分类" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/safeEducation/knowlegeType"
//           ),
//       },
//       {
//         path: "/safeEducation/baseKnowlege",
//         name: "基础知识",
//         meta: {
//           icon: "icon-cubelifangti",
//           hidden: true,
//           title: "基础知识",
//         },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/safeEducation/baseKnowlege"
//           ),
//       },

//       {
//         path: "/safeEducation/itemPool",
//         name: "题库管理",
//         meta: { icon: "icon-cubelifangti", title: "题库管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/safeEducation/itemPool"
//           ),
//       },
//       {
//         path: "/safeEducation/onlineLearning",
//         name: "在线学习",
//         meta: { icon: "icon-cubelifangti", title: "在线学习" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/safeEducation/onlineLearning"
//           ),
//       },
//       {
//         path: "/safeEducation/onelineTesting",
//         name: "在线学习记录",
//         meta: { icon: "icon-cubelifangti", title: "在线学习记录" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/safeEducation/onlineTesting"
//           ),
//       },
//       // {
//       //   path: "/safeEducation/testRecord",
//       //   name: "考试记录",
//       //   meta: { icon: "icon-cubelifangti", title: "考试记录" },
//       //   component: () =>
//       //     import(
//       //       /* webpackChunkName: "appAssets" */ "@/views/safeEducation/testRecord"
//       //     ),
//       // },
//     ],
//   },
//   {
//     path: "/system",
//     name: "系统管理",
//     meta: { icon: "icon-settings", title: "系统管理" },
//     component: AdminPageView,
//     children: [
//       {
//         path: "/system/params",
//         name: "参数设置",
//         meta: { icon: "icon-cubelifangti", title: "参数设置" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/params"
//           ),
//       },
//       {
//         path: "/system/price",
//         name: "价格设置",
//         meta: { icon: "icon-cubelifangti", title: "价格设置" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/priceManage"
//           ),
//       },
//       {
//         path: "/system/adminPrice",
//         name: "管理员价格设置",
//         meta: { icon: "icon-cubelifangti", title: "管理员价格设置" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/adminPriceManage"
//           ),
//       },
//       {
//         path: "/system/organization",
//         name: "机构管理",
//         meta: { icon: "icon-cubelifangti", title: "机构管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/organization"
//           ),
//       },
//       {
//         path: "/system/users",
//         name: "用户管理",
//         meta: { icon: "icon-cubelifangti", title: "用户管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/users/main"
//           ),
//       },

//       {
//         path: "/system/modules",
//         name: "菜单管理",
//         meta: { icon: "icon-cubelifangti", title: "菜单管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/modules"
//           ),
//       },
//       {
//         path: "/system/roles",
//         name: "角色管理",
//         meta: { icon: "icon-cubelifangti", title: "角色管理" },
//         component: () =>
//           import(
//             /* webpackChunkName: "appAssets" */ "@/views/system/roles"
//           ),
//       },
//     ],
//   },
// ],
//   },
// ];
// console.log("asyncRouterMap", asyncRouterMap);

// 公共路由
export const constantRoutes = [
  {
    path: "/user",
    name: "登录",
    component: UserLayout,
    hidden: true,
    redirect: "/user/login",
    children: [
      {
        path: "/user/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/User/Login"),
      },
    ],
  },
  {
    path: "/404",
    component: NotFound,
    hidden: true,
  },
];
