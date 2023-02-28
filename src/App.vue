<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-23 16:22:03
 * @LastEditTime: 2022-06-23 15:50:47
 * @Description: 组件创建
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  name: "App",
  data() {
    return {
      locale: zhCN,
    };
  },
  mounted() {
    this.initMenu();
    window.onresize = () => {
      setTimeout(() => {
        return (() => {
          this.initMenu();
        })();
      }, 300);
    };
  },
  methods: {
    initMenu() {
      const currentW = document.body.clientWidth;
      console.info(document.body.clientWidth);
      // 如果宽度小于1000，隐藏左侧菜单
      if (currentW < 1000) {
        this.$store.commit("SET_MENUCOLLAPSE", true);
      }
      if (currentW >= 1000) {
        this.$store.commit("SET_MENUCOLLAPSE", false);
      }
      if (currentW < 900) {
        this.$store.commit("hideAside", true);
        this.$store.commit("showDrawer", true);
      }
      if (currentW >= 900) {
        this.$store.commit("hideAside", false);
        this.$store.commit("showDrawer", false);
      }
    },
  },
};
</script>

<style>
@import "@/assets/styles/iconfont.css";
/* // @import "./assets/styles/global.scss"; */
@import "@/assets/styles/antd.css";
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, #36345c, #37355c);
  /* background-color: #001a29; */
  /* color: #fff; */
}
#app {
  height: 100%;
}
.ant-layout-content {
  overflow: auto;
}

.ant-table-thead > tr > th .ant-table-header-column {
  /* font-weight: bold; */
}
.ant-form-item-label {
  /* font-weight: bold; */
}
</style>
