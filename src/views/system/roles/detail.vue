<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 14:25:30
 * @LastEditTime: 2022-09-16 17:03:19
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="角色菜单权限"
    placement="right"
    width="300"
    :closable="true"
    :visible="visible"
    @close="onClose"
  >
    <div :class="['content', spinning ? 'spinning' : '']">
      <a-spin :spinning="spinning">
        <a-tree
          v-if="treeData && treeData.length"
          v-model="checkedKeys"
          checkable
          :defaultExpandAll="true"
          :auto-expand-parent="autoExpandParent"
          :expanded-keys="expandedKeys"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          @expand="onExpand"
          @check="onCheck"
        />
      </a-spin>
    </div>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button :loading="setLoading" type="primary" @click="setModule">
        确认
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import CommonLoading from "@/components/Loading";
import { SYSMODULELIST, SYSROLESMODULESSAVE, SYSROLESMODULES } from "@/api";
export default {
  data() {
    return {
      spinning: true,
      autoExpandParent: true,
      visible: false,
      setLoading: false,
      roleId: "",
      treeData: [],
      allKeys: [],
      checkedKeys: [],
      expandedKeys: [],
      selectedKeys: [],
    };
  },
  watch: {
    checkedKeys(val) {
      // console.log("onCheck", val);
      // setTimeout(() => {
      //   this.$refs.commonLoading.hideLoading();
      // }, 300);
    },
  },
  components: {},

  computed: {},

  methods: {
    setModule() {
      this.spinning = true;
      this.$axios
        .post(SYSROLESMODULESSAVE, {
          roleId: this.roleId,
          content: this.selectedKeys.join(","),
        })
        .then((res) => {
          if (res && res.code == 1) {
            this.$message.success(res.msg);
            this.visible = false;
          } else {
            this.$message.error(res.msg);
          }
          setTimeout(() => {
            this.spinning = false;
          }, 2000);
        });
    },
    async getRoleModules() {
      this.spinning = true;
      await this.$axios
        .get(SYSROLESMODULES, {
          params: {
            roleId: this.roleId,
          },
        })
        .then((res) => {
          this.checkedKeys = res.value;
        });
    },
    getDataList() {
      this.spinning = true;
      this.$axios
        .get(SYSMODULELIST, {
          params: this.queryParam,
        })
        .then(async (res) => {
          if (res.code === 1) {
            this.treeData = this.initRes(res.value, []);
            this.expandedKeys = this.allKeys;
            await this.getRoleModules();
            setTimeout(() => {
              this.spinning = false;
            }, 1000);
          } else {
            this.treeData = [];
          }
        });
    },

    initRes(res, temp) {
      // console.log(temp);
      res &&
        res.length &&
        res.forEach((item, index) => {
          this.allKeys.push(item.moduleId);
          temp.push({
            key: item.moduleId,
            value: item.moduleId,
            title: item.moduleName,
          });
          if (item.children) {
            temp[index].children = [];
            this.initRes(item.children, temp[index].children);
          }
        });

      // console.log(temp);
      return temp;
    },
    showDetail(data) {
      this.visible = true;
      this.roleId = data.roleId;
      this.$nextTick(() => {
        // this.$refs.commonLoading.showLoading();
        this.getDataList();
      });
    },
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys, info) {
      console.log("onCheck", info);
      console.log(info.halfCheckedKeys);
      this.selectedKeys = checkedKeys.concat(info.halfCheckedKeys);
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      console.log(info.halfCheckedKeys);
      this.selectedKeys = selectedKeys.concat(info.halfCheckedKeys);
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  &.spinning {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.userInfo {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  // justify-content: center;
  .infos {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 18px;
      font-weight: bold;
    }
    .gender {
      font-size: 14px;
      color: #666;
    }
  }
}
::v-deep .ant-card-head {
  padding-left: 0;
}
::v-deep .ant-drawer-body {
  height: calc(100% - 110px);
  overflow: hidden;
}
.imglist {
  display: flex;
  margin: -10px;
  img {
    margin: 10px;
    width: 80px;
    height: 80px;
  }
}
.ant-tree {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
}
</style>
