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
      <a-transfer
        :titles="['待选权限', '已选权限']"
        :data-source="leftData"
        :list-style="{
          width: '300px',
          height: '300px',
        }"
        :target-keys="targetKeys"
        :render="renderItem"
        @change="handleChange"
      />
    </a-spin>
  </a-modal>
</template>

<script lang="jsx">
import { SYSROLELIST, SYSUSERSUPDATE, SAVEUSERROLES } from "@/api";
import difference from "lodash/difference";
const leftTableColumns = [
  {
    dataIndex: "title",
    title: "Name",
  },
  {
    dataIndex: "description",
    title: "Description",
  },
];
const rightTableColumns = [
  {
    dataIndex: "title",
    title: "Name",
  },
];
export default {
  data() {
    //这里存放数据
    return {
      spinning: true,
      modalVisible: false,
      modalW: "700px",
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      confirmLoading: false,
      formTitle: "授予权限",
      score: 0,
      isEdit: false,
      orgList: [],
      roleList: [],
      leftData: [],
      targetKeys: [],
      userId: "",
    };
  },
  //方法集合
  methods: {
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },
    renderItem(item) {
      const customLabel = <span class="custom-item">{item.title}</span>;

      return {
        label: customLabel, // for displayed item
        value: item.title, // for title and filter matching
      };
    },
    async getRoleList() {
      this.spinning = true;
      return this.$axios.get(SYSROLELIST).then((res) => {
        this.roleList = res.value;
        const targetKeys = [];
        const leftData = [];
        this.roleList.forEach((item) => {
          const data = {
            key: item.roleId,
            title: item.roleName,
            description: ``,
          };
          // if (data.chosen) {
          //   targetKeys.push(data.key);
          // }
          leftData.push(data);
        });
        this.leftData = leftData;
        this.targetKeys = targetKeys;
        this.spinning = false;
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
    async openModal(data) {
      console.log(data);
      this.modalVisible = true;
      // 获取角色列表
      await this.getRoleList();
      this.targetKeys = data.roleIds ? data.roleIds.split(",") : [];
      this.userId = data.userId;
    },

    handleOk() {
      this.handleSubmit();
    },

    handleModalCancel() {
      this.modalVisible = false;
    },
    handleSubmit() {
      this.confirmLoading = true;
      const params = {
        userId: this.userId,
        roleIds: this.targetKeys.join(","),
      };
      this.$axios.post(SAVEUSERROLES, params).then((res) => {
        console.log(res);
        this.confirmLoading = false;
        let type = res.code == 1 ? "success" : "error";
        this.$message[type](res.msg);
        if (res.code == 1) {
          this.modalVisible = false;
          this.$emit("loadData");
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
