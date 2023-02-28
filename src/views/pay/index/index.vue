<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:40:05
 * @LastEditTime: 2022-09-08 14:03:32
 * @Description: 组件创建
-->
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
        :rowKey="(record) => record.id"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="faceImg" slot-scope="text, record">
          <a-avatar shape="square" :size="64" icon="user" :src="text" />
        </template>
        <template slot="sreport" slot-scope="text, record">
          <a-button type="link" @click="showImg(text)"
            >{{ record.sName }}的体检报告</a-button
          >
        </template>
        <template slot="applyState" slot-scope="text">
          <a-tag v-if="text == '0'" color="orange">待审批</a-tag>
          <a-tag v-if="text == '1'" color="blue">审批中</a-tag>
          <a-tag v-if="text == '2'" color="green">已完成</a-tag>
          <a-tag v-if="text == '3'" color="red">被拒绝</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <!-- <a @click="openDialogAndOrder(record)"> 薪资计算 </a>
        <a-divider type="vertical"></a-divider> -->
          <a v-has="'detail'" @click="openDetail(record.personalId)">
            查看记录
          </a>
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
    <modal-form ref="addForm" @loadData="loadData"></modal-form>
    <detail-info ref="detailView"></detail-info>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import DetailInfo from "../index/detail.vue";
import {
  SALARYPAYMENTLIST,
  SALARYPAYMENTADD,
  SALARYPAYMENTUPDATE,
  SALARYPAYMENTDEL,
} from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "员工头像",
    dataIndex: "faceImg",
    align: "center",
    key: "faceImg",
    scopedSlots: { customRender: "faceImg" },
  },
  {
    title: "员工姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
  {
    title: "所属用工申请",
    dataIndex: "appName",
    key: "appName",
  },
  {
    title: "用工类型",
    dataIndex: "empTypeName",
    key: "empTypeName",
  },
  {
    title: "单价",
    dataIndex: "employmentPrice",
    key: "employmentPrice",
  },
  {
    title: "当日薪酬",
    dataIndex: "countPrice",
    key: "countPrice",
  },
  {
    title: "打卡日期",
    dataIndex: "clockTime",
    key: "clockTime",
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
      currentApplyId: "",
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
    loadData(data) {
      this.$confirm({
        title: "是否保存？",
        content: "保存此次生成的数据到发放列表？",
        onOk: () => {
          // 保存数据
          return new Promise((resolve, reject) => {
            this.storeToList(data, resolve, reject);
          });
        },
      });
    },
    storeToList(data, resolve, reject) {
      console.log(data);
      return this.$axios
        .post("/salaryPaymentController/saveList", data)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("保存成功！");
            resolve();
            // 打开发放列表
            this.openDetail(this.currentApplyId);
          } else {
            reject();
          }
        });
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
      this.deleteItem(SALARYPAYMENTDEL, SALARYPAYMENTLIST, id);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = SALARYPAYMENTUPDATE;
          } else {
            //新增
            path = SALARYPAYMENTADD;
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
        this.currentApplyId = data.applyId;
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
        .get("/clockRecordController/getGroupByPersonalId", {
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
