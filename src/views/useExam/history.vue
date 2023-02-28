<template>
  <div class="white-bg-wrapper">
    <breadcrumb></breadcrumb>
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <!-- <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </div> -->
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.appId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="appImg" slot-scope="text, record">
          <a-avatar :size="40" icon="user" :src="text" />
        </template>
        <template slot="empType" slot-scope="text, record">
          <a-tag color="blue" v-if="text == 1">点工/小时工</a-tag>
          <a-tag color="blue" v-if="text == 2">点工/天工</a-tag>
          <a-tag color="grey" v-if="text == 3">固定工</a-tag>
          <a-tag color="green" v-if="text == 4">包工</a-tag>
          <!-- <template v-if="text == 4">
            <a-tag color="green">包工</a-tag>
            <a-tag color="black">
              项目经理：{{ record.projectManagerName }}</a-tag
            >
          </template> -->
        </template>
        <template slot="auditingState" slot-scope="text">
          <a-tag v-if="text == '0'" color="orange">待审批</a-tag>
          <a-tag v-if="text == '1'" color="blue">已完成</a-tag>
          <!-- <a-tag v-if="text == '2'" color="green">已完成</a-tag> -->
          <a-tag v-if="text == '3'" color="red">被拒绝</a-tag>
        </template>
        <template slot="empTime" slot-scope="text, record">
          {{ text + " 至 " + record.empTimeEnd }}
        </template>

        <template slot="completionStatus" slot-scope="text">
          <a-tag v-if="text == '0'" color="orange">未完成</a-tag>
          <a-tag v-if="text == '1'" color="blue">已完成</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.auditingState == 0">
            <a @click="setState(record.appId, 1)"> 申请通过 </a>
            <a-divider type="vertical"></a-divider>
            <a @click="setState(record.appId, 3)"> 申请拒绝 </a>
            <a-divider type="vertical"></a-divider>
          </template>
          <template
            v-if="record.auditingState == 1 && record.completionStatus == 0"
          >
            <!-- <a @click="setDoneState(record.appId, 1)"> 完成 </a>
            <a-divider type="vertical"></a-divider> -->
          </template>
          <a v-has="'detail'" href="javascript:;" @click="openDetail(record)"
            >详情</a
          >

          <!-- <a-divider type="vertical"></a-divider>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="openDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a
                href="javascript:;"
                @click="showConfirmDeleteItem(record.applyId)"
                >删除</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
    <detail-info ref="detailView"></detail-info>
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
        <a-form-item label="审批意见">
          <a-input v-decorator="['approveDescribe']" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./index/form.vue";
import DetailInfo from "./index/detail.vue";
import {
  EMPLOYMENTLIST,
  EMPLOYMENTADD,
  EMPLOYMENTUPDATE,
  EMPLOYMENTDEL,
} from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  // {
  //   title: "用工图标",
  //   dataIndex: "appImg",
  //   key: "appImg",
  //   align: "center",
  //   scopedSlots: { customRender: "appImg" },
  // },
  {
    title: "申请名称",
    dataIndex: "appName",
    key: "appName",
  },
  {
    title: "用工项目",
    dataIndex: "empProjectName",
    key: "empProjectName",
  },
  {
    title: "用工人数",
    dataIndex: "empPersonalCount",
    key: "empPersonalCount",
  },
  {
    title: "用工类型",
    dataIndex: "empType",
    key: "empType",
    scopedSlots: { customRender: "empType" },
  },
  {
    title: "项目经理",
    dataIndex: "projectManagerName",
    key: "projectManagerName",
  },
  {
    title: "用工时间",
    dataIndex: "empTime",
    key: "empTime",
    scopedSlots: { customRender: "empTime" },
  },
  // {
  //   title: "工作内容",
  //   dataIndex: "empContents",
  //   key: "empContents",
  // },
  // {
  //   title: "所属劳务",
  //   dataIndex: "appManage",
  //   key: "appManage",
  // },completionStatus
  {
    title: "申请状态",
    dataIndex: "auditingState",
    key: "auditingState",
    type: "select",
    scopedSlots: { customRender: "auditingState" },
    dataList: [
      {
        name: "待审批",
        value: 0,
      },
      {
        name: "已完成",
        value: 1,
      },
      // {
      //   name: "已完成",
      //   value: 2,
      // },
      // {
      //   name: "被拒绝",
      //   value: 3,
      // },
    ],
  },
  {
    title: "完成状态",
    dataIndex: "completionStatus",
    key: "completionStatus",
    type: "select",
    scopedSlots: { customRender: "completionStatus" },
    dataList: [
      {
        name: "未完成",
        value: 0,
      },
      {
        name: "已完成",
        value: 1,
      },
    ],
  },
  {
    title: "操作",
    key: "action",
    width: "240px",
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
    DetailInfo,
    Breadcrumb,
  },
  data() {
    return {
      columns,
      modalVisible: false,
      examineVisible: false,
      confirmLoading: false,
      approveDescribe: "",
      // currentImg: "",
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
      applyId: "",
      applyState: "",
      state: "",
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
      completionStatus: 1,
    };
    this.getDataList();
  },
  methods: {
    setState(id, state) {
      let msg = "";
      switch (state) {
        case 1:
          //确认审批
          msg = "完成审批";
          break;
        // case 2:
        //   // 完成审批
        //   msg = "完成审批";
        //   break;
        case 3:
          // 拒绝
          msg = "拒绝";
          break;
        default:
          msg = "未知错误";
      }
      this.examineTitle = msg;
      this.examineVisible = true;
      this.applyId = id;
      this.applyState = state;
    },
    setDoneState(id, state) {
      this.applyId = id;
      this.state = state;
      this.showConfirm();
    },
    showConfirm() {
      this.$confirm({
        title: "确认",
        content: "确认此用工已完成",
        onOk: () => {
          return this.$axios
            .post("appliactionEmploymentController/update", {
              appId: this.applyId,
              completionStatus: 1,
            })
            .then((res) => {
              const type = res && res.code == 1 ? "success" : "error";
              this.$message[type](res.msg);
            });
        },
        onCancel() {},
      });
    },
    handleExamineOk() {
      this.confirmLoading = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateState(
            this.applyId,
            this.applyState,
            values.approveDescribe
          );
        }
      });
    },
    updateState(id, state, msg) {
      const params = {
        applyId: id,
        approveState: state,
        approveDescribe: msg,
      };
      if (state == 1 || state == 3) {
        params.appleOkState = 1;
      }
      this.loading = true;
      this.$axios.post("/examineApproveController/save", params).then((res) => {
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
    openDetail(data) {
      this.$refs.detailView.showDetail(data);
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
      this.deleteItem(EMPLOYMENTDEL, EMPLOYMENTLIST, id);
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
            .post(EMPLOYMENTLIST, { id: id, personalId: cid })
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
            path = EMPLOYMENTUPDATE;
          } else {
            //新增
            path = EMPLOYMENTADD;
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
      this.loading = true;
      this.$axios
        .get(EMPLOYMENTLIST, { params: this.queryParam })
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
