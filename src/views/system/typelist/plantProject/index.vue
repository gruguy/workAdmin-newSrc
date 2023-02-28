<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <!-- <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      > -->
    </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
      <span class="filter">
        <span class="title">种植类型</span>
        <span class="item-wrapper">
          <span
            :class="['item', currentTypeIndex === index ? 'active' : '']"
            v-for="(item, index) in plantTypeList"
            :key="item.id"
            @click="changeType(index, item.id)"
            >{{ item.plantName }}</span
          >
        </span>
      </span>
    </div>
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.id"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="personalImage" slot-scope="text, record">
          <!-- <img :src="text" class="avatar" /> -->
          <a-avatar shape="square" :size="64" icon="user" :src="text" />
        </template>
        <template slot="clockStateInfo" slot-scope="text">
          <a-tag color="blue" v-if="text == '0'">已入场</a-tag>
          <a-tag color="green" v-if="text == '1'">已结束</a-tag>
        </template>
        <template slot="examineState" slot-scope="text">
          <a-tag color="orange" v-if="text == '0'">待审核</a-tag>
          <a-tag color="green" v-if="text == '1'">已审核</a-tag>
          <a-tag color="red" v-if="text == '2'">已驳回</a-tag>
        </template>
        <template slot="employmentPrice" slot-scope="text">
          <span style="font-weight: bold">￥{{ text }}</span>
        </template>
        <template slot="countPrice" slot-scope="text, record">
          <span
            v-if="Number(text) > Number(record.guidePrice)"
            style="font-weight: bold"
          >
            <a-badge status="processing" color="red" />{{ text }}
          </span>
          <span v-else> <a-badge status="success" />{{ text }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="openDialogAndOrder(record)"> 编辑 </a>
          <a-divider type="vertical"></a-divider>
          <a href="javascript:;" @click="showConfirmDeleteItem(record.id)"
            >删除</a
          >
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
    <detail-view ref="detailView"></detail-view>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import detailView from "./detail.vue";
import { SETPERSONBLACKLIST } from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "项目名称",
    dataIndex: "projectName",
    key: "projectName",
  },
  {
    title: "指导价",
    dataIndex: "guidePrice",
    align: "center",
    // width: "100px",
    key: "guidePrice",
  },
  {
    title: "价格单位",
    dataIndex: "proUnit",
    key: "proUnit",
    // width: "80px",
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    width: "240px",
    fixed: "right",
    align: "center",

    type: "hide",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [smartMixin],
  components: {
    SeniorSearch,
    ModalForm,
    detailView,
    Breadcrumb,
  },
  data() {
    return {
      currentTypeIndex: 0,
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      modalW: "900px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      headers: {
        Authorization: this.$store.state.user.token,
      },
      currentIndex: 0,
      tableData: [],
      loading: false,
      confirmLoading: false,
      formTitle: "",
      flowStatus: 0,
      flowId: "",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      userId: "",
      pagination: {},
      queryParam: {},
      examineTitle: "",
      examineState: "",
      id: "",
      auditingState: "",
      examineVisible: false,
      shwoState: false,
      plantTypeList: [],
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 100,
    };
    this.getDataList();
    this.getPlantTypeList();
  },
  methods: {
    changeType(index, id) {
      this.currentTypeIndex = index;
      this.queryParam.plantType = id;
      this.getDataList();
    },
    getPlantTypeList() {
      this.$axios.get("plantTypeInfoController/getListprams").then((res) => {
        this.plantTypeList = [{ id: "", plantName: "全部" }, ...res.value];
        this.spinning = false;
      });
    },
    openDetail(id) {
      // this.$refs.detailView.showDetail(id);
      this.$router.push(`/sourceInfo/InfoDetailPage/${id}`);
    },

    setState(id, state, num) {
      let msg = "";
      switch (state) {
        case 1:
          // 完成审批
          msg = "完成审批";
          this.shwoState = true;
          break;
        case 2:
          // 拒绝
          msg = "拒绝";
          this.shwoState = false;
          break;
        default:
          msg = "未知错误";
      }
      this.examineTitle = msg;
      this.examineVisible = true;

      setTimeout(() => {
        this.form.setFieldsValue({
          actualMu: num,
        });
      }, 0);
      // console.log(this.form.id);
      this.id = id;
      this.examineState = state;
    },

    handleExamineOk() {
      this.handleSubmit();
    },
    handleSubmit() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this.id, this.examineState, values.actualMu);
          this.updateState(
            this.id,
            this.examineState,
            values.actualMu,
            values.employmentPrice,
            values.auditingExplain
          );
        } else {
          this.confirmLoading = false;
        }
      });
    },
    updateState(id, state, actualMu, employmentPrice, msg) {
      console.info("!err");
      const params = {
        id: id,
        examineState: state,
        actualMu,
        employmentPrice,
        auditingExplain: msg,
        empWorkType: 4,
      };
      console.log(params);
      this.loading = true;
      this.$axios
        .post("/employmentProjectInfoController/update", params)
        .then((res) => {
          let tips = "";
          this.form.resetFields();
          this.loading = false;
          this.confirmLoading = false;
          this.examineVisible = false;
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    handleChange(info) {
      console.log(info);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(info.file.response.value.msg);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败`);
      }
      // this.uploadFile(info.file, info.file.name);
    },
    handleImgOk() {},
    handleImgCancel() {
      this.modalImgVisible = false;
    },
    showImg(url) {
      this.currentImg = url;
      this.modalImgVisible = true;
    },
    addItem(index) {
      this.currentIndex = index;
      this.formItemArr.push({
        prName: "",
        prModel: "",
        prNum: null,
        prUnit: "",
      });
    },
    setQueryParam(values) {
      this.queryParam = {
        ...this.queryParam,
        ...values,
      };
      console.log(this.queryParam);
      this.getDataList();
    },
    removeItem(index) {
      this.formItemArr.splice(index, 1);
    },
    showConfirmDeleteItem(id) {
      this.deleteItem(
        "/employmentProjectInfoController/dels",
        "/employmentProjectInfoController/getAdvancedQuery",
        id
      );
    },
    /**
     * 拉入黑名单
     */
    showConfirmBlackList(id, cid) {
      this.$confirm({
        title: "加入黑名单",
        content: "确认将此人加入黑名单？",
        onOk: () => {
          this.$axios
            .post(SETPERSONBLACKLIST, { id: id, personalId: cid })
            .then((data) => {
              let msg = data.code === 1 ? data.msg : "操作失败";
              this.$message.info(msg);
              this.getDataList();
            });
        },
      });
    },
    openDialogAndOrder(data) {
      // this.modalVisible = true;
      if (data.isTrusted) {
        this.$refs.addForm.openModal();
      } else {
        this.$refs.addForm.openModal(true, data);
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.queryParam = {
        ...this.queryParam,
        // auditingState: 2,
      };
      this.loading = true;
      this.$axios
        .get("/employmentProjectInfoController/getAdvancedQuery", {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.value.rows;
            this.pagination.pageSize = this.queryParam.pageSize;
            const pagination = { ...this.pagination };
            pagination.total = res.value.total;
            this.loading = false;
            this.pagination = pagination;
            console.log(pagination);
          } else {
            this.loading = false;
            this.tableData = null;
          }
        });
    },
    handleTableChange(pagination) {
      this.queryParam.pageNum = pagination.current;
      this.getDataList();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global.scss";
.avatar {
  width: 60px;
  height: 60px;
}
.handleButtons {
  margin: 10px 0 20px;
}
.flow-wrapper {
  margin: 30px 0 0 50px;
}
.addItem {
  overflow: hidden;
  button {
    float: right;
  }
}
.addItems {
  height: 250px;
  overflow: auto;
}
.beBlock {
  overflow: hidden;
}
.deleteItem {
  position: relative;
  overflow: visible;
  button {
    position: absolute;
    right: 10px;
    top: -60px;
  }
}
.filter {
  margin-left: 20px;
  .title {
    padding-right: 10px;
  }
  .item-wrapper {
    .item {
      padding: 4px 12px;
      cursor: pointer;
      background-color: #f0f0f0;
      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &.active {
        background-color: #096dd9;
        color: #fff;
      }
    }
  }
}
</style>
