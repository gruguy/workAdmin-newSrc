<template>
  <a-layout-header
    class="main-head"
    style="background-color: #3479fd; padding: 0; position: sticky"
  >
    <div class="pull-left">
      <a-icon
        color="#fff"
        class="trigger"
        :type="menuCollapse ? 'menu-unfold' : 'menu-fold'"
        @click="menuState"
      />
      <span class="slogan">欢迎进入智能劳务实名制管理系统</span>
    </div>

    <div class="pull-right">
      <span class="username header-item">
        <a-avatar
          :size="30"
          icon="user"
          style="backgroundcolor: rgb(27, 111, 193)"
        />
        <span class="avatarInfo">欢迎你，{{ username }}</span>
      </span>
      <span class="username header-item">
        <a href="#" @click="logout"
          ><a-icon type="poweroff" style="margin-right: 8px" />退出</a
        >
      </span>
    </div>
  </a-layout-header>
</template>

<script>
import { smartMixin } from "@/utils/mixins.js";
export default {
  name: "CommonHeader",
  mixins: [smartMixin],
  props: ["userInfo"],
  data() {
    return {
      collapsed: false,
      count: 5,
      username: this.$store.state.user.username,
      placement: "bottomRight",
    };
  },
  watch: {
    userInfo(newVal) {
      this.userData = newVal;
    },
  },
  mounted() {
    console.log(this.$store.state.user);
  },
  components: {},
  methods: {
    menuState() {
      console.log(this.menuCollapse);
      this.setMenuCollapse(!this.menuCollapse);
      this.collapsed = this.menuCollapse;
      const hideAside = this.$store.state.menu.hideAside;
      if (hideAside) {
        const showDrawer = this.$store.state.menu.showDrawer;
        this.$store.commit("showDrawer", !showDrawer);
      }
    },
    logout() {
      //  清除session localstorage,然后跳转到登录页面
      this.$confirm({
        title: "确认退出?",
        content: "退出后需要再次登录才可进入到页面",
        onOk: () => {
          this.$message.info("退出成功！");
          sessionStorage.clear();
          this.$store.commit("logout");
          this.$router.replace("/user/login?reload=true");
        },
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "@/assets/styles/global.scss";
.logoImg {
  width: 40px;
  border: solid 2px #fff;
  border-radius: 50%;
}
.avatarInfo {
  margin-left: 8px;
  color: #fff;
}
#components-layout-demo-custom-trigger {
  .trigger {
    font-size: 18px;
    line-height: 52px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    height: 100%;
    &:hover {
      color: #1890ff;
    }
  }
  .ant-layout.ant-layout-has-sider {
    height: 100%;
  }
  .ant-layout-sider {
    background-color: #fff;
    @include boxShadow;
    overflow: hidden;
  }
  .menu-wrapper {
    height: calc(100% - 40px);
    margin-right: -18px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .trigger.anticon {
    // margin-left: 256px;
    color: #fff;
    &:hover {
      color: #eee !important;
    }
  }
  .ant-layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 999;
    @include boxShadow;
    .logo {
      transition: all 0.2s ease-in-out;
      .mini-logo {
        display: none;
      }
      &.logo-fold {
        width: 80px;
        .title {
          display: none;
        }
        .mini-logo {
          display: block;
        }
      }
    }
    .logo-fold + .trigger.anticon {
      margin-left: 80px;
    }
  }
}
.pull-right {
  display: flex;
  padding-right: 20px;
  span {
    /*color: #fff;*/
    &.username {
      display: flex;
      align-items: center;

      a {
        color: #fff;
        display: inline-block;
        // line-height: 60px;
        span {
          margin-right: 10px;
          line-height: 60px;
        }
      }
    }
  }
}
.ant-dropdown-menu {
  .ant-dropdown-menu-item {
    line-height: 34px;
    padding: 5px 12px;
  }
}
.header-notice-icon {
  font-size: 18px;
  padding: 4px;
}
.header-item {
  padding: 0 12px;
  display: inline-block;
  height: 100%;
  cursor: pointer;
  vertical-align: middle;
}
.ant-badge-count {
  height: 16px;
  line-height: 16px;
}
.slogan {
  color: #fff;
}
// .main-head {
//   width: calc(100% - 200px);
// }
// @media screen and (max-width: 1000px) {
//   .main-head {
//     width: calc(100% - 80px);
//   }
// }
// @media screen and (max-width: 900px) {
//   .main-head {
//     width: 100%;
//   }
// }
</style>
