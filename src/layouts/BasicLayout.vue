<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 21:28:52
 * @LastEditTime: 2022-10-13 14:55:36
 * @Description: 组件创建
-->
<template>
  <a-layout
    id="components-layout-demo-custom-trigger"
    style="height: 100%; min-width: 1000px"
  >
    <a-layout-sider
      v-if="!hideAside"
      width="208px"
      :trigger="null"
      collapsible
      v-model="menuCollapse"
    >
      <div class="logo" :class="menuCollapse ? 'logo-fold' : ''">
        <img class="logoImg" src="@/assets/logo.png" width="60" />
        <span class="title">智能劳务实名制</span>
        <span class="mini-logo"></span>
      </div>
      <!-- 导航列表 -->
      <Smenu :navmenu="menuData"></Smenu>
    </a-layout-sider>
    <a-layout>
      <common-header :userInfo="userInfo"></common-header>
      <a-layout>
        <!-- <breadcrumb></breadcrumb> -->
        <a-layout-content
          :style="{
            margin: '62px 0 12px 12px',
            // paddingTop: '50px',
            minHeight: '280px',
          }"
        >
          <transition name="page-transition">
            <router-view class="view" />
          </transition>
          <!--<slot></slot>-->
        </a-layout-content>
        <a-layout-footer
          style="
            text-align: center;
            box-shadow: 0 0 10px #ccc;
            position: relative;
          "
        >
          技术支持:泽达易盛(天津)科技股份有限公司
        </a-layout-footer>
      </a-layout>
    </a-layout>
    <!-- 宽度小于1000触发 hideAside 隐藏侧边栏 显示抽屉Menu -->
    <a-drawer
      width="208"
      :placement="placement"
      :closable="false"
      :visible="drawerVisible"
      @close="onDrawerClose"
    >
      <div class="logo" :class="menuCollapse ? 'logo-fold' : ''">
        <img class="logoImg" src="@/assets/logo.png" />
        <span class="title">智能劳务实名制</span>
        <span class="mini-logo"></span>
      </div>
      <!-- 导航列表 -->
      <Smenu :navmenu="menuData"></Smenu>
    </a-drawer>
  </a-layout>
</template>
<script>
import Smenu from "@/components/Menu.vue";
import breadcrumb from "@/components/Breadcrumb.vue";
import CommonHeader from "@/components/Header.vue";
import { smartMixin } from "@/utils/mixins.js";

import { setLocalStorage } from "@/utils/localStorage";

export default {
  name: "BasicLayout",
  mixins: [smartMixin],
  updated() {},
  data() {
    return {
      menuData: [],
      userInfo: null,
      // collapsed: false,
      multiTab: false,
      placement: "left",
      // drawerVisible: this.$store.state.menu.hideAside
    };
  },
  computed: {
    drawerVisible() {
      return this.$store.state.menu.showDrawer;
    },
    hideAside() {
      return this.$store.state.menu.hideAside;
    },
  },
  // watch() {
  //   "$store.state.menu.hideAside":{
  //     handler: function(newV){

  //     }
  //   }
  // },
  mounted() {
    this.initMenuCollapse();
    // console.log(this.$router.options.routes);
    // console.log("this.$router.options.routes");
    this.menuData = this.$store.state.menu.asyncRouter;
    console.log(JSON.stringify(this.menuData));
    // this.initInfos();
  },
  components: {
    Smenu,
    breadcrumb,
    CommonHeader,
  },
  methods: {
    onDrawerClose() {
      this.$store.commit("showDrawer", false);
      this.$store.commit("SET_MENUCOLLAPSE", true);
    },
    initMenuCollapse() {
      let localMenuCollapse = this.$store.state.menu.menucollapse;
      this.setMenuCollapse(localMenuCollapse);
    },
    // initInfos() {
    //   this.$axios.get(this.INDEXAPI.USERINFO, {}).then((res) => {
    //     if (res.data.code === 1) {
    //       this.menuData = JSON.parse(res.data.value.menus);
    //       this.userInfo = res.data.value.userInfo;
    //       setLocalStorage("$user", this.userInfo);
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/transition";
@import "@/assets/styles/mixins";
// @import "@/assets/styles/global";
.page-transition-enter {
  opacity: 1;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.ant-layout-content {
  overflow-x: hidden;
}
.ant-layout-sider {
  background-color: #fff;
  @include boxShadow;
}

.logo {
  line-height: 52px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  width: 100%;
  height: 52px;
  // position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  background: #3479fd;
}
.logo {
  // transition: all 0.2s ease-in-out;
  .mini-logo {
    display: none;
  }
  .title {
    margin-left: 10px;
    font-size: 16px;
  }
  &.logo-fold {
    width: 80px;
    .title {
      display: none;
    }
    .mini-logo {
      margin-right: 0;
      display: block;
    }
  }
}
.ant-drawer-body {
  padding: 0;
  .logo {
    width: 100%;
    .title {
      display: inline-block;
    }
  }
}
.ant-avatar {
  background-color: #205fd7;
}
.ant-layout-footer {
  padding: 8px 50px;
}
</style>
