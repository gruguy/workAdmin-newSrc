<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
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
        v-has="'downloadTemplate'"
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
        v-has="'import'"
      >
        <a-button type="primary"
          ><a-icon type="arrow-up" />批量导入人员</a-button
        >
      </a-upload>
    </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <!-- <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
      <a-button type="primary" style="margin-left: 15px"
        ><a-icon type="arrow-down" />模板下载</a-button
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
        <a-button type="primary" style="margin-left: 15px"
          ><a-icon type="arrow-up" />批量导入人员</a-button
        >
      </a-upload>
    </div> -->
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
        <template slot="personalImage" slot-scope="text, record">
          <!-- <img :src="text" class="avatar" /> -->
          <a-avatar
            @click="showImage(text)"
            shape="square"
            :size="64"
            icon="user"
            :src="text"
          />
        </template>
        <template slot="auditingState" slot-scope="text">
          <a-tag color="orange" v-if="text == '0'">未审核</a-tag>
          <a-tag color="blue" v-if="text == '1'">审核通过</a-tag>
          <!-- <a-tag color="green" v-if="text == '2'">审核通过</a-tag>
        <a-tag color="red" v-if="text == '3'">不通过</a-tag> -->
        </template>
        <template slot="personalSex" slot-scope="text">
          <span v-if="text == '0'">男</span>
          <span v-else>女</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <span v-has="'edit'">
            <a @click="openDialogAndOrder(record)"> 编辑 </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a
            v-has="'confirmExam'"
            v-if="record.auditingState == 0"
            @click="setState(record.id, 1)"
          >
            确认审批
            <a-divider type="vertical"></a-divider>
          </a>
          <!-- <template v-if="record.auditingState == 1">
          <a @click="setState(record.id, 2)"> 通过 </a>
          <a-divider type="vertical"></a-divider>
          <a @click="setState(record.id, 3)"> 拒绝 </a>
          <a-divider type="vertical"></a-divider>
        </template> -->
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'detail'">
                <a href="javascript:;" @click="openDetail(record.id)">详情</a>
              </a-menu-item>
              <a-menu-item v-has="'sendBlacklist'">
                <a @click="showConfirmBlackList(record.id, record.personalId)">
                  拉入违规记录
                </a>
              </a-menu-item>
              <a-menu-item v-has="'delete'">
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
    <!-- 体检报告展示 -->
    <a-modal
      ref="showImg"
      :visible="modalImgVisible"
      :width="modalW"
      @ok="handleImgOk"
      @cancel="handleImgCancel"
    >
      <img :src="currentImg" style="width: 100%" />
    </a-modal>
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
        <a-form-item label="审批意见">
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
    title: "照片",
    dataIndex: "personalImage",
    align: "center",
    key: "personalImage",
    width: "120px",
    type: "hide",
    scopedSlots: { customRender: "personalImage" },
  },
  {
    title: "姓名",
    dataIndex: "personalName",
    width: "120px",
    key: "personalName",
  },
  {
    title: "年龄",
    dataIndex: "age",
    align: "center",
    width: "80px",
    key: "age",
  },
  {
    title: "性别",
    dataIndex: "personalSex",
    key: "personalSex",
    width: "80px",
    align: "center",
    type: "select",
    scopedSlots: { customRender: "personalSex" },
    dataList: [
      {
        name: "男",
        value: 0,
      },
      {
        name: "女",
        value: 1,
      },
    ],
  },
  {
    title: "手机号",
    dataIndex: "personalPhone",
    key: "personalPhone",
  },
  {
    title: "身份证号",
    dataIndex: "personalId",
    width: "180px",
    key: "personalId",
  },
  {
    title: "状态",
    dataIndex: "auditingState",
    key: "auditingState",
    type: "hide",
    scopedSlots: { customRender: "auditingState" },
  },
  {
    title: "工种",
    dataIndex: "workTypeName",
    type: "hide",
  },
  // {
  //   title: "部门",
  //   dataIndex: "deptName",
  //   key: "deptName",
  //   type: "hide",
  //   align: "center",
  //   scopedSlots: { customRender: "deptName" },
  // },
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
    showImage(text) {
      // 判断地址是否正确
      const reg = /^[(http)(https)]/;
      console.log(reg.test(text));
      if (reg.test(text)) {
        this.$viewerApi({
          images: [text],
        });
      }
    },
    openDetail(id) {
      // this.$refs.detailView.showDetail(id);
      this.$router.push(`/sourceInfo/InfoDetailPage/${id}`);
    },

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
      this.id = id;
      this.auditingState = state;
    },

    handleExamineOk() {
      this.confirmLoading = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateState(this.id, this.auditingState, values.auditingExplain);
        }
      });
    },
    updateState(id, state, msg) {
      const params = {
        id: id,
        auditingState: state,
        auditingExplain: msg,
      };
      this.loading = true;
      this.$axios
        .post("/personalInformationController/auditing", params)
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
      this.deleteItem(PERSONALINFODEL, PERSONALINFOLIST, id);
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
        .get(PERSONALINFOLIST, { params: this.queryParam })
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
