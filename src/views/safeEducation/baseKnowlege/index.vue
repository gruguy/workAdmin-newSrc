<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button type="danger" ghost @click="openDialogAndOrder"
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
        :rowKey="(record) => record.id"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="sreport" slot-scope="text, record">
          <a-button type="link" @click="showImg(text)"
            >{{ record.sName }}的体检报告</a-button
          >
        </template>
        <template slot="personalSex" slot-scope="text">
          <span v-if="text == '0'">男</span>
          <span v-else>女</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="openDialogAndOrder(record)"> 编辑 </a>
          <a-divider type="vertical"></a-divider>
          <a @click="showConfirmBlackList(record.id, record.personalId)">
            拉入不良记录
          </a>
          <a-divider type="vertical"></a-divider>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="openDetail(record)">详情</a>
              </a-menu-item>
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
    title: "姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
  {
    title: "性别",
    dataIndex: "personalSex",
    key: "personalSex",
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
    key: "personalId",
  },
  {
    title: "工种",
    dataIndex: "workTypeName",
    type: "select",
    dataList: [
      {
        name: "棉农",
        value: 1,
      },
      {
        name: "司机",
        value: 2,
      },
    ],
  },
  {
    title: "部门",
    dataIndex: "deptName",
    key: "deptName",
    type: "hide",
    align: "center",
    scopedSlots: { customRender: "deptName" },
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
      // if (!data.isTrusted) {
      //   // 编辑
      //   this.isEdit = true;
      //   this.formTitle = "类型编辑";
      //   setTimeout(() => {
      //     let params = {};
      //     for (let key in data) {
      //       params[key] = data[key];
      //     }
      //     console.log(params.blebId);
      //     this.form.setFieldsValue(params);
      //   }, 300);
      // } else {
      //   // 新增
      //   this.formTitle = "类型申请";
      //   this.isEdit = false;
      // }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
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
