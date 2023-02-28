<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:25:30
 * @LastEditTime: 2022-05-30 15:35:48
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="薪资发放列表"
    placement="right"
    width="800"
    :closable="true"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <div class="content">
      <Canlendar ref="canlendar" :key="componentKey" />
    </div>
  </a-drawer>
</template>

<script>
import Canlendar from "@/components/Calendar";
export default {
  data() {
    return {
      componentKey: 0,
      visible: false,
      personalId: "",
    };
  },

  components: { Canlendar },

  computed: {},

  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
    };
    // this.getDataList();
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    showDetail(id) {
      this.visible = true;
      this.componentKey += 1;
      this.$nextTick(() => {
        this.$refs.canlendar.loadData(id);
      });
    },
    afterVisibleChange() {},
    onClose() {
      this.visible = false;
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    handleTableChange(pagination) {
      this.queryParam.pageNum = pagination.current;
      this.getDataList();
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
