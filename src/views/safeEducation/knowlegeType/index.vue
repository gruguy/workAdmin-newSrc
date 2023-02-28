<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <!-- <senior-search :columns="columns" @ok="setQueryParam"></senior-search> -->
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
        :rowKey="(record) => record.knowledgeId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <span v-has="'edit'">
            <a @click="openDialogAndOrder(record)"> 编辑 </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a-dropdown v-has="'delete'">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="showConfirmDeleteItem(record.knowledgeId)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
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
    title: "知识分类名",
    dataIndex: "knowledgeName",
    key: "knowledgeName",
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
      this.deleteItem(
        "/knowledgeTypeController/dels",
        "/knowledgeTypeController/getAdvancedQuery",
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
        .get("/knowledgeTypeController/getAdvancedQuery", {
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
