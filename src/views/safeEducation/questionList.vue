<!--
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-04-14 15:19:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-22 13:23:01
-->
<template>
  <div class="white-bg-wrapper">
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增试题</a-button
      >
      <!-- <a-upload> -->
      <a-button type="primary" style="margin-left: 15px"
        ><a-icon type="arrow-down" />模板下载</a-button
      >
      <!-- </a-upload>
      <a-upload> -->
      <a-button type="primary" style="margin-left: 15px"
        ><a-icon type="arrow-up" />批量导入试题</a-button
      >
      <!-- </a-upload> -->
    </div>
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.quid"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="qname" slot-scope="text, record">
          {{ text }}
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
          <a-col :span="24">
            <a-form-item
              label="题目"
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

          <a-col :span="24">
            <a-form-item
              v-for="(item, index) in answers"
              :label="answerSorts[index]"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                style="width: calc(100% - 30px); margin-right: 8px"
                v-decorator="[
                  `${item.key}`,
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
              <a-icon
                type="minus-circle"
                style="cursor: pointer"
                @click="delAnswerItem(index)"
              ></a-icon>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 添加答案 -->
        <a-row :gutter="24">
          <a-form-item
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperColOffset"
          >
            <a-button
              type="dashed"
              icon="plus"
              style="width: 60%"
              @click="addAnswer(answers.length)"
            >
              添加答案
            </a-button>
          </a-form-item>
          <!-- <a-button icon="plus" type="default"></a-button> -->
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
    title: "试题列表",
    dataIndex: "qname",
    key: "qname",
    scopedSlots: { customRender: "qname" },
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
        wrapperColOffset: { span: 12, offset: 6 },
      },
      currentIndex: 0,
      tableData: [],
      loading: false,
      confirmLoading: false,
      formTitle: "新增",
      flowStatus: 0,
      flowId: "",
      form: this.$form.createForm(this),
      answers: [],
      answerSorts: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
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
    addAnswer(index) {
      console.log(index);
      this.answers.push({
        key: this.answerSorts[index],
        value: "",
      });
      console.log(this.answers);
    },
    delAnswerItem(index) {
      this.answers = this.answers.filter((item, i) => i !== index);
    },
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
            qdesc: "机械伤害种类众多，安全生产，需要认真学习相关知识",
          },
          {
            qid: 2,
            qname: "防火用电题库",
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
