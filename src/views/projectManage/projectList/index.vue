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
          <a-avatar shape="square" :size="64" icon="user" :src="text" />
        </template>
        <template slot="clockStateInfo" slot-scope="text">
          <a-tag color="blue" v-if="text == '0'">已入场</a-tag>
          <a-tag color="green" v-if="text == '1'">结束待2次审核</a-tag>
          <a-tag color="green" v-if="text == '3'">已完成</a-tag>
        </template>
        <template slot="examineState" slot-scope="text">
          <a-tag color="orange" v-if="text == '0'">待审核</a-tag>
          <a-tag color="green" v-if="text == '1'">已审核</a-tag>
          <a-tag color="red" v-if="text == '2'">已驳回</a-tag>
        </template>
        <!-- totalPrice -->

        <template slot="totalPrice" slot-scope="text, record">
          <span style="font-weight: bold"
            >￥{{
              parseFloat(
                Number(record.employmentPrice) * Number(record.actualMu)
              ).toFixed(2)
            }}</span
          >
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
          <!-- <a @click="openDialogAndOrder(record)"> 编辑 </a>
          <a-divider type="vertical"></a-divider> -->
          <template
            v-if="record.clockStateInfo == 1 && record.examineState == 0"
          >
            <a v-has="'pass'" @click="setState(record.id, 1, record.actualMu)">
              审核通过
              <a-divider type="vertical"></a-divider>
            </a>
            <a v-has="'reject'" @click="setState(record.id, 2)">
              审核驳回
              <a-divider type="vertical"></a-divider>
            </a>
          </template>
          <!-- <span v-if="record.clockState == 0">暂无操作</span> -->
          <!-- <template v-if="record.auditingState == 1">
          <a @click="setState(record.id, 2)"> 通过 </a>
          <a-divider type="vertical"></a-divider>
          <a @click="setState(record.id, 3)"> 拒绝 </a>
          <a-divider type="vertical"></a-divider>
        </template> -->
          <a-dropdown v-has="'delete'">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
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
    <!-- <modal-form ref="addForm" @loadData="getDataList"></modal-form> -->
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
          ><a-input type="hidden" v-decorator="['id']"
        /></a-form-item>
        <template v-if="shwoState">
          <a-form-item
            label="实际亩数"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              placeholder="请输入实际亩数"
              style="width: 100%"
              v-decorator="[
                'actualMu',
                { rules: [{ required: true, message: '请输入实际亩数' }] },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="每亩单价"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              style="width: 100%"
              placeholder="请输入每亩单价"
              v-decorator="[
                'employmentPrice',
                { rules: [{ required: true, message: '请输入每亩单价' }] },
              ]"
            />
          </a-form-item>
        </template>

        <a-form-item
          label="审批意见"
          :label-col="formLayout.labelCol"
          :wrapper-col="formLayout.wrapperCol"
        >
          <a-input
            placeholder="请输入审批意见"
            v-decorator="['auditingExplain']"
          />
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
    title: "包工负责人",
    dataIndex: "personalName",
    align: "center",
    width: "100px",
    key: "personalName",
  },
  {
    title: "项目名称",
    dataIndex: "appName",
    width: "180px",
    key: "appName",
    scopedSlots: { customRender: "appName" },
  },
  {
    title: "用工项目",
    dataIndex: "empProjectName",
    width: "180px",
    key: "empProjectName",
  },
  {
    title: "项目状态",
    dataIndex: "clockStateInfo",
    width: "100px",
    align: "center",
    key: "clockStateInfo",
    scopedSlots: { customRender: "clockStateInfo" },
  },
  {
    title: "审核状态",
    dataIndex: "examineState",
    width: "100px",
    align: "center",
    key: "examineState",
    scopedSlots: { customRender: "examineState" },
  },
  {
    title: "包工目标（亩）",
    dataIndex: "estimateMu",
    key: "estimateMu",
    width: "80px",
    align: "center",
  },
  {
    title: "实际包工（亩）",
    dataIndex: "actualMu",
    key: "actualMu",
    width: "80px",
    align: "center",
  },
  {
    title: "指导价（每亩）",
    dataIndex: "guidePrice",
    key: "guidePrice",
    align: "center",
    width: "80px",
    scopedSlots: { customRender: "guidePrice" },
  },
  {
    title: "实际单价（每亩）",
    dataIndex: "employmentPrice",
    key: "employmentPrice",
    align: "center",
    width: "80px",
    scopedSlots: { customRender: "employmentPrice" },
  },
  {
    title: "包工价",
    dataIndex: "totalPrice",
    key: "totalPrice",
    width: "80px",
    align: "center",
    scopedSlots: { customRender: "totalPrice" },
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
      examineState: "",
      id: "",
      auditingState: "",
      examineVisible: false,
      shwoState: false,
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
        clockState: 3,
        clockStateInfo: 3,
        actualMu,
        employmentPrice,
        auditingExplain: msg,
        empWorkType: 4,
      };
      console.log(params);
      this.loading = true;
      this.$axios.post("/clockRecordController/update", params).then((res) => {
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
        "/clockRecordController/dels",
        "/clockRecordController/getAdvancedQuery",
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
        .get("/clockRecordController/getAdvancedQuery", {
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
