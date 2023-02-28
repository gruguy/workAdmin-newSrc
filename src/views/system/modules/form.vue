<template>
  <a-modal
    :title="formTitle"
    :visible="modalVisible"
    :confirmLoading="confirmLoading"
    :width="modalW"
    @ok="handleOk"
    @cancel="handleModalCancel"
  >
    <a-spin tip="数据加载中" :spinning="spinning">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="上级菜单">
              <a-tree-select
                placeholder="为空时为添加一级菜单"
                tree-default-expand-all
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="orgList"
                v-decorator="['fmoduleId']"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item label="菜单类型">
              <a-radio-group
                @change="changeMenuType"
                v-decorator="['functionType']"
              >
                <a-radio value="1"> 目录 </a-radio>
                <a-radio value="2"> 菜单 </a-radio>
                <a-radio value="3"> 按钮 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="functionType != 3">
            <a-form-item label="菜单图标">
              <icon-list-pop ref="iconListPop" @sendIcon="sendIcon">
                <a-input
                  v-decorator="['moduleIcon']"
                  readOnly
                  @click="chooseIcon"
                  :initialValue="icon.name"
                >
                  <!-- <icon-font
                  v-if="icon && icon.icon"
                  slot="prefix"
                  :type="icon.icon"
                /> -->
                </a-input>
              </icon-list-pop>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item hidden>
              <a-input v-decorator="['moduleId']"></a-input>
            </a-form-item>
            <a-form-item label="菜单名称">
              <a-input
                v-decorator="[
                  'moduleName',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权限字符">
              <a-input v-decorator="['moduleUid']"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="functionType != 3">
            <a-form-item label="菜单排序">
              <a-input-number
                style="width: 100%"
                v-decorator="[
                  'moduleOrder',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="functionType != 3">
            <a-form-item label="路由地址">
              <a-input
                v-decorator="[
                  'moduleUrl',
                  { rules: [{ required: true, message: '请输入...' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <template v-if="functionType == 2">
            <a-col :span="12">
              <a-form-item label="组件路径">
                <a-input v-decorator="['modulePath']"> </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="路由参数">
                <a-input v-decorator="['sign']"> </a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="12" v-if="functionType != 3">
            <a-form-item label="菜单展示">
              <a-radio-group v-decorator="['moduleShow']">
                <a-radio :value="1"> 展示 </a-radio>
                <a-radio :value="0"> 隐藏 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="functionType != 3">
            <a-form-item label="菜单状态">
              <a-radio-group v-decorator="['status']">
                <a-radio :value="1"> 正常 </a-radio>
                <a-radio :value="0"> 停用 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { SYSMODULEADD, SYSMODULEUPDATE, SYSMODULELIST } from "@/api";
import IconListPop from "@/components/Icon";
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3229540_5oo0fvhcpos.js",
});
export default {
  components: {
    IconListPop,
    IconFont,
  },
  data() {
    //这里存放数据
    return {
      spinning: true,
      icon: {},
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
      functionType: 1,
    };
  },
  //方法集合
  methods: {
    sendIcon(icon) {
      console.log(icon);
      this.form.setFieldsValue({
        moduleIcon: icon.name,
      });
    },
    chooseIcon() {
      this.$refs.iconListPop.show();
    },
    initRes(res, temp) {
      res &&
        res.length &&
        res.forEach((item, index) => {
          temp.push({
            key: item.moduleId,
            value: item.moduleId,
            title: item.moduleName,
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
    changeFOrg(e) {
      this.soFname = this.orgList.find((item) => item.soId == e).soBname;
    },
    async openModal(isEdit, data) {
      console.log(data, "qqqqqqqqqq");
      this.modalVisible = true;
      this.spinning = true;

      this.$nextTick(async () => {
        this.form.resetFields();
        const arr = [];
        const res = await this.$axios.get(SYSMODULELIST, {
          params: {
            appId: 1,
            moduleType: 1,
          },
        });
        console.log(res);
        this.orgList = this.initRes(res.value, arr);
        console.log("-----------------------------");
        if (isEdit) {
          console.log(data, "pppppp");
          // 编辑
          this.isEdit = true;
          this.formTitle = "编辑";
          let params = {};
          if (data && typeof data == "string") {
            this.isEdit = false;
            params.functionType = 1;
            this.formTitle = "新增";
            params.fmoduleId = data;
          } else {
            for (let key in data) {
              params[key] = data[key];
            }
            console.log(params);
          }
          this.functionType = params.functionType;
          this.form.setFieldsValue(params);
        } else {
          // 新增
          this.formTitle = "新增";
          this.isEdit = false;
          let params = {};
          params.functionType = 1;
          this.form.setFieldsValue(params);
        }
        this.spinning = false;
      });
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
            url = SYSMODULEUPDATE;
          } else {
            url = SYSMODULEADD;
          }
          console.log(url);
          values = {
            ...values,
            moduleType: 1,
            saiId: 1,
          };
          if (!values.fmoduleId) {
            values.fmoduleId = "";
          }
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
    changeMenuType(e) {
      this.functionType = e.target.value;
      console.log(e.target.value);
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
