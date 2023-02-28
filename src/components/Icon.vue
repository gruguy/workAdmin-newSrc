<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-29 18:30:10
 * @LastEditTime: 2022-05-29 20:07:03
 * @Description: 组件创建
-->
<template>
  <a-popover title="选择图标" trigger="focus" placement="bottomLeft">
    <div slot="content">
      <div class="icons-list">
        <div
          class="icon-wrapper"
          v-for="(item, index) in icons"
          :key="index"
          @click="getIcon(item)"
        >
          <icon-font :type="item.icon" style="font-size: 18px" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <slot></slot>
    <!-- <a-input v-model="icon" readonly>
      <icon-font slot="prefix" :type="item.icon" />
    </a-input> -->
  </a-popover>
</template>

<script>
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3229540_714c54u7stn.js",
});
export default {
  data() {
    return {
      visible: false,
      icons: [
        {
          icon: "icon-person1",
          name: "icon-person1",
        },
        {
          icon: "icon-category",
          name: "icon-category",
        },
        {
          icon: "icon-person1",
          name: "icon-person1",
        },
        {
          icon: "icon-namecard",
          name: "icon-namecard",
        },
        {
          icon: "icon-contract",
          name: "icon-contract",
        },
        {
          icon: "icon-chart",
          name: "icon-chart",
        },
        {
          icon: "icon-settings",
          name: "icon-settings",
        },
        {
          icon: "icon-salary",
          name: "icon-salary",
        },
        {
          icon: "icon-safety",
          name: "icon-safety",
        },
        {
          icon: "icon-computer",
          name: "icon-computer",
        },
        {
          icon: "icon-dayoff",
          name: "icon-dayoff",
        },
        {
          icon: "icon-location",
          name: "icon-location",
        },
        {
          icon: "icon-time",
          name: "icon-time",
        },
        {
          icon: "icon-light-bulb",
          name: "icon-light-bulb",
        },
        {
          icon: "icon-person",
          name: "icon-person",
        },
        {
          icon: "icon-idcard",
          name: "icon-idcard",
        },
        {
          icon: "icon-canlendar",
          name: "icon-canlendar",
        },
      ],
    };
  },

  components: { IconFont },

  computed: {},

  methods: {
    show() {
      this.visible = true;
      console.log(this.visible);
    },
    getIcon(item) {
      this.$emit("sendIcon", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.icons-list {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
}
.icon-wrapper {
  cursor: pointer;
  display: inline-block;
  margin-right: 15px;
  padding: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
}
</style>
