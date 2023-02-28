<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 10:26:34
 * @LastEditTime: 2022-06-01 12:27:18
 * @Description: 组件创建
-->
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
            <a-input v-decorator="['applyId']"></a-input>
          </a-form-item>
          <a-form-item
            label="名称"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'applyName',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            hidden
            label="人员信息"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <!-- <a-input
              v-decorator="[
                'applyPersonnel',
                { rules: [{ required: true, message: '请输入...' }] }
              ]"
            >
            </a-input> -->
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="单价（小时）"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              style="width: 100%"
              v-decorator="[
                'applyMonovalent',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="描述"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-textarea
              rows="4"
              v-decorator="[
                'applyDescribe',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-divider></a-divider>
    <!-- 人员选择table -->
    <a-table
      :columns="columns"
      :data-source="personlist"
      :pagination="false"
      :loading="listLoading"
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="delItem(record)">删除</a>
      </span>
    </a-table>
    <a-divider></a-divider>
    <a-button
      class="ant-btn ant-btn-dashed"
      icon="plus"
      block
      @click="openPersonList"
      >选择人员</a-button
    >
    <person-list ref="personlist" @ok="getData"></person-list>
  </a-modal>
</template>

<script>
import { EMPLOYMENTADD, EMPLOYMENTUPDATE } from "@/api";
import personList from "@/components/selectPersonlist";
const columns = [
  {
    title: "姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
  {
    title: "部门",
    dataIndex: "deptName",
    key: "deptName",
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: {
    personList,
  },
  data() {
    //这里存放数据
    return {
      listLoading: false,
      columns,
      personlist: [],
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
      workTypeName: "",
      workTypeList: [],
      selectedKeys: [],
    };
  },
  //方法集合
  methods: {
    init() {
      // this.getTypeList();
    },
    getData(keys) {
      this.listLoading = true;
      this.selectedKeys = keys;
      // this.personlist = list;
      // 查询人员
      this.getPersonList(keys.join(","));
    },
    getPersonList(keys) {
      this.$axios
        .get("/appliactionTypeController/queryVO", {
          params: { ids: keys },
        })
        .then((res) => {
          this.selectedKeys = [];
          this.personlist = res.value;
          this.listLoading = false;
          this.personlist.forEach((item) => {
            this.selectedKeys.push(item.id);
          });
          console.log("this.selectedKeys", this.selectedKeys);
        });
    },
    openPersonList() {
      this.$refs.personlist.showModal(this.selectedKeys);
    },
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      if (isEdit) {
        this.listLoading = true;
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
        setTimeout(() => {
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          this.form.setFieldsValue(params);
        }, 300);
        // 查询人员
        this.getPersonList(data.applyPersonnel);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
        this.selectedKeys = [];
        this.personlist = [];
        this.form.resetFields();
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
            url = EMPLOYMENTUPDATE;
          } else {
            url = EMPLOYMENTADD;
          }
          values = {
            ...values,
            applyPersonnel: this.selectedKeys && this.selectedKeys.join(","),
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
    workTypeChange(e) {
      this.workTypeName = this.workTypeList.find(
        (item) => item.id === e
      ).workTypeName;
    },
    delItem(obj) {
      console.log(obj);
      this.personlist = this.personlist.filter((item) => item.id !== obj.id);
      this.selectedKeys = this.selectedKeys.filter((item) => item !== obj.id);
      console.log(this.selectedKeys);
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
