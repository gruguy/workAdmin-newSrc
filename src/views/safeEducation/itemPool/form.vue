<template>
  <a-modal
    :title="formTitle"
    :visible="modalVisible"
    :confirmLoading="confirmLoading"
    :width="modalW"
    @ok="handleOk"
    @cancel="handleModalCancel"
  >
    <template v-if="!showAnswer">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item hidden>
              <a-input v-decorator="['libraryId']"></a-input>
            </a-form-item>
            <a-form-item
              label="试题名称"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                v-decorator="[
                  'libraryTitle',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="试题类型"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-select
                v-decorator="[
                  'libraryType',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
                <a-select-option value="001">单选</a-select-option>
                <a-select-option value="002">多选</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="知识类型"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-select
                v-decorator="[
                  'knowTypeId',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
                <a-select-option
                  v-for="item in knowledgeList"
                  :key="item.knowledgeId"
                  :value="item.knowledgeId"
                  >{{ item.knowledgeName }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <!-- 答案列表 -->

    <template v-if="showAnswer">
      <a-table
        :columns="columns"
        :data-source="answerList"
        :pagination="false"
        :loading="listLoading"
      >
        <span
          slot="libraryOption"
          slot-scope="text, record, index"
          style="min-width: 140px; display: inline-block"
        >
          <a-input
            v-model="answerList[index].libraryOption"
            :readOnly="record.optionId ? true : false"
          ></a-input>
        </span>
        <span
          slot="optionState"
          slot-scope="text, record, index"
          style="min-width: 140px; display: inline-block"
        >
          <a-select
            :disabled="record.optionId ? true : false"
            v-model="answerList[index].optionState"
            style="width: 100px; display: inline-block"
          >
            <a-select-option key="1">正确</a-select-option>
            <a-select-option key="0">错误</a-select-option>
          </a-select>
        </span>
        <span slot="action" slot-scope="text, record">
          <span v-if="!record.optionId">
            <a href="javascript:;" @click="addItem(record)">确认添加</a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a
            v-if="!record.optionId"
            href="javascript:;"
            @click="cancelItem(record)"
            >取消</a
          >
          <a v-if="record.optionId" href="javascript:;" @click="delItem(record)"
            >删除</a
          >
        </span>
      </a-table>
      <a-divider></a-divider>
      <a-button
        class="ant-btn ant-btn-dashed"
        icon="plus"
        block
        @click="addAnswer"
        >添加答案</a-button
      >
    </template>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: "答案标题",
    dataIndex: "libraryOption",
    key: "libraryOption",
    scopedSlots: { customRender: "libraryOption" },
  },
  {
    title: "是否正确",
    dataIndex: "optionState",
    key: "optionState",
    scopedSlots: { customRender: "optionState" },
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    width: "140px",
    scopedSlots: { customRender: "action" },
  },
];
import { PERSONALINFOADD, PERSONALINFOUPDATE, WORKTYPELISTALL } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      columns,
      modalVisible: false,
      listLoading: false,
      modalW: "600px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      workTypeName: "",
      workTypeList: [],
      knowledgeList: [],
      answerList: [],
      key: 0,
      libraryId: "",
      showAnswer: false,
    };
  },
  //方法集合
  methods: {
    addAnswer() {
      this.answerList.push({
        key: this.key++,
        libraryOption: "",
        optionState: "1",
        libraryId: this.libraryId,
      });
    },
    getAnswerList() {
      this.$axios
        .get(
          "/questionBankOptionController/getListprams?libraryId=" +
            this.libraryId
        )
        .then((res) => {
          this.answerList = res.value;
        });
    },
    addItem(params) {
      this.$axios
        .post("/questionBankOptionController/save", params)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
          }
          this.getAnswerList();
        });
    },
    delItem(obj) {
      this.$axios
        .get("/questionBankOptionController/dels?ids=" + obj.optionId)
        .then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
          }
          this.getAnswerList();
        });
    },
    cancelItem(obj) {
      console.log(obj);
      this.answerList = this.answerList.filter((item) => item.key !== obj.key);
    },
    init() {
      this.getKowledgeList();
    },
    openModal(isEdit, data, showAnswer) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      if (isEdit) {
        this.showAnswer = showAnswer;
        this.libraryId = data.libraryId;
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";

        if (showAnswer) {
          this.answerList = data.questionBankOptionVOList;
          this.formTitle = "编辑答案";
        }
        setTimeout(() => {
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          console.log(params.blebId);
          this.form.setFieldsValue(params);
        }, 300);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
      }
    },

    handleOk() {
      this.handleSubmit(this.isEdit);
    },

    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getKowledgeList() {
      this.$axios.get("/knowledgeTypeController/getListprams").then((res) => {
        this.knowledgeList = res.value;
      });
    },
    handleSubmit(isEdit) {
      if (!this.showAnswer) {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            console.log("Received values of form: ", values);
            let url = "";
            console.log(isEdit);
            if (isEdit) {
              url = "/questionBankController/update";
            } else {
              url = "/questionBankController/save";
            }
            console.log(url);
            values = {
              ...values,
            };
            console.log(values);

            this.$axios.post(url, values).then((res) => {
              console.log(res);
              this.confirmLoading = false;
              let type = res.code == 1 ? "success" : "error";
              this.$message[type](res.msg);
              if (res.code == 1) {
                this.modalVisible = false;
                this.$emit("loadData");
              }
            });
          }
        });
      } else {
        this.modalVisible = false;
        this.$emit("loadData");
      }
    },
    getTypeList() {
      this.$axios.get(WORKTYPELISTALL).then((res) => {
        if (res.code == 1) {
          this.workTypeList = res.value;
        }
      });
    },
    workTypeChange(e) {
      this.workTypeName = this.workTypeList.find(
        (item) => item.id === e
      ).workTypeName;
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.map-wrapper {
  position: relative;
  .mapSelect {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 4px;
    padding: 4px 10px;
    background-color: #1890ff;
    color: #fff;
    text-align: center;
  }
}
</style>
