<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 12:19:45
 * @LastEditTime: 2022-09-08 13:45:35
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="详情"
    placement="right"
    width="600"
    :closable="true"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <div class="content">
      <a-descriptions :title="info.learningTitle" layout="vertical">
        <a-descriptions-item label="发布人"> 系统管理员 </a-descriptions-item>
        <a-descriptions-item label="发布时间">
          {{ info.createdTime }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>
      <a-card title="发布内容" :bordered="false" style="width: 100%">
        <div v-if="info.learningContent" v-html="info.learningContent"></div>
        <a-empty v-else></a-empty>
      </a-card>
    </div>
  </a-drawer>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      info: {},
    };
  },

  components: {},

  computed: {},

  methods: {
    showDetail(data) {
      this.visible = true;
      this.info = data;
    },
    initData() {
      // this.$axios.get("/");
    },
    afterVisibleChange() {},
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20px;
}
.userInfo {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  // justify-content: center;
  .infos {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 18px;
      font-weight: bold;
    }
    .gender {
      font-size: 14px;
      color: #666;
    }
  }
}
::v-deep .ant-card-head {
  padding-left: 0;
}
.imglist {
  display: flex;
  margin: -10px;
  img {
    margin: 10px;
    width: 80px;
    height: 80px;
  }
}
</style>
