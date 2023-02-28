<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-06-03 16:12:50
 * @LastEditTime: 2022-08-21 14:02:50
 * @Description: 组件创建
-->
<template>
  <div class="notFound">
    <img src="../assets/images/404.svg" />
    <p>没有找到内容，<a href="/">跳转到首页</a></p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {},
};
</script>
<style lang="scss" scoped>
.notFound {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    width: 300px;
    height: auto;
  }
  p {
    margin-top: 30px;
  }
}
</style>
