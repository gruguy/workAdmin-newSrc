<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-06-20 12:47:39
 * @LastEditTime: 2022-08-10 14:31:45
 * @Description: 组件创建
-->
<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-06-20 10:59:53
 * @LastEditTime: 2022-06-20 12:03:36
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
            <a-input v-decorator="['id']"></a-input>
          </a-form-item>
          <a-form-item
            label="价格设置"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
            :help="'价格不能大于管理员设置的' + maxPrice"
          >
            <a-input-number
              :max="maxPrice"
              style="width: 100%"
              v-decorator="[
                'salaryPrice',
                { rules: [{ required: true, message: '请输入...' }] },
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
import { SYSROLEADD, SYSROLEUPDATE } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      modalVisible: false,
      modalW: "500px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      roleTypeList: [
        {
          id: 1,
          name: "超级管理员",
        },
        {
          id: 2,
          name: "区域管理员",
        },
        {
          id: 3,
          name: "中队管理员",
        },
      ],
      adminPriceList: [],
      maxPrice: 1000,
    };
  },
  //方法集合
  methods: {
    init() {
      this.getAdminDataList();
    },
    getAdminDataList() {
      this.loading = true;
      this.$axios
        .get("/adminSalarySetController/getAdvancedQuery", {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            this.adminPriceList = res.value.rows;

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
          this.form.setFieldsValue(params);
          // 设置最大值
          this.adminPriceList.forEach((item) => {
            if (data.id == item.id) {
              this.maxPrice = Number(item.salaryPrice);
            }
          });
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
            url = "/salarySetController/update";
          } else {
            url = "/salarySetController/save";
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
