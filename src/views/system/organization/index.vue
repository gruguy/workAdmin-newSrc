<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:40:05
 * @LastEditTime: 2022-09-29 13:10:16
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
      <div :class="{ content: tableData.length == 0 }">
        <a-spin :spinning="tableData.length == 0">
          <a-table
            v-if="tableData.length"
            :columns="columns"
            :dataSource="tableData"
            bordered
            size="middle"
            :rowKey="(record) => record.soId"
            :loading="loading"
            :pagination="false"
            :defaultExpandAllRows="true"
            @change="handleTableChange"
          >
            <template slot="soFname" slot-scope="text">
              {{ text || "--" }}
            </template>
            <template slot="soLogo" slot-scope="text">
              {{ text || "--" }}
            </template>
            <template slot="soStatus" slot-scope="text">
              <a-tag v-if="text == '0'" color="red">禁用</a-tag>
              <a-tag v-if="text == '1'" color="green">正常</a-tag>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="openDialogAndOrder(record)"> 编辑 </a>
              <a-divider type="vertical"></a-divider>
              <a
                href="javascript:;"
                @click="openDialogAndOrder(record.soId, false)"
                >新增</a
              >
              <template v-if="record.id != 1">
                <a-divider type="vertical"></a-divider>
                <a
                  href="javascript:;"
                  @click="showConfirmDeleteItem(record.soId)"
                  >删除</a
                >
              </template>
            </span>
          </a-table>
        </a-spin>
      </div>
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
import { SYSORGSLIST, SYSORGSADD, SYSORGSUPDATE, SYSORGSDEL } from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "机构名称",
    dataIndex: "soBname",
    key: "soBname",
  },
  {
    title: "机构状态",
    dataIndex: "soStatus",
    key: "soStatus",
    type: "select",
    scopedSlots: { customRender: "soStatus" },
    dataList: [
      {
        name: "禁用",
        value: 0,
      },
      {
        name: "正常",
        value: 1,
      },
    ],
  },
  {
    title: "水稻面积（亩）",
    dataIndex: "soFname",
    key: "soFname",
    scopedSlots: { customRender: "soFname" },
  },
  {
    title: "小麦面积（亩）",
    dataIndex: "soLogo",
    key: "soLogo",
    scopedSlots: { customRender: "soLogo" },
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "createUserTime",
  //   key: "createUserTime",
  // },
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
      expandKeys: [],
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
      ids: this.$store.state.user.orgId,
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
      this.deleteItem(SYSORGSDEL, SYSORGSLIST, id);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = SYSORGSUPDATE;
          } else {
            //新增
            path = SYSORGSADD;
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
      console.log(data);
      if (data && data.isTrusted) {
        console.log(this.tableData);
        this.$refs.addForm.openModal(this.tableData);
      } else {
        if (typeof data == "string") {
          // 行内新增
          this.$refs.addForm.openModal(this.tableData, false, data);
        } else {
          // 编辑
          this.$refs.addForm.openModal(this.tableData, true, data);
        }
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.loading = true;
      this.$axios
        .get(SYSORGSLIST, {
          params: this.queryParam,
        })
        .then((res) => {
          this.tableData = res.value;
          this.loading = false;
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
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
}
</style>
