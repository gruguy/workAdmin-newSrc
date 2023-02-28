<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:40:05
 * @LastEditTime: 2022-08-23 14:36:57
 * @Description: 组件创建
-->
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
        :rowKey="(record) => record.moduleId"
        :loading="loading"
        :pagination="false"
      >
        <template slot="moduleIcon" slot-scope="text, record">
          <icon-font :type="text" style="font-size: 18px"></icon-font>
        </template>
        <template slot="status" slot-scope="text">
          <a-tag v-if="text == '1'" color="green">正常</a-tag>
          <a-tag v-if="text == '0'" color="red">停用</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="openDialogAndOrder(record)"> 编辑 </a>
          <a-divider type="vertical"></a-divider>
          <a
            href="javascript:;"
            @click="openDialogAndOrder(record.moduleId, false)"
            >新增</a
          >
          <template v-if="record.soId != 1">
            <a-divider type="vertical"></a-divider>
            <a
              href="javascript:;"
              @click="showConfirmDeleteItem(record.moduleId)"
              >删除</a
            >
          </template>
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
import DetailInfo from "./detail.vue";
import {
  SYSMODULELIST,
  SYSMODULEADD,
  SYSMODULEUPDATE,
  SYSMODULEDEL,
} from "@/api";
import { Icon } from "ant-design-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3229540_714c54u7stn.js",
});

const columns = [
  {
    title: "菜单名称",
    dataIndex: "moduleName",
    key: "moduleName",
    width: "300px",
  },
  {
    title: "图标",
    dataIndex: "moduleIcon",
    align: "center",
    key: "moduleIcon",
    scopedSlots: { customRender: "moduleIcon" },
  },
  {
    title: "排序",
    dataIndex: "moduleOrder",
    align: "center",
    key: "moduleOrder",
  },
  {
    title: "权限标识",
    dataIndex: "moduleUid",
    key: "moduleUid",
  },
  {
    title: "路由地址",
    dataIndex: "moduleUrl",
    key: "moduleUrl",
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
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
    IconFont,
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
      appId: 1,
      moduleType: 1,
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
      this.deleteItem(SYSMODULEDEL, SYSMODULELIST, id);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = SYSMODULEUPDATE;
          } else {
            //新增
            path = SYSMODULEADD;
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
        .get(SYSMODULELIST, {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.value;
            this.loading = false;
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
