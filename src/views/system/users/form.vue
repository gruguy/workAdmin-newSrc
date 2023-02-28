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
          <a-col :span="12">
            <a-form-item label="用户名">
              <a-input
                placeholder="请输入用户名"
                v-decorator="[
                  'userName',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="所属部门">
              <a-tree-select
                placeholder="请选择所属部门"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="orgList"
                tree-default-expand-all
                v-decorator="[
                  'orgIds',
                  {
                    initialValue: 1,
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
              <a-input v-decorator="['userId']"></a-input>
            </a-form-item>
            <a-form-item label="登录名">
              <a-input
                placeholder="请输入登录名"
                v-decorator="[
                  'userLoginname',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录名',
                      },
                    ],
                  },
                ]"
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="登录密码">
              <!-- 修改 -->
              <a-input-password
                v-if="isEdit"
                placeholder="修改密码，不修改留空"
                v-decorator="['userPassword']"
              ></a-input-password>
              <!-- 新增 -->
              <a-input-password
                v-if="!isEdit"
                placeholder="请输入密码"
                v-decorator="[
                  'userPassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入登录密码',
                      },
                    ],
                  },
                ]"
              ></a-input-password>
            </a-form-item>
          </a-col>

          <!-- <a-col :span="12">
          <a-form-item label="角色">
            <a-select
              placeholder="请选择角色"
              mode="multiple"
              v-decorator="[
                'roleIds',
                { rules: [{ required: true, message: '请选择角色' }] },
              ]"
            >
              <a-select-option v-for="item in roleList" :key="item.roleId">
                {{ item.roleName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
          <a-col :span="12">
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码" v-decorator="['pthone']">
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="性别">
              <a-select placeholder="请选择性别" v-decorator="['gender']">
                <a-select-option key="1">男</a-select-option>
                <a-select-option key="2">女</a-select-option>
                <a-select-option key="3">未知</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { SYSORGSLIST, SYSROLELIST, SYSUSERSUPDATE, SYSUSERSADD } from "@/api";
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
      roleList: [],
      spinning: true,
    };
  },
  props: ["orgId"],
  //方法集合
  methods: {
    getOrgList() {
      this.spinning = true;
      this.$axios
        .get(SYSORGSLIST, { params: { ids: this.orgId } })
        .then((res) => {
          const arr = [];
          this.orgList = this.initRes(res.value, arr);
          this.spinning = false;
        });
    },
    getRoleList() {
      this.$axios.get(SYSROLELIST).then((res) => {
        this.roleList = res.value;
      });
    },
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
    changeFOrg(e) {
      this.soFname = this.orgList.find((item) => item.soId == e).soBname;
    },
    openModal(isEdit, data) {
      console.log(data);
      this.modalVisible = true;
      this.form.resetFields();
      //获取部门列表
      this.getOrgList();
      // 获取角色列表
      this.getRoleList();
      this.$nextTick(() => {
        if (isEdit) {
          // 编辑
          this.isEdit = true;
          this.formTitle = "编辑";
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          params.userPassword = "";
          if (!params.roleIds) {
            delete params.roleIds;
          }
          this.form.setFieldsValue(params);
        } else {
          console.log(this.orgId, "haha");
          // 新增
          this.formTitle = "新增";
          this.isEdit = false;
          // if (data && typeof data == "string") {
          let params = {};
          params.orgIds = this.orgId;
          this.form.setFieldsValue(params);
          console.log(this.form);
          // }
        }
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
            url = SYSUSERSUPDATE;
          } else {
            url = SYSUSERSADD;
          }
          console.log(url);
          values = {
            ...values,
            orgIds: [values.orgIds],
            soFname: this.soFname,
          };
          console.log(values);

          this.$axios.post(url, values).then((res) => {
            console.log(res);
            this.confirmLoading = false;
            let type = res.code == 1 ? "success" : "error";
            this.$message[type](res.msg);
            if (res.code == 1) {
              this.modalVisible = false;
              this.$emit("loadData", { orgId: this.orgId });
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
