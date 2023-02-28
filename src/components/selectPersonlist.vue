<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-13 12:27:18
 * @LastEditTime: 2022-07-29 14:05:23
 * @Description: 组件创建
-->
<template>
  <a-modal
    title="选择人员"
    :visible="modalFullVisible"
    @ok="handleOk"
    @cancel="handleClose"
    dialogClass="fullModal"
  >
    <a-row class="wrapper">
      <a-col :span="8">
        <a-tree-select
          tree-default-expand-all
          style="width: 100%"
          placeholder="请选择所属机构"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="orgList"
          @select="selectOrg"
          v-decorator="[
            'soId',
            {
              initialValue: ['农业管理部门'],
              rules: [
                {
                  required: true,
                  message: '请选择上级部门',
                },
              ],
            },
          ]"
        />
      </a-col>
    </a-row>

    <person-list ref="personlistRef" @ok="getData"></person-list>
  </a-modal>
</template>

<script>
import { SYSORGSLIST } from "@/api";
import personList from "./personlist.vue";
export default {
  components: {
    personList,
  },
  data() {
    return {
      modalFullVisible: false,
      selectedKeys: [],
      selectedList: [],
      orgList: [],
      queryParam: {},
      orgId: "",
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    selectOrg(value) {
      this.orgId = value;
      console.log(this.orgId);
      this.$refs.personlistRef.loadData(this.orgId);
    },
    getDataList() {
      this.loading = true;
      this.queryParam.soFId = 1;
      this.$axios
        .get(SYSORGSLIST, {
          params: this.queryParam,
        })
        .then((res) => {
          const temp = res.value;
          const arr = [];
          this.orgList = this.initRes(temp, arr);
          this.loading = false;
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
    showModal(keys) {
      console.info(keys);
      this.modalFullVisible = true;
      this.$nextTick(() => {
        this.$refs.personlistRef.initKeys(keys);
      });
    },
    handleOk() {
      console.log(this.selectedKeys);
      this.$emit("ok", this.selectedKeys);
      this.modalFullVisible = false;
    },
    handleClose() {
      this.modalFullVisible = false;
    },
    getData(keys, list) {
      console.log(keys);
      this.selectedKeys = keys;
      this.selectedList = list;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .fullModal {
  width: 100% !important;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: none !important;
  width: auto;
  .ant-modal-content {
    width: 100vw;
    overflow: hidden;
    .ant-modal-body {
      height: calc(100vh - 55px);
    }
  }
  .ant-modal-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
}
.wrapper {
  padding: 0 0 20px 0;
}
</style>
