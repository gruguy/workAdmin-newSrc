<template>
  <div class="white-bg-wrapper">
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增题库</a-button
      >
    </div>
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.prId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="qname" slot-scope="text, record">
          <router-link :to="`/safeEducation/questionBank/${record.qid}`">{{
            text
          }}</router-link>
        </template>
        <span slot="action" slot-scope="text, record">
          <a-tooltip title="编辑" @click="openDialogAndOrder(record)">
            <a-button type="primary" size="small">
              <a-icon type="edit" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="删除">
            <a-button
              type="danger"
              size="small"
              @click="showConfirmDeleteItem(record.processInstanceId)"
            >
              <a-icon type="close" />
            </a-button>
          </a-tooltip>
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
          <a-col :span="12">
            <a-form-item
              label="姓名"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'sName',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="手机号"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'sTel',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="身份证号"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'sId',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="性别"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-select
                v-decorator="['sgender', { rules: [{ message: '请输入...' }] }]"
              >
                <a-select-option key="1" :value="1">男</a-select-option>
                <a-select-option key="1" :value="2">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="不良种类"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-select
                v-decorator="[
                  'badType',
                  { required: true, rules: [{ message: '请输入...' }] },
                ]"
              >
                <a-select-option :key="1" :value="1"
                  >在岗履职差</a-select-option
                >
                <a-select-option :key="2" :value="2"
                  >身体状态不佳</a-select-option
                >
                <a-select-option :key="3" :value="3"
                  >存在违法违纪行为</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
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
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";

const columns = [
  {
    title: "题库名",
    dataIndex: "qname",
    key: "qname",
    scopedSlots: { customRender: "qname" },
  },
  {
    title: "题目数量",
    dataIndex: "qnums",
    key: "qnums",
  },
  {
    title: "描述",
    dataIndex: "qdesc",
    key: "qdesc",
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
      formTitle: "采购申请",
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
        "/bualarmtypeController/delete",
        "/bualarmtypeController/getAdvancedQuery.do",
        id
      );
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = "/bualarmtypeController/update.do";
          } else {
            //新增
            path = "/bualarmtypeController/save.do";
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
      this.modalVisible = true;
      if (!data.isTrusted) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
        setTimeout(() => {
          this.form.setFieldsValue({
            sId: data.sId,
            sName: data.sName,
            sTel: data.sTel,
            sWorkType: data.sWorkType,
            sreport: data.sreport,
            sgender: data.sgender,
          });
        }, 300);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.loading = true;
      setTimeout(() => {
        this.tableData = [
          {
            qid: 1,
            qname: "机械伤害题库",
            qnums: 20,
            qdesc: "机械伤害种类众多，安全生产，需要认真学习相关知识",
          },
          {
            qid: 2,
            qname: "防火用电题库",
            qnums: 30,
            qdesc: "防火用电种类众多，安全生产，需要认真学习相关知识",
          },
        ];
        const pagination = { ...this.pagination };
        pagination.total = 2;
        this.loading = false;
        this.pagination = pagination;
      }, 2000);
      // this.$axios
      //   .get("/source/getBadRecordList", { params: this.queryParam })
      //   .then(res => {
      //     if (res.code === 1) {
      //       this.tableData = res.value.rows;

      //       const pagination = { ...this.pagination };
      //       pagination.total = res.value.total;
      //       this.loading = false;
      //       this.pagination = pagination;
      //     } else {
      //       this.loading = false;
      //       this.tableData = null;
      //     }
      //   });
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
