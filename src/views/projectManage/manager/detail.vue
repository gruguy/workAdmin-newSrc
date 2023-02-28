<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-08-29 12:17:33
 * @LastEditTime: 2022-09-13 15:18:14
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="今日打卡详情"
    placement="right"
    width="600"
    :closable="true"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <div class="content">
      <div class="userInfo">
        <div class="infos">
          <span class="name"
            >项目经理：{{ info.projectManagerName || "--" }}</span
          >
        </div>
      </div>
      <a-descriptions>
        <a-descriptions-item label="打卡日期">
          {{ info.clockStartTime.substring(0, 10) }}
        </a-descriptions-item>
        <a-descriptions-item label="用工项目">
          {{ info.empProjectName }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider></a-divider>
      <a-card title="打卡记录" :bordered="false" style="width: 100%">
        <a-table
          :columns="columns"
          :dataSource="tableData"
          bordered
          size="middle"
          :rowKey="(record) => record.id"
          :loading="loading"
        >
          <template slot="faceImg" slot-scope="text, record">
            <a-avatar shape="square" :size="64" icon="user" :src="text" />
          </template>
          <template slot="empWorkType" slot-scope="text, record">
            <a-tag color="green" v-if="text == 1">小时工</a-tag>
            <a-tag color="green" v-if="text == 2">天工</a-tag>
            <a-tag color="green" v-if="text == 3">固定工</a-tag>
            <a-tag color="blue" v-if="text == 5">项目经理</a-tag>
          </template>
          <template slot="clockDateStart" slot-scope="text, record">
            <div
              v-for="item in transFormObj(text, record)"
              style="margin-bottom: 5px"
            >
              <a-tag :color="item[0] == '上班' ? 'blue' : 'green'">{{
                item[0]
              }}</a-tag
              >{{
                item[1].length > 9
                  ? item[1].substring(0, 11)
                  : item[1] || "--:--:--"
              }}
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
  </a-drawer>
</template>

<script>
const columns = [
  {
    title: "照片",
    dataIndex: "faceImg",
    align: "center",
    key: "faceImg",
    width: "80px",
    type: "hide",
    scopedSlots: { customRender: "faceImg" },
  },
  {
    title: "姓名",
    dataIndex: "personalName",
    width: "80px",
    key: "personalName",
  },
  {
    title: "用工类型",
    dataIndex: "empWorkType",
    width: "80px",
    key: "empWorkType",
    scopedSlots: { customRender: "empWorkType" },
  },
  {
    title: "打卡记录",
    dataIndex: "clockDateStart",
    align: "center",
    width: "80px",
    key: "clockDateStart",
    scopedSlots: { customRender: "clockDateStart" },
  },
];
export default {
  data() {
    return {
      loading: true,
      visible: false,
      id: "",
      info: {},
      columns,
      tableData: [],
    };
  },

  components: {},

  computed: {},

  methods: {
    transFormObj(str, data) {
      // console.log(str);
      if (str.indexOf("|") > -1) {
        str = str.replace(/"/gi, '"');
        str = str.replace(/\|/gi, ",");
        console.log(str, "str");
        return JSON.parse("[" + str + "]");
      } else {
        return [
          ["开始", data.clockDateStart],
          ["结束", data.clockDateEnd && data.clockDateEnd],
        ];
      }
    },
    showDetail(data) {
      this.visible = true;
      this.loading = true;
      this.id = data.appId;
      this.info = data;
      console.log(this.info);
      this.initData();
    },
    initData() {
      this.$axios
        .get(
          `/projectManagerClockController/getClockRecordDetail?perEmpId=${
            this.id
          }&clockTime=${
            this.info.clockStartTime &&
            this.info.clockStartTime.substring(0, 10)
          }`
        )
        .then((res) => {
          this.tableData = res.value;
          this.loading = false;
        });
    },
    afterVisibleChange() {},
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20px;
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
.imglist {
  display: flex;
  margin: -10px;
  img {
    margin: 10px;
    width: 80px;
    height: 80px;
  }
}
</style>
