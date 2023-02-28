<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 21:25:33
 * @LastEditTime: 2022-08-12 16:46:53
 * @Description: 组件创建
-->
<template>
  <div id="breadcrumb" class="breadcrumb-wrapper">
    <!--<div class="flex-left">首页</div>-->
    <div class="pull-left">
      <a-breadcrumb class="app-breadcrumb" separator="/">
        <!-- <transition-group name="breadcrumb"> -->
        <template v-for="(item, index) in breadList">
          <a-breadcrumb-item
            style=""
            v-if="index != 0"
            :index="index"
            :key="item.name"
            :to="{ path: item.path }"
          >
            <span
              v-if="
                item.redirect === 'noRedirect' || index == breadList.length - 1
              "
              class="no-redirect"
              >{{ item.meta.title }}</span
            >
            <a v-else @click.prevent="handleLink(item)">{{
              item.meta.title
            }}</a>
          </a-breadcrumb-item>
        </template>
        <!-- </transition-group> -->
      </a-breadcrumb>
    </div>
    <div class="pull-right">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { Breadcrumb } from "ant-design-vue";
export default {
  components: { ABreadcrumb: Breadcrumb },
  created() {
    this.getBreadCrumb();
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    },
  },
  data() {
    return {
      breadList: [], //面包屑列表
    };
  },
  methods: {
    getBreadCrumb() {
      // this.breadList = this.$route.matched;
      // only show routes with meta.title
      console.log(this.$route);
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      const first = matched[0];

      if (!this.isDashboard(first)) {
        matched = [{ path: "/index", meta: { title: "首页" } }].concat(matched);
      }

      this.breadList = matched.filter((item) => item.meta && item.meta.title);
      console.log(matched);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim() === "Index";
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(path);
    },
  },
  watch: {
    $route() {
      this.getBreadCrumb();
    },
  },
};
</script>
<style lang="scss" type="text/css" scoped>
@import "@/assets/styles/global.scss";
.breadcrumb-wrapper {
  position: fixed;
  left: 223px;
  top: 67px;
  z-index: 99;
  width: calc(100% - 208px);
  display: flex;
  justify-content: space-between;
  margin: -15px -15px 15px -15px;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  text-indent: 20px;
  @include boxShadow;
  .ant-breadcrumb {
    line-height: 50px;
  }
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .pull-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
    ::v-deep .ant-upload.ant-upload-select {
      display: flex;
    }
  }
}
@media screen and(max-width: 1000px) {
  .breadcrumb-wrapper {
    left: 94px;
    width: 100%;
  }
}
@media screen and(max-width: 900px) {
  .breadcrumb-wrapper {
    left: 15px;
    width: 100%;
  }
}
</style>
