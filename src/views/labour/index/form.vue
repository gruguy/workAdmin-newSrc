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
            <a-input v-decorator="['manageId']"></a-input>
          </a-form-item>
          <a-form-item
            label="项目名称"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              placeholder="请输入项目名称"
              v-decorator="[
                'manageName',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            multiple
            label="劳务类型"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              placeholder="请选择所需工种"
              v-decorator="[
                'labourTypeId',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
              <a-select-option
                :key="item.labourId"
                v-for="item in labourTypeList"
                >{{ item.labourName }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="项目周期"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              :min="1"
              style="width: 100%"
              placeholder="请输入项目工期的天数"
              v-decorator="[
                'manageCycle',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            multiple
            label="工种"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              mode="multiple"
              placeholder="请选择所需工种"
              v-decorator="[
                'typeWorkInfo',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
              <a-select-option
                :key="item.workTypeName"
                v-for="item in workTypeList"
                >{{ item.workTypeName }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="薪资标准"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              placeholder="请输入薪资标准"
              style="width: 100%"
              v-decorator="[
                'salaryStandard',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { LABOURADD, LABOURUPDATE, WORKTYPELISTALL } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      modalVisible: false,
      modalW: "600px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      workTypeName: "",
      workTypeList: [],
      labourTypeList: []
    };
  },
  //方法集合
  methods: {
    init() {
      // this.getTypeList();
    },
    getLabourList() {
      this.$axios.get("/labourTypeController/getListprams").then(res => {
        this.labourTypeList = res.value;
      });
    },
    openModal(isEdit, data) {
      this.getTypeList();
      this.getLabourList();
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
          params.typeWorkInfo = params.typeWorkInfo.split(",");
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
            url = LABOURUPDATE;
          } else {
            url = LABOURADD;
          }
          console.log(url);
          values = {
            ...values,
            typeWorkInfo: values.typeWorkInfo.join(",")
          };
          console.log(values);

          this.$axios.post(url, values).then(res => {
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
    getTypeList() {
      this.$axios.get(WORKTYPELISTALL).then(res => {
        if (res.code == 1) {
          this.workTypeList = res.value;
          console.log(this.workTypeList);
        }
      });
    },
    workTypeChange(e) {
      this.workTypeName = this.workTypeList.find(
        item => item.id === e
      ).workTypeName;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  }
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
