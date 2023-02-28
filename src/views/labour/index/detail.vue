<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 10:38:18
 * @LastEditTime: 2022-05-27 10:38:18
 * @Description: 组件创建
-->
<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:45:07
 * @LastEditTime: 2022-05-16 14:45:08
 * @Description: 组件创建
-->
<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:25:30
 * @LastEditTime: 2022-05-16 14:25:30
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="个人信息详情"
    placement="right"
    width="600"
    :closable="true"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <div class="content">
      <div class="userInfo">
        <a-avatar
          shape="square"
          :size="64"
          icon="user"
          :src="info.personalImage"
        />
        <div class="infos">
          <span class="name">{{ info.personalName }}</span>
          <span class="gender">{{
            info.personalSex == "0" ? "男" : "女"
          }}</span>
        </div>
      </div>
      <a-descriptions>
        <a-descriptions-item label="性别">
          {{ info.personalSex == "0" ? "男" : "女" }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ info.personalPhone }}
        </a-descriptions-item>
        <a-descriptions-item label="身份证号">
          {{ info.personalId }}
        </a-descriptions-item>
        <a-descriptions-item label="工种">
          {{ info.workTypeName }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>
      <a-card title="体检报告" :bordered="false" style="width: 100%">
        <template
          v-if="
            info.medicalExaminationRepor && info.medicalExaminationRepor.length
          "
        >
          <div
            class="imglist"
            v-for="(item, index) in info.medicalExaminationRepor.split(',')"
            :key="index"
          >
            <img :src="item" />
          </div>
        </template>
        <div v-else>
          <a-empty></a-empty>
        </div>
      </a-card>
    </div>
  </a-drawer>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      info: {}
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
    }
  }
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
