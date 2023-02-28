<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container">
      <div class="top">
        <div class="desc">
          <img
            src="~@/assets/logo.png"
            width="100"
            height="100"
            alt="logo"
            style="margin-right: 20px"
          />智能劳务实名制管理系统
        </div>
        <small style="padding-left: 80px; display: block; margin-top: -40px"
          >Intelligent real name service management system</small
        >
      </div>

      <router-view></router-view>

      <div class="footer">
        <div class="copyright">
          <!-- Copyright &copy; 2018 杭州睿声技术信息有限公司 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserLayout",
  data() {
    return {};
  },
  mounted() {
    document.body.classList.add("userLayout");
  },
  beforeDestroy() {
    document.body.classList.remove("userLayout");
  },
};
</script>

<style lang="scss" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  .container {
    width: 100%;
    min-height: 100%;
    background: #3f4972 url("@/assets/images/bg2.jpg") no-repeat 50%;
    background-size: cover;
    padding: 110px 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 32px;
        color: #fff;
        margin-top: 12px;
        margin-bottom: 10px;
      }
      small {
        color: #878ea7;
        font-size: 14px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;
      .copyright {
        color: rgba(255, 255, 255, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>
