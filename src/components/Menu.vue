<template>
  <div class="menu-wrapper">
    <!-- <vue-scroll :ops="ops"> -->
    <a-menu
      theme="light"
      mode="inline"
      forceSubMenuRender
      :inlineCollapsed="collapse"
      :defaultSelectedKeys="[$route.path]"
      :open-keys="openkeys"
      @openChange="onOpenChange"
    >
      <MenuItem
        v-if="!item.hidden"
        v-for="(item, index) in navmenu"
        :item="item"
        :key="item.url"
        :openChangeSub="openChangeSub"
      ></MenuItem>
    </a-menu>
    <!-- </vue-scroll> -->
  </div>
</template>
<script>
import { smartMixin } from "@/utils/mixins";
import MenuItem from "./MenuItem.vue";

import { Icon } from "ant-design-vue";
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: "https://at.alicdn.com/t/font_3229540_714c54u7stn.js", // 在 iconfont.cn 上生成
});
export default {
  mixins: [smartMixin],
  name: "Smenu",
  props: ["navmenu"],
  data() {
    return {
      navList: [],
      currentIndex: "",
      currentOpenKey: 0,
      openkeys: [],
      rootSubmenuKeys: [],
      collapse: false,
      ops: {
        vuescroll: {},
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
        rail: {},
        bar: {
          background: "#60b0fa",
        },
      },
    };
  },
  components: {
    MenuItem,
    MyIcon,
  },
  created() {
    // this.navList = this.$store.state.menu.asyncRouter.find(
    //   (item) => item.path === "/"
    // ).children;
    // this.navList = this.$router.options.routes.find((item) => item.path === "").children;
  },
  beforeCreate() {
    this.collapse = this.$store.state.menu.menuCollapse;
    console.log(this.collapse);
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.navmenu);
      this.saveAllMenuKeys(this.navmenu);
      this.openkeys = ["/" + this.$route.path.split("/")[1]];
      if (this.rootSubmenuKeys.indexOf(this.$route.path) === -1) {
        this.openkeys = [this.$route.path];
        this.$store.commit("set_menu_openkeys", [this.$route.path]);
      }
    });
  },
  methods: {
    saveAllMenuKeys(menu) {
      menu.forEach((item, index) => {
        this.rootSubmenuKeys.push(item.path);
        if (item.children && item.children.length) {
          this.saveAllMenuKeys(item.children);
        }
      });
    },
    openChangeSub(key) {
      this.currentOpenKey = key;
      // console.log(key);
      this.openKeys = key;
      // this.$store.commit("set_menu_openkeys", key);
    },
    onOpenChange(openkeys) {
      console.log(openkeys);
      const latestOpenKey = openkeys.find(
        (key) => this.openkeys.indexOf(key) === -1
      );
      console.log("latestOpenKey");
      console.log(latestOpenKey);
      console.log(this.rootSubmenuKeys.indexOf(latestOpenKey) === -1);
      this.openkeys = openkeys;
      // if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      //   this.openkeys = openkeys;
      // } else {
      //   this.openkeys = latestOpenKey ? [latestOpenKey] : [];
      // }
      console.log("this.openkeys", this.openkeys);
      this.$store.commit("set_menu_openkeys", this.openkeys);
    },
  },
  watch: {
    $route() {
      console.log(this.$route.path);
    },
  },
};
</script>
<style lang="scss">
.menu-wrapper {
  height: 100%;
}
.ant-menu-item {
  margin-top: 0;
}
.function-link input {
  border: none !important;
  box-shadow: none;
  height: 50px;
  border-radius: 0;
  text-indent: 15px;
  &:active {
    outline: 0;
    box-shadow: none;
  }
}
.ant-menu-inline {
  border-right: none;
}
.searchInputVisible {
  display: none;
}
::v-deep .ant-menu-item {
  span {
    display: inline-block;
  }
}
</style>
