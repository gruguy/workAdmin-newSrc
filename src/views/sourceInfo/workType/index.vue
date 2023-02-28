<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </breadcrumb>
    <h2>工种管理</h2>
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
                <a href="javascript:;" @click="showConfirmDeleteItem(record.id)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- <span slot="action" slot-scope="text, record">
        <a-tooltip title="编辑" @click="openDialogAndOrder(record)">
          <a-button type="primary" size="small">
            <a-icon type="edit" />
          </a-button>
        </a-tooltip>
        <a-tooltip title="删除">
          <a-button
            type="danger"
            size="small"
            @click="showConfirmDeleteItem(record.id)"
          >
            <a-icon type="close" />
          </a-button>
        </a-tooltip>
      </span> -->
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
              <input type="hidden" v-decorator="['id']" />
            </a-form-item>
            <a-form-item
              label="工种类别名称"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'workTypeName',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import { WORKTYPELIST, WORKTYPEADD, WORKTYPEUPDATE, WORKTYPEDEL } from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "工种名称",
    dataIndex: "workTypeName",
    key: "workTypeName",
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    key: "createdTime",
  },
  {
    title: "操作",
    key: "action",
    width: "160px",
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
  },
  data() {
    return {
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      modalW: "400px",
      formLayout: {
        labelCol: { span: 9 },
        wrapperCol: { span: 14 },
      },
      formItemArr: [],
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
      this.getDataList();
    },
    removeItem(index) {
      this.formItemArr.splice(index, 1);
    },
    showConfirmDeleteItem(id) {
      this.deleteItem(WORKTYPEDEL, WORKTYPELIST, id);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = WORKTYPEUPDATE;
          } else {
            //新增
            path = WORKTYPEADD;
          }
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
      this.modalVisible = true;
      if (!data.isTrusted) {
        console.log(data);
        // 编辑
        this.isEdit = true;
        this.formTitle = "类型编辑";
        setTimeout(() => {
          this.form.setFieldsValue({
            workTypeName: data.workTypeName,
            id: data.id,
          });
        }, 300);
      } else {
        // 新增
        this.formTitle = "类型新增";
        this.isEdit = false;
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.loading = true;
      this.$axios.get(WORKTYPELIST, { params: this.queryParam }).then((res) => {
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
  margin: 0 0 20px;
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
