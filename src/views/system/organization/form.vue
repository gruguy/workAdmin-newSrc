<template>
  <a-modal
    :title="formTitle"
    :visible="modalVisible"
    :confirmLoading="confirmLoading"
    :width="modalW"
    @ok="handleOk"
    @cancel="handleModalCancel"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="上级部门">
              <a-tree-select
                tree-default-expand-all
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="orgList"
                v-decorator="[
                  'soFId',
                  {
                    initialValue: ['集团公司'],
                    rules: [
                      {
                        required: true,
                        message: '请选择上级部门',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item hidden>
              <a-input v-decorator="['soId']"></a-input>
            </a-form-item>
            <a-form-item label="机构名称">
              <a-input
                v-decorator="[
                  'soBname',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="机构状态">
              <a-radio-group
                v-decorator="[
                  'soStatus',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
                <a-radio :value="1"> 正常 </a-radio>
                <a-radio :value="0"> 禁用 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="排序">
              <a-input-number
                style="width: 100%"
                v-decorator="[
                  'soOrder',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入排序数字，数字越小越靠前',
                      },
                    ],
                  },
                ]"
              >
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="水稻亩数">
              <a-input-number style="width: 100%" v-decorator="['soFname']">
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="小麦亩数">
              <a-input-number style="width: 100%" v-decorator="['soLogo']">
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="是否分场">
              <a-radio-group v-decorator="['soFspell']">
                <a-radio :value="1"> 是 </a-radio>
                <a-radio :value="0"> 否 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人">
              <a-input
                v-decorator="[
                  'personInCharge',
                  { rules: [{ message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话">
              <a-input
                v-decorator="['phone', { rules: [{ message: '请输入...' }] }]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="关联部门">
              <a-tree-select
                tree-default-expand-all
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="orgList"
                v-decorator="['soCode']"
              />
            </a-form-item>
          </a-col>
          <!-- telAreaCode -->
          <a-col :span="12">
            <a-form-item label="种植类型">
              <a-select style="width: 100%" v-decorator="['telAreaCode']">
                <a-select-option v-for="item in plantTypeList" :key="item.id">{{
                  item.plantName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="机构地址">
              <a-textarea
                multiple
                v-decorator="[
                  'soAddress',
                  { rules: [{ message: '请输入...' }] },
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { SYSORGSADD, SYSORGSUPDATE } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      modalVisible: false,
      modalW: "600px",
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      orgList: [],
      soFname: "",
      value: "",
      spinning: true,
      plantTypeList: [],
    };
  },
  //方法集合
  methods: {
    init() {},
    initRes(res, temp) {
      console.log(temp);
      res &&
        res.length &&
        res.forEach((item, index) => {
          temp.push({
            key: item.soId,
            value: item.soId,
            title: item.soBname,
            children: [],
          });
          // item.key = item.soId;
          // item.value = item.soId;
          // item.title = item.soBname;
          if (item.children) {
            this.initRes(item.children, temp[index].children);
          }
        });
      return temp;
    },
    openModal(list, isEdit, data) {
      this.spinning = true;
      this.modalVisible = true;
      this.getPlantTypeList();
      this.form.resetFields();
      // 獲取機構列表
      const arr = [];
      this.orgList = this.initRes(list, arr);
      console.log("-----------------------------");
      console.log(JSON.stringify(this.orgList));
      this.$nextTick(() => {
        if (isEdit) {
          // 编辑
          this.isEdit = true;
          this.formTitle = "编辑";
          let params = {};
          if (data && typeof data == "string") {
            this.isEdit = false;
            this.formTitle = "新增";
            params.soFId = data;
          } else {
            for (let key in data) {
              params[key] = data[key];
            }
          }
          setTimeout(() => {
            this.form.setFieldsValue(params);
            this.spinning = false;
          }, 300);
        } else {
          // 新增
          this.formTitle = "新增";
          this.isEdit = false;
          if (data && typeof data == "string") {
            let params = {};
            params.soFId = data;
            this.form.setFieldsValue(params);
            console.log(this.form);
          }

          this.spinning = false;
        }
      });
    },

    handleOk() {
      this.handleSubmit(this.isEdit);
    },
    getPlantTypeList() {
      this.$axios.get("/plantTypeInfoController/getListprams").then((res) => {
        this.plantTypeList = res.value;
      });
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
            url = SYSORGSUPDATE;
          } else {
            url = SYSORGSADD;
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
::v-deep .ant-form-item-label {
  font-weight: bold;
  float: left;
  width: 80px;
}
::v-deep .ant-form-item-control-wrapper {
  width: calc(100% - 80px);
  float: left;
}
</style>
