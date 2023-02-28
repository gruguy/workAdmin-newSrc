<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <!-- <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
      <a-upload
        name="file"
        action="/api/uploadController/importExcel"
        :headers="headers"
        :multiple="true"
        accept=".xlsx,.xls"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-button type="primary"><a-icon type="arrow-down" />模板下载</a-button>
      </a-upload>
      <a-upload
        name="file"
        action="/api/uploadController/importExcel"
        :headers="headers"
        :multiple="true"
        accept=".xlsx,.xls"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-button type="primary"
          ><a-icon type="arrow-up" />批量导入人员</a-button
        >
      </a-upload> -->
    </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
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
        :scroll="{ x: 1300 }"
      >
        <template slot="clockState" slot-scope="text">
          <a-tag color="orange" v-if="text == '0'">进行中</a-tag>
          <a-tag color="blue" v-if="text == '1'">待结算审核</a-tag>
          <a-tag color="green" v-if="text == '2'">已完成</a-tag>
        </template>
        <template slot="totalExpense" slot-scope="text">
          <span style="font-weight: bold">￥{{ text }}</span>
        </template>

        <template slot="examineState" slot-scope="text">
          <a-tag color="orange" v-if="text == '0'">待审核</a-tag>
          <a-tag color="green" v-if="text == '1'">已审核</a-tag>
          <a-tag color="red" v-if="text == '2'">已驳回</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <!--
          <a-divider type="vertical"></a-divider>
          <a @click="openDialogAndOrder(record)"> 驳回 </a>
          <a v-if="record.auditingState == 0" @click="setState(record.id, 1)">
            确认审批
            <a-divider type="vertical"></a-divider>
          </a> -->
          <template v-if="record.clockState == 1 && record.examineState == 0">
            <span v-has="'pass'">
              <a @click="setState(record.id, 1, 2)"> 通过 </a>
              <a-divider type="vertical"></a-divider>
            </span>
            <!-- <span v-has="'reject'">
              <a @click="setState(record.id, 2)"> 拒绝 </a>
              <a-divider type="vertical"></a-divider>
            </span> -->
          </template>
          <span v-has="'detail'">
            <a href="javascript:;" @click="openDetail(record)">详情</a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a-dropdown v-has="'delete'">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <!-- <a-menu-item>
                <a href="javascript:;" @click="openDetail(record.id)">详情</a>
              </a-menu-item> -->

              <a-menu-item>
                <a href="javascript:;" @click="showConfirmDeleteItem(record.id)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
    <detail-view ref="detailView"></detail-view>

    <a-modal
      v-model="examineVisible"
      :title="examineTitle"
      :confirmLoading="confirmLoading"
      @ok="handleExamineOk"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item
          :label-col="formLayout.labelCol"
          :wrapper-col="formLayout.wrapperCol"
          label="审批意见"
        >
          <a-input v-decorator="['auditingExplain']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import detailView from "./detail.vue";
import {
  PERSONALINFOLIST,
  PERSONALINFOADD,
  PERSONALINFOUPDATE,
  PERSONALINFODEL,
  SETPERSONBLACKLIST,
} from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "项目经理",
    dataIndex: "projectManagerName",
    align: "center",
    width: "120px",
    key: "projectManagerName",
    scopedSlots: { customRender: "projectManagerName" },
  },
  {
    title: "用工申请",
    dataIndex: "appName",
    width: "180px",
    key: "appName",
  },

  {
    title: "用工项目",
    dataIndex: "empProjectName",
    width: "180px",
    key: "empProjectName",
  },
  {
    title: "项目状态",
    dataIndex: "clockState",
    width: "120px",
    align: "center",
    key: "clockState",
    scopedSlots: { customRender: "clockState" },
  },
  {
    title: "审核状态",
    dataIndex: "examineState",
    width: "120px",
    align: "center",
    key: "examineState",
    scopedSlots: { customRender: "examineState" },
  },
  {
    title: "人数",
    dataIndex: "headNumber",
    key: "headNumber",
    width: "80px",
    align: "center",
  },
  {
    title: "人头费",
    dataIndex: "headExpense",
    width: "120px",
    align: "center",
    key: "headExpense",
  },
  {
    title: "人员产出费",
    dataIndex: "producePriceCount",
    width: "120px",
    align: "center",
    key: "producePriceCount",
  },
  {
    title: "交通费",
    dataIndex: "trafficExpense",
    width: "120px",
    align: "center",
    key: "trafficExpense",
  },
  {
    title: "总费用",
    dataIndex: "totalExpense",
    width: "120px",
    align: "center",
    key: "totalExpense",
    scopedSlots: { customRender: "totalExpense" },
  },
  {
    title: "上班打卡",
    dataIndex: "clockStartTime",
    width: "180px",
    key: "clockStartTime",
  },
  {
    title: "下班打卡",
    dataIndex: "clockEndTime",
    width: "180px",
    key: "clockEndTime",
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
      id: "",
      auditingState: "",
      examineState: "",
      examineVisible: false,
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
    };
    this.getDataList();
  },
  methods: {
    openDetail(data) {
      this.$refs.detailView.showDetail(data);
      // this.$router.push(`/projectManage/infoDetailPage/${id}`);
    },

    setState(id, state, clockState) {
      let msg = "";
      switch (state) {
        case 1:
          //确认审批
          msg = "确认审批";
          break;
        case 3:
          // 完成审批
          msg = "完成审批";
          break;
        case 2:
          // 拒绝
          msg = "拒绝";
          break;
        default:
          msg = "未知错误";
      }
      this.examineTitle = msg;
      this.examineVisible = true;
      this.id = id;
      this.examineState = state;
      this.clockState = clockState;
    },

    handleExamineOk() {
      this.confirmLoading = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        this.confirmLoading = false;
        if (!err) {
          this.updateState(this.id, this.examineState, values.auditingExplain);
        }
      });
    },
    updateState(id, state, msg, price) {
      const params = {
        id: id,
        examineState: state,
        completionStatus: this.clockState,
        auditingExplain: msg,
        trafficExpense: price,
      };
      this.loading = true;
      this.$axios
        .post("/projectManagerClockController/update", params)
        .then((res) => {
          let tips = "";
          this.form.resetFields();
          this.loading = false;
          this.confirmLoading = false;
          this.examineVisible = false;
          if (res.code == 1) {
            tips = "成功";
            this.$message.success(msg + tips);
            this.getDataList();
          } else {
            tips = "失败";
            this.$message.error(msg + tips);
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
        "/projectManagerClockController/dels",
        "/projectManagerClockController/getAdvancedQuery",
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
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = PERSONALINFOUPDATE;
          } else {
            //新增
            path = PERSONALINFOADD;
          }
          this.confirmLoading = true;
          this.$axios
            .post(path, values)
            .then((res) => {
              let type = res.code == 1 ? "success" : "error";
              this.$message[type](res.msg);
              this.confirmLoading = false;
            })
            .catch((err) => {
              console.log(err);

              this.confirmLoading = false;
            });
        }
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
        .get("/projectManagerClockController/getAdvancedQuery", {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.value.rows;

            const pagination = { ...this.pagination };
            pagination.total = res.value.total;
            this.loading = false;
            this.pagination = pagination;
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
</style>
