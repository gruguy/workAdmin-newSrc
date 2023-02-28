<template>
  <div class="white-bg-wrapper">
    <a-transfer
      :titles="['待选人员', '已选人员']"
      :data-source="tableData"
      :target-keys="targetKeys"
      :disabled="disabled"
      :show-select-all="false"
      @change="onChange"
    >
      <template
        slot="children"
        slot-scope="{
          props: {
            direction,
            filteredItems,
            selectedKeys,
            disabled: listDisabled,
          },
          on: { itemSelectAll, itemSelect },
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              itemSelectAll,
              itemSelect,
            })
          "
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :dataSource="filteredItems"
          bordered
          size="middle"
          :rowKey="(record) => record.id"
          :loading="loading"
          :pagination="false"
          @change="handleTableChange"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
          :custom-row="
            ({ id, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(id, !selectedKeys.includes(id));
                },
              },
            })
          "
        >
          <template slot="personalImage" slot-scope="text, record">
            <a-avatar shape="square" :size="40" icon="user" :src="text" />
          </template>
          <template slot="personalSex" slot-scope="text">
            <span v-if="text == '0'">男</span>
            <span v-else>女</span>
          </template>
        </a-table>
      </template>
    </a-transfer>
  </div>
</template>

<script>
import difference from "lodash/difference";
import { smartMixin } from "@/utils/mixins.js";
import { PERSONALINFOLIST, PERSONALINFODEL } from "@/api";

const leftColumns = [
  {
    title: "头像",
    dataIndex: "personalImage",
    key: "personalImage",
    width: "60px",
    align: "center",
    scopedSlots: { customRender: "personalImage" },
  },
  {
    title: "姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
  {
    title: "性别",
    dataIndex: "personalSex",
    key: "personalSex",
    type: "select",
    scopedSlots: { customRender: "personalSex" },
    dataList: [
      {
        name: "男",
        value: 0,
      },
      {
        name: "女",
        value: 1,
      },
    ],
  },
  // {
  //   title: "手机号",
  //   dataIndex: "personalPhone",
  //   key: "personalPhone"
  // },
  // {
  //   title: "身份证号",
  //   dataIndex: "personalId",
  //   key: "personalId"
  // },
  // {
  //   title: "工种",
  //   dataIndex: "workTypeName",
  //   type: "select",
  //   dataList: [
  //     {
  //       name: "棉农",
  //       value: 1,
  //     },
  //     {
  //       name: "司机",
  //       value: 2,
  //     },
  //   ],
  // },
  // {
  //   title: "部门",
  //   dataIndex: "deptName",
  //   key: "deptName",
  //   type: "hide",
  //   align: "center",
  //   scopedSlots: { customRender: "deptName" },
  // },
  // {
  //   title: "操作",
  //   key: "action",
  //   width: "240px",
  //   align: "center",
  //   type: "hide",
  //   scopedSlots: { customRender: "action" }
  // }
];

const rightColumns = [
  {
    title: "姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
];

export default {
  mixins: [smartMixin],
  components: {},
  data() {
    return {
      leftColumns,
      rightColumns,
      targetKeys: [],
      disabled: false,
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      currentIndex: 0,
      tableData: [],
      loading: false,
      pagination: null,
      queryParam: {},
      selectedRowKeys: [],
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
    };
    this.getDataList();
  },
  methods: {
    loadData(orgId) {
      this.queryParam.orgIds = orgId;
      this.getDataList();
    },
    initKeys(keys) {
      console.error(keys);
      this.targetKeys = keys;
    },
    onChange(nextTargetKeys, list, filteredItems) {
      console.log(nextTargetKeys, filteredItems);
      this.targetKeys = nextTargetKeys;
      this.$emit("ok", this.targetKeys);
    },
    handleImgOk() {},
    handleImgCancel() {
      this.modalImgVisible = false;
    },
    setQueryParam(values) {
      this.queryParam = {
        ...this.queryParam,
        ...values,
      };
      this.getDataList();
    },
    removeItem(index) {
      this.formItemArr.splice(index, 1);
    },
    showConfirmDeleteItem(id) {
      this.deleteItem(PERSONALINFODEL, PERSONALINFOLIST, id);
    },
    getDataList() {
      this.loading = true;
      this.$axios
        .get("/personalInformationController/getListprams", {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.value;

            this.loading = false;
          } else {
            this.loading = false;
            this.tableData = [];
          }
          this.tableData.forEach((item) => {
            item.key = item.id;
          });
        });
    },
    handleTableChange(pagination) {
      this.queryParam.pageNum = pagination.current;
      this.getDataList();
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global.scss";
.handleButtons {
  margin: 10px 0 20px;
}
.flow-wrapper {
  margin: 30px 0 0 50px;
}
.addItem {
  overflow: hidden;
  button {
    float: right;
  }
}
.addItems {
  height: 250px;
  overflow: auto;
}
.beBlock {
  overflow: hidden;
}
.deleteItem {
  position: relative;
  overflow: visible;
  button {
    position: absolute;
    right: 10px;
    top: -60px;
  }
}
::v-deep {
  .ant-modal-body {
    height: calc(100% - 180px);
  }
  .ant-transfer-list {
    max-height: 600px;
    overflow: auto;
  }
}
</style>
