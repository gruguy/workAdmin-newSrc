<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:40:05
 * @LastEditTime: 2022-09-16 16:42:35
 * @Description: 组件创建
-->
<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </breadcrumb>
    <!-- <h2>{{ $route.name }}</h2> -->
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </div>
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.userId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="roleNames" slot-scope="text">
          <template v-if="text && text.length">
            <a-tag
              class="tag"
              v-for="(item, index) in text.split(',')"
              :key="index"
              color="blue"
              >{{ item }}</a-tag
            >
          </template>
          <template v-else><a-tag>暂无授权角色</a-tag></template>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="openDialogAndOrder(record)"> 编辑 </a>
          <a-divider type="vertical"></a-divider>
          <a @click="openRoleModal(record)"> 授予权限 </a>
          <a-divider type="vertical"></a-divider>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a
                  href="javascript:;"
                  @click="showConfirmDeleteItem(record.userId)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <modal-form
      ref="addForm"
      :orgId="orgId"
      @loadData="getDataList"
    ></modal-form>
    <detail-info ref="detailView"></detail-info>
    <user-role-select
      ref="userRoleSelect"
      @loadData="getDataList"
    ></user-role-select>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import DetailInfo from "./detail.vue";
import UserRoleSelect from "./userRoleSelect";
import { SYSUSERSLIST, SYSUSERSDEL } from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "用户名",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "登录名",
    dataIndex: "userLoginname",
    key: "userLoginname",
  },
  // {
  //   title: "部门",
  //   dataIndex: "orgName",
  //   key: "orgName",
  // },
  {
    title: "手机号码",
    dataIndex: "pthone",
    key: "pthone",
  },
  {
    title: "角色",
    dataIndex: "roleNames",
    key: "roleNames",
    type: "hide",
    scopedSlots: { customRender: "roleNames" },
  },
  {
    title: "创建时间",
    dataIndex: "createUserTime",
    key: "createUserTime",
    type: "hide",
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
    UserRoleSelect,
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
      orgId: 1,
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
      orgId: 1,
    };
  },
  methods: {
    openRoleModal(data) {
      this.$refs.userRoleSelect.openModal(data);
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
      this.deleteItem(SYSUSERSDEL, SYSUSERSLIST, id);
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
    getDataList(data) {
      let da = data;
      this.loading = true;
      console.log(data);
      if (da) {
        const { orgId } = da;
        this.orgId = orgId;
      } else {
        da = {
          orgId: this.orgId,
        };
      }
      this.$axios
        .get(SYSUSERSLIST, {
          params: { ...this.queryParam, ...da },
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
.tag {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
