<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增合同模板</a-button
      >
      <!-- <a-upload>
        <a-button type="primary"
          ><a-icon type="arrow-up" />批量导入合同模板</a-button
        >
      </a-upload>
      <a-button type="primary" style="margin-left: 15px"
        ><a-icon type="arrow-down" />下载合同模板</a-button
      >
      <a-button
        type="primary"
        ghost
        style="margin-left: 15px; float: right"
        @click="doPrint"
        ><a-icon type="printer" />打印</a-button
      > -->
    </breadcrumb>
    <h2>{{ $route.title }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <!-- <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增合同模板</a-button
      >
      <a-upload>
        <a-button type="primary" style="margin-left: 15px"
          ><a-icon type="arrow-up" />批量导入合同模板</a-button
        >
      </a-upload>
      <a-button type="primary" style="margin-left: 15px"
        ><a-icon type="arrow-down" />下载合同模板</a-button
      >
      <a-button
        type="primary"
        ghost
        style="margin-left: 15px; float: right"
        @click="doPrint"
        ><a-icon type="printer" />打印</a-button
      >
    </div> -->
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.templateId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <span v-has="'preview'">
            <a type="link" size="small" @click="previewPDF(record)"> 预览 </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-has="'print'">
            <a type="link" size="small" @click="doPrint(record.templateUrl)">
              打印
            </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-has="'edit'">
            <a type="link" size="small" @click="openDialogAndOrder(record)">
              编辑
            </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a
            v-has="'delete'"
            type="link"
            size="small"
            @click="showConfirmDeleteItem(record.templateId)"
            >删除
          </a>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="formTitle"
      :visible="modalVisible"
      :confirmLoading="confirmLoading"
      :width="modalW"
      @ok="handleOk"
      @cancel="handleModalCancel"
    >
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item hidden>
              <a-input
                :auto-size="{ minRows: 3, maxRows: 5 }"
                v-decorator="['templateId']"
              >
              </a-input>
            </a-form-item>
            <a-form-item
              label="模板标题"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                :auto-size="{ minRows: 3, maxRows: 5 }"
                v-decorator="[
                  'templateTitle',
                  { rules: [{ required: true, message: '请输入申请主题' }] },
                ]"
              >
              </a-input>
            </a-form-item>
            <a-form-item
              label="上传模板"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-upload
                action="/api/upload/uploadImg"
                :headers="headers"
                :multiple="false"
                accept=".pdf"
                :showUploadList="true"
                @change="handleChange"
                v-decorator="[
                  'templateUrl',
                  { rules: [{ required: true, message: '请选择上传模板' }] },
                ]"
              >
                <a-button> <a-icon type="upload" /> 上传文件</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      class="pdfModal"
      :visible="pdfVisible"
      width="900px"
      @cancel="pdfModalCancel"
      :footer="null"
    >
      <div id="preViewPdf"></div>
      <p-d-f-view ref="pdfView"></p-d-f-view>
    </a-modal>
  </div>
</template>

<script>
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import Breadcrumb from "../../components/Breadcrumb.vue";
import PDFView from "@/components/PDFView.vue";

const columns = [
  {
    title: "模板名称",
    dataIndex: "templateTitle",
    key: "templateTitle",
    scopedSlots: { customRender: "templateTitle" },
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    key: "createdTime",
  },
  {
    title: "操作",
    key: "action",
    width: "20%",
    align: "center",
    type: "hide",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [smartMixin],
  components: {
    SeniorSearch,
    Breadcrumb,
    PDFView,
  },
  data() {
    return {
      headers: {
        Authorization: this.$store.state.user.token,
      },
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      modalW: "900px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      currentIndex: 0,
      tableData: [],
      loading: false,
      confirmLoading: false,
      formTitle: "新增合同模板",
      form: this.$form.createForm(this),
      isEdit: false,
      pagination: {
        simple: false,
      },
      queryParam: {},
      pdfVisible: false,
      currentPage: 0,
      pageCount: 4,
      fileUrl: "",
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
    handleChange(info) {
      console.log(info);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(info.file.response.msg);
        this.fileUrl = info.file.response.value.data.link;
        console.log(this.form);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败`);
      }
      // this.uploadFile(info.file, info.file.name);
    },
    pdfModalCancel() {
      this.pdfVisible = false;
    },
    previewPDF(data) {
      this.pdfVisible = true;
      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs.pdfView.init(data.templateUrl);
      });
    },
    handleImgCancel() {
      this.modalImgVisible = false;
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
        "/contractTemplateController/dels",
        "/contractTemplateController/getAdvancedQuery",
        id
      );
    },
    handleOk(e) {
      e.preventDefault();
      console.log(this.form);
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = "/contractTemplateController/update";
          } else {
            //新增
            path = "/contractTemplateController/save";
          }
          values = {
            ...values,
            templateUrl: this.fileUrl,
          };
          this.confirmLoading = true;
          this.$axios
            .post(path, values)
            .then((res) => {
              let type = res.code == 1 ? "success" : "error";
              this.$message[type](res.msg);
              this.confirmLoading = false;
              this.modalVisible = false;
              this.getDataList();
            })
            .catch((err) => {
              console.log(err);

              this.confirmLoading = false;
            });
        }
      });
    },
    openDialogAndOrder(data) {
      console.log(data);
      this.modalVisible = true;
      if (!data.isTrusted) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "类型编辑";
        setTimeout(() => {
          this.form.setFieldsValue({
            templateId: data.templateId,
            templateTitle: data.templateTitle,
            templateUrl: [data.templateUrl],
          });
        }, 300);
      } else {
        // 新增
        this.formTitle = "类型申请";
        this.isEdit = false;
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.loading = true;
      this.$axios
        .get("/contractTemplateController/getAdvancedQuery", {
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
    doPrint(url) {
      console.log("触发打印");
      this.print(url);
    },
    showPDF(filePath) {
      let iframe = document.createElement("iframe");
      iframe.style.border = "0px";
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.right = "0px";
      iframe.style.top = "0px";
      iframe.setAttribute("src", filePath);
      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        });
      };
      document.body.append(iframe);
    },
    print(filePath) {
      console.log("执行打印");
      console.log(filePath);
      let iframe = document.createElement("iframe");
      iframe.style.border = "0px";
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.right = "0px";
      iframe.style.top = "0px";
      iframe.setAttribute("src", filePath);
      iframe.onload = () => {
        console.log(iframe.contentWindow);
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        });
      };
      document.body.append(iframe);
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
.pdfModal {
  ::v-deep .ant-modal-content .ant-modal-body {
    height: 800px;
    overflow: auto;
  }
}
.handleButtons {
  margin: 20px 0;
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
