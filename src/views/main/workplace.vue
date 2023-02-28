<template>
  <div id="Workplace" style="margin-right: 12px">
    <!--quick-link-->
    <a-row :gutter="16" class="quick-link">
      <a-col :span="8">
        <div class="panel-wrapper">
          <div class="panel">
            <router-link to="/meetingroom/index">
              <div class="panel-content">
                <h2>采购申请审核代办</h2>
                <p>采购申请</p>
                <small>采购申请, 请处理</small>
              </div>
              <div class="icon-wrapper">
                <span class="iconfont icon-cubelifangti"></span>
              </div>
            </router-link>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="panel-wrapper">
          <div class="panel">
            <router-link to="/repair">
              <div class="panel-content">
                <h2>使用年限提醒</h2>
                <p>使用年限</p>
                <small>使用年限，请处理</small>
              </div>
              <div class="icon-wrapper">
                <span class="iconfont icon-layers"></span>
              </div>
            </router-link>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="panel-wrapper">
          <div class="panel">
            <router-link to="/clean">
              <div class="panel-content">
                <h2>资产数据统计</h2>
                <p>资产数据</p>
                <small>有新信息，请处理</small>
              </div>
              <div class="icon-wrapper">
                <span class="iconfont icon-tag"></span>
              </div>
            </router-link>
          </div>
        </div>
      </a-col>
    </a-row>
    <!--remain-->
    <a-skeleton :loading="loading" active>
      <a-row :gutter="16" class="remain">
        <a-col :span="12">
          <div class="panel-primary remain-list personInfo">
            <div class="panel-title">
              <span class="tit">领用审核</span>
            </div>
            <div class="panel-content">
              <vue-scroll :ops="ops">
                <ul>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">计算机领用待审核</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="panel-primary remain-list personInfo emergency">
            <div class="panel-title">
              <span class="tit">我的领用申请</span>
            </div>
            <div class="panel-content">
              <vue-scroll :ops="ops">
                <ul>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">笔记本领用申请</span>
                      <span class="pull-right state-danger">待处理</span>
                    </div>
                    <div class="bottom">2018/08/02</div>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="panel-primary remain-list personInfo tips">
            <div class="panel-title">
              <span class="tit">使用年限提醒</span>
            </div>
            <div class="panel-content">
              <vue-scroll :ops="ops">
                <ul>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>

                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <span class="iconfont icon-time"></span>
                      <span class="tit">人员信息补充待办人员信息补充待办</span>
                      <span class="pull-right">2018/08/02</span>
                    </div>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="remain-list">
            <div class="panel">
              <div class="title">
                <span class="tit">资产数据提醒</span>
              </div>
              <vue-scroll :ops="ops">
                <a-table
                  :columns="columns"
                  :dataSource="tableData"
                  size="middle"
                  :pagination="false"
                />
              </vue-scroll>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-skeleton>
  </div>
</template>

<script>
const columns = [
  {
    title: "类型",
    dataIndex: "type",
    align: "center",
  },
  {
    title: "总数",
    dataIndex: "total",
    align: "center",
  },
  {
    title: "借用",
    dataIndex: "outside",
    align: "center",
  },
  {
    title: "在库",
    dataIndex: "inside",
    align: "center",
  },
];
const data = [
  {
    key: "1",
    type: "资产数据类型1",
    total: 80,
    outside: 30,
    inside: 50,
  },
  {
    key: "2",
    type: "资产数据类型2",
    total: 80,
    outside: 30,
    inside: 50,
  },
  {
    key: "3",
    type: "资产数据类型3",
    total: 80,
    outside: 30,
    inside: 50,
  },
  {
    key: "4",
    type: "资产数据类型4",
    total: 80,
    outside: 30,
    inside: 50,
  },
  {
    key: "5",
    type: "资产数据类型5",
    total: 80,
    outside: 30,
    inside: 50,
  },
];
export default {
  name: "Workplace",
  components: {},
  data() {
    return {
      loading: false,
      monthData: "",
      remainListData: [],
      columns,
      tableData: data,
      ops: {
        vuescroll: {},
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
        rail: {},
        bar: {
          background: "#60b0fa",
        },
      },
    };
  },
  mounted() {
    // this.getRemainList()
  },
  methods: {
    toRemainDetail(data) {
      let urlList = [
        "/remain/remainMeeting/" + data.id,
        "/remain/remainRepair/" + data.id,
        "/remain/remainClean/" + data.id,
      ];
      let type = parseInt(data.type) - 1;
      this.$router.push({
        path: urlList[type],
        query: data.data,
      });
    },
    getRemainList() {
      this.$axios.get(this.GLOBAL.GETREMAINLISTALL, {}).then((res) => {
        if (res.data.code === 1) {
          this.remainListData = res.data.value.rows;
          console.log(this.remainListData);
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global.scss";
.quick-link {
  .ant-col-8 {
    .panel-wrapper {
      background-color: #fff;
      padding: 5px;
      transition: all 0.4s ease-in-out;
      &:hover {
        @include boxShadow;
      }
      .panel {
        height: 150px;
        // background: url("../@/assets/images/indexItemBg.png") center center no-repeat;
        background-size: cover;
        .panel-content {
          padding: 15px;
          h2 {
            font-size: 20px;
            color: #92a6ad;
          }
          p {
            font-size: 18px;
            color: #787878;
          }
          small {
            font-size: 12px;
            color: #97989a;
          }
        }
        .icon-wrapper {
          position: absolute;
          right: 40px;
          top: 20px;
          width: 50px;
          height: 50px;
          line-height: 50px;
          background: #ffb700;
          text-align: center;
          border-radius: 50%;
          .iconfont {
            font-size: 30px;
            /*font-weight: bold;*/
            color: #fff;
          }
        }
      }
    }
  }
}
.remain {
  margin-top: 16px;
  .remain-list {
    margin-bottom: 20px;
    background-color: #fff;
    @include boxShadow;
    padding: 16px;
    height: 400px;
    overflow: hidden;
    border-radius: 4px;
    &.personInfo {
      ul {
        li {
          padding-top: 10px;
          border-bottom: solid 1px #f1f1f1;
          .top {
            .iconfont {
              color: #00c598;
              margin-right: 10px;
            }
            .tit {
              color: #8d9393;
            }
            .state-danger {
              text-align: right;
              color: #f00;
            }
          }
          .bottom {
            text-align: right;
            color: #8d9393;
            padding-bottom: 10px;
          }
        }
      }
    }
    &.tips {
      ul {
        li {
          padding-bottom: 10px;
          .top {
            .iconfont {
              color: #0c89d9;
            }
          }
        }
      }
    }
    &.emergency {
      ul {
        li {
          .top {
            .iconfont {
              color: #fe3d4e;
            }
          }
        }
      }
    }
    .panel-content {
      height: 340px;
    }
    .panel {
      .title {
        height: 30px;
        .tit {
          font-size: 14px;
          font-weight: bold;
          color: #797979;
        }
        a {
          font-size: 14px;
          color: #8b918f;
        }
      }
      .panel-content {
        li {
          border-bottom: solid 1px #f0f0f0;
          padding: 10px 0;
          overflow: hidden;
          &:last-child {
            border-bottom: none;
          }
          .iconfont {
            color: #4ec699;
          }
          a {
            padding-left: 10px;
            color: #949a9a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .pull-right {
            text-align: right;
            .state {
              &.state-pending {
                color: #ff5977;
              }
            }
            .update-time {
              display: block;
              color: #8f9190;
              margin-top: 10px;
            }
          }
        }
        .chart01 {
          height: 360px;
        }
      }
    }
  }
}
</style>
