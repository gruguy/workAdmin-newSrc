<template>
  <a-spin :spinning="spinning">
    <div class="white-bg-wrapper">
      <breadcrumb>
        <a-button type="default" @click="goback"
          ><a-icon type="arrow-left" />返回</a-button
        >
      </breadcrumb>
      <!-- 主要信息 -->
      <div class="gru-panel gru-panel-no-header">
        <div class="gru-panel-content">
          <div class="header-status-warp">
            <h3 class="header-status-title">{{ dataInfo.personalName }}</h3>
            <div class="header-status time">
              <a-icon type="clock-circle" />
              创建时间：{{ dataInfo.createdTime }}
            </div>
            <div
              :class="[
                'header-status-bar',
                dataInfo.auditingState == 1 ? 'finished' : 'unfinished',
              ]"
            >
              <div
                :class="[
                  'gru-status-bar',
                  dataInfo.auditingState == 1
                    ? 'gru-status-bar-finished'
                    : 'gru-status-bar-unfinished',
                ]"
              >
                <div class="gru-status-bar-content">
                  <div
                    :class="[
                      'status-dot status-processing',
                      dataInfo.auditingState == 1 ? 'finished' : 'unfinished',
                    ]"
                  ></div>
                  <div class="status-val">
                    {{ dataInfo.auditingState == 1 ? "已审核" : "待审核" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gru-panel">
        <div class="gru-panel-header clearfix">
          <div class="gru-panel-header-title">
            <div>
              个人信息
              <span class="gru-panel-header-description"></span>
            </div>
          </div>
          <div class="gru-panel-header-extra"></div>
        </div>
        <div class="gru-panel-content">
          <div class="gru-form-grid-bordered">
            <a-row>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="手机号">
                  <div>
                    <span class="left">{{ dataInfo.personalPhone }}</span>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="身份证号">
                  <div>
                    <span class="left">{{ dataInfo.personalId }}</span>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="性别">
                  <div>
                    <span class="left">{{
                      dataInfo.personalSex == 0 ? "男" : "女"
                    }}</span>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="工种">
                  <div>
                    <span class="left">{{ dataInfo.workTypeName }}</span>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="年龄">
                  <div>
                    <span class="left">{{ dataInfo.age }}</span>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="12" class="gru-form-grid-col-bordered">
                <a-form-item label="所属部门">
                  <div>
                    <span class="left">{{ dataInfo.orgName || "--" }}</span>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { smartMixin } from "@/utils/mixins.js";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "照片",
    dataIndex: "personalImage",
    align: "center",
    key: "personalImage",
    width: "120px",
    scopedSlots: { customRender: "personalImage" },
  },
  {
    title: "姓名",
    dataIndex: "personalName",
    width: "120px",
    key: "personalName",
  },
  {
    title: "年龄",
    dataIndex: "age",
    align: "center",
    width: "80px",
    key: "age",
  },
  {
    title: "性别",
    dataIndex: "personalSex",
    key: "personalSex",
    width: "80px",
    align: "center",
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
  {
    title: "手机号",
    dataIndex: "personalPhone",
    key: "personalPhone",
  },
  {
    title: "身份证号",
    dataIndex: "personalId",
    width: "180px",
    key: "personalId",
  },
  {
    title: "状态",
    dataIndex: "auditingState",
    key: "auditingState",
    scopedSlots: { customRender: "auditingState" },
  },
  {
    title: "工种",
    dataIndex: "workTypeName",
    type: "hide",
  },
  // {
  //   title: "部门",
  //   dataIndex: "deptName",
  //   key: "deptName",
  //   type: "hide",
  //   align: "center",
  //   scopedSlots: { customRender: "deptName" },
  // },
  {
    title: "操作",
    key: "action",
    width: "240px",
    fixed: "right",
    align: "center",

    type: "hide",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [smartMixin],
  components: {
    Breadcrumb,
  },
  data() {
    return {
      dataInfo: {},
      spinning: true,
    };
  },
  mounted() {
    // this.queryParam = {
    //   page: 1,
    //   rows: 10,
    // };
    // this.getDataList();
    const id = this.$route.params.id;
    this.getDataInfo(id);
  },
  methods: {
    getDataInfo(id) {
      this.$axios
        .get("/personalInformationController/queryVO", {
          params: { id: id },
        })
        .then((res) => {
          this.dataInfo = res.value;
          this.spinning = false;
        });
    },
    setState(id, state) {
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
      this.examineTitle = msg;
      this.examineVisible = true;
      this.id = id;
      this.auditingState = state;
    },

    handleExamineOk() {
      this.confirmLoading = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateState(this.id, this.auditingState, values.auditingExplain);
        }
      });
    },
    /**
     * 拉入黑名单
     */
    showConfirmBlackList(id, cid) {
      this.$confirm({
        title: "加入黑名单",
        content: "确认将此人加入黑名单？",
        onOk: () => {
          this.$axios
            .post(SETPERSONBLACKLIST, { id: id, personalId: cid })
            .then((data) => {
              let msg = data.code === 1 ? data.msg : "操作失败";
              this.$message.info(msg);
              this.getDataList();
            });
        },
      });
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = PERSONALINFOUPDATE;
          } else {
            //新增
            path = PERSONALINFOADD;
          }
          this.confirmLoading = true;
          this.$axios
            .post(path, values)
            .then((res) => {
              let type = res.code == 1 ? "success" : "error";
              this.$message[type](res.msg);
              this.confirmLoading = false;
            })
            .catch((err) => {
              console.log(err);

              this.confirmLoading = false;
            });
        }
      });
    },
    openDialogAndOrder(data) {
      // this.modalVisible = true;
      if (data.isTrusted) {
        this.$refs.addForm.openModal();
      } else {
        this.$refs.addForm.openModal(true, data);
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      this.queryParam = {
        ...this.queryParam,
        // auditingState: 2,
      };
      this.loading = true;
      this.$axios
        .get(PERSONALINFOLIST, { params: this.queryParam })
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.value.rows;

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
    handleTableChange(pagination) {
      this.queryParam.pageNum = pagination.current;
      this.getDataList();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global.scss";
.avatar {
  width: 60px;
  height: 60px;
}
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
</style>
