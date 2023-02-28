<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-09-15 12:07:29
 * @LastEditTime: 2022-09-16 14:06:01
 * @Description: 组件创建
 * 使用函数式组件
-->
<template functional>
  <a-menu-item
    :key="props.item.path"
    v-if="
      !props.item.meta.hide &&
      (!props.item.children || props.item.children[0].meta.type === '3')
    "
  >
    <template class="submenu-title"
      ><MyIcon
        :type="props.item.meta.icon"
        style="font-size: 18px"
        v-if="props.item.meta.icon"
      />
      <span>{{ props.item.meta.title }}</span>
    </template>
    <router-link :to="{ path: props.item.path }">{{
      props.item.meta.title
    }}</router-link>
  </a-menu-item>
  <a-sub-menu :key="props.item.path" v-else-if="!props.item.meta.hide">
    <span slot="title">
      <template v-if="props.item.meta.icon">
        <MyIcon :type="props.item.meta.icon" style="font-size: 18px" />
      </template>
      <span class="submenu-title">{{ props.item.meta.title }}</span>
    </span>
    <MenuItem
      :item="it"
      v-for="it in props.item.children"
      :key="it.path"
    ></MenuItem>
  </a-sub-menu>
</template>

<script>
import { Icon } from "ant-design-vue";
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: "https://at.alicdn.com/t/font_3229540_714c54u7stn.js", // 在 iconfont.cn 上生成
});
export default {
  name: "MenuItem",

  props: ["item"],

  components: {
    MyIcon,
  },
  methods: {
    openChangeSub(key) {
      this.$parent.currentOpenKey = key;
      this.$parent.openKeys = key;
    },
  },
};
</script>

<style lang="scss">
.submenu-title {
  display: inline-block;
}
</style>
