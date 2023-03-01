<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </breadcrumb>
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
        </template>
        <template slot="auditingState" slot-scope="text">
          <a-tag v-if="text == '0'" color="orange">待审批</a-tag>
          <a-tag v-if="text == '1'" color="blue">已完成</a-tag>
          <!-- <a-tag v-if="text == '2'" color="green">已完成</a-tag> -->
          <a-tag v-if="text == '3'" color="red">被拒绝</a-tag>
        </template>

        <template slot="completionStatus" slot-scope="text">
          <a-tag v-if="text == '0'" color="orange">未完成</a-tag>
          <a-tag v-if="text == '1'" color="blue">已完成</a-tag>
        </template>
        <template slot="empTime" slot-scope="text">
          {{ text }}
        </template>
        <span slot="action" slot-scope="text, record">
          <span v-has="'edit'">
            <a @click="openDialogAndOrder(record)"> 编辑 </a>
            <a-divider type="vertical"></a-divider
          ></span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'detail'">
                <a href="javascript:;" @click="openDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item v-has="'delete'">
                <a
                  href="javascript:;"
                  @click="showConfirmDeleteItem(record.appId)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
    <detail-info ref="detailView"></detail-info>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import DetailInfo from "../index/detail.vue";
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
    type: "hide",
  },
  {
    title: "用工类型",
    dataIndex: "empType",
    key: "empType",
    scopedSlots: { customRender: "empType" },
    type: "hide",
  },
  {
    title: "项目经理",
    dataIndex: "projectManagerName",
    key: "projectManagerName",
    scopedSlots: { customRender: "projectManagerName" },
    type: "hide",
  },
  {
    title: "用工时间",
    dataIndex: "empTime",
    key: "empTime",
    scopedSlots: { customRender: "empTime" },
    type: "hide",
  },
  // {
  //   title: "用工地点",
  //   dataIndex: "empAddress",
  //   key: "empAddress",
  // },
  // {
  //   title: "申请原因",
  //   dataIndex: "empContents",
  //   key: "empContents",
  // },
  // {
  //   title: "所属劳务",
  //   dataIndex: "appManage",
  //   key: "appManage",
  // },
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
      {
        name: "被拒绝",
        value: 3,
      },
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
    width: "180px",
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
    setState(id, state) {
      let msg = "";
      switch (state) {
        case 1:
          //确认审批
          msg = "确认审批";
          break;
        case 2:
          // 完成审批
          msg = "完成审批";
          break;
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
    openDetail(id) {
      this.$refs.detailView.showDetail(id);
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
