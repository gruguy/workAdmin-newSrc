<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 21:40:22
 * @LastEditTime: 2022-05-27 22:41:42
 * @Description: 组件创建
-->
<template>
  <div class="loading" v-if="visible">
    <a-icon type="loading" style="font-size: 30px" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
    };
  },

  components: {},

  computed: {},

  methods: {
    hideLoading() {
      this.visible = false;
    },
    showLoading() {
      this.visible = true;
    },
  },
};
</script>
<style lang="css" scoped>
.loading {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
