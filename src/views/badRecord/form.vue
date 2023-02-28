<template>
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
            <a-input v-decorator="['blackId']"> </a-input>
          </a-form-item>
          <a-form-item
            label="姓名"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'blackName',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <!-- <a-col :span="24">
          <a-form-item
            label="手机号"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'sTel',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col> -->

        <a-col :span="24">
          <a-form-item
            label="身份证号"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'blackCode',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="性别"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              v-decorator="['blackSex', { rules: [{ message: '请输入...' }] }]"
            >
              <a-select-option value="0">男</a-select-option>
              <a-select-option value="1">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="加入说明"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-textarea
              rows="3"
              v-decorator="[
                'describeRemark',
                { required: true, rules: [{ message: '请输入...' }] },
              ]"
            >
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { BLACKLISTUPDATE, BLACKLISTADD } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      modalVisible: false,
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
      workTypeList: [],
    };
  },
  //方法集合
  methods: {
    init() {},
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      if (isEdit) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
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
    handleSubmit(isEdit) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          console.log("Received values of form: ", values);
          let url = "";
          console.log(isEdit);
          if (isEdit) {
            url = BLACKLISTUPDATE;
          } else {
            url = BLACKLISTADD;
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
