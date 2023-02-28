<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-16 11:04:13
 * @LastEditTime: 2022-09-01 16:04:22
 * @Description: 组件创建
-->
<template>
  <a-drawer
    title="详情信息"
    placement="right"
    width="800"
    :closable="true"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <div class="content">
      <div class="spin" v-if="spinning">
        <a-spin tip="加载中..." />
      </div>
      <div v-else>
        <a-list>
          <h3>基本信息</h3>
          <a-list-item
            ><b>申请名称：{{ detailData.appName }}</b></a-list-item
          >
          <!-- <a-list-item>工作内容：{{ detailData.empContents }}</a-list-item> -->
          <a-list-item
            >审批状态：
            <a-tag v-if="detailData.auditingState == 3" color="#f50">
              被拒绝
            </a-tag>
            <a-tag v-if="detailData.auditingState == 0" color="#2db7f5">
              待审批
            </a-tag>
            <a-tag v-if="detailData.auditingState == 1" color="#87d068">
              已完成
            </a-tag>
          </a-list-item>

          <a-list-item
            >用工类型：
            <a-tag v-if="detailData.empType == 1" color="blue"> 小时工 </a-tag>
            <a-tag v-if="detailData.empType == 2" color="blue"> 天工 </a-tag>
            <a-tag v-if="detailData.empType == 3" color="green"> 固定工 </a-tag>
            <a-tag v-if="detailData.empType == 4" ghost color="green">
              包工
            </a-tag>
            <!-- <a-tag v-if="detailData.auditingState == 2" color="#108ee9">
              已完成
            </a-tag> -->
          </a-list-item>

          <a-list-item
            >用工人数：{{ detailData.empPersonalCount || "--" }}</a-list-item
          >
          <a-list-item
            >用工时间：{{
              detailData.empTime + " 至 " + detailData.empTimeEnd
            }}</a-list-item
          >
          <a-list-item
            >种植类型：{{ detailData.plantTypeName || "--" }}</a-list-item
          >
          <a-list-item
            >项目经理：{{ detailData.projectManagerName || "--" }}</a-list-item
          >
          <a-list-item>所属机构：{{ detailData.orgName || "--" }}</a-list-item>
        </a-list>
        <!-- 审批流程展示 -->
        <div class="steps" v-if="examineList && examineList.length">
          <h3>审批进度</h3>
          <a-steps
            progress-dot
            direction="vertical"
            :current="1"
            status="process"
          >
            <a-step
              v-for="(item, index) in examineList"
              :key="index"
              :title="item.approveTime"
              :description="
                item.approvePersonalName +
                '审批' +
                filterState(item.approveState)
              "
            />
            <!-- +
                ('，意见为：' + item.approveDescribe
                  ? item.approveDescribe
                  : '暂无意见') -->
            <!-- <a-step title="审批中" description="分厂领导审批" />
          <a-step title="待审批" description="总公司领导审批" /> -->
          </a-steps>
          <!-- <a-steps :current="2" status="finish" v-else>
          <a-step title="完成" description="xadmin申请完成" />
          <a-step title="完成" description="分厂领导审批" />
          <a-step title="完成" description="总公司领导审批" />
        </a-steps> -->
        </div>
        <a-divider></a-divider>
        <a-card title="打卡记录" :bordered="false" style="width: 100%">
          <a-table
            :columns="columns"
            :dataSource="clockRecordVOList"
            bordered
            size="middle"
            :rowKey="(record) => record.appId"
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
                    ? item[1].substring(0, 17)
                    : item[1] || "--:--:--"
                }}
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
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
    width: "180px",
    key: "clockDateStart",
    scopedSlots: { customRender: "clockDateStart" },
  },
];
export default {
  data() {
    return {
      visible: false,
      spinning: true,
      info: {},
      detailData: {},
      examineList: [],
      clockRecordVOList: [],
      loading: false,
      columns,
    };
  },

  components: {},

  computed: {},

  methods: {
    transFormObj(str, data) {
      console.log(str.indexOf("|"), "sssssssssssss");
      if (str.indexOf("|") > -1) {
        str = str.replace(/"/gi, '"');
        str = str.replace(/\|/gi, ",");
        console.log(str, "str");
        return JSON.parse("[" + str + "]");
      } else {
        return [
          ["开始", data.clockDateStart != "NULL" ? data.clockDateStart : ""],
          [
            "结束",
            data.clockDateEnd != "NULL" && data.clockDateEnd
              ? data.clockDateEnd
              : "",
          ],
        ];
      }
    },
    filterState(state) {
      state = Number(state);
      let msg = "";
      switch (state) {
        case 1:
          //确认审批
          msg = "确认审批";
          break;
        case 2:
          // 完成审批
          msg = "完成审批";
          break;
        case 3:
          // 拒绝
          msg = "拒绝";
          break;
        default:
          msg = "未知错误";
      }
      return msg;
    },
    showDetail(data) {
      this.visible = true;
      this.spinning = true;
      this.info = data;
      this.initData(data.appId);
      this.getFlowData(data.appId);
    },
    initData(id) {
      this.$axios
        .get(
          `/appliactionEmploymentController/getAppliactionEmploymentDetail?appId=${id}`
        )
        .then((res) => {
          this.detailData = res.value;
          this.clockRecordVOList = res.value.clockRecordVOList;
          this.spinning = false;
        });
    },
    getFlowData(id) {
      this.$axios
        .get(`/examineApproveController/getListprams?applyId=${id}`)
        .then((res) => {
          console.log("res", res.value);
          this.examineList = res.value && res.value.reverse();
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
  height: calc(100vh - 100px);
  .spin {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: calc(100vh - 100px);
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
.imglist {
  display: flex;
  margin: -10px;
  img {
    margin: 10px;
    width: 80px;
    height: 80px;
  }
}
.ant-steps-dot .ant-steps-item-content,
::v-deep .ant-steps-item-content {
  width: 210px;
}
</style>
