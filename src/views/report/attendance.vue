<template>
  <div class="white-bg-wrapper">
    <Breadcrumb></Breadcrumb>
    <h2>{{ $route.meta.title }}</h2>
    <div id="components-form-demo-advanced-search" class="advanced-search">
      <a-form
        class="ant-advanced-search-form ant-form ant-form-inline"
        :form="form"
        @submit="handleSearch"
      >
        <a-row :gutter="24">
          <!-- 判断是否是全局管理员，若是添加 -->
          <template v-if="this.isAdmin">
            <a-col :sm="8">
              <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="所属机构"
              >
                <a-tree-select
                  tree-default-expand-all
                  style="width: 100%"
                  placeholder="请选择所属机构"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="orgList"
                  @select="selectOrg"
                  v-decorator="['orgId']"
                />
              </a-form-item>
            </a-col>
          </template>

          <!--  -->
          <a-col :sm="8">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="查询日期"
            >
              <a-input
                type="hidden"
                v-decorator="['clockTime']"
                placeholder="请输入用工时间"
              />
              <a-date-picker @change="onDateChange" placeholder="请搜索时间" />
            </a-form-item>
          </a-col>
          <a-col
            ref="initBtns"
            class="initBtns"
            :offset="isAdmin ? 0 : 8"
            :sm="8"
          >
            <span
              style="
                float: left;
                overflow: hidden;
                display: block;
                white-space: nowrap;
                line-height: 40px;
              "
            >
              <a-button html-type="submit" icon="search"> 搜索 </a-button>
              <a-button
                :style="{ marginLeft: '8px' }"
                icon="reload"
                @click="handleReset"
              >
                重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.prId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="faceImg" slot-scope="text, record">
          <a-avatar shape="square" :size="64" icon="user" :src="text" />
        </template>
        <template slot="record" slot-scope="text, record">
          <div class="record-time-wrapper">
            <div class="record-time">
              <!-- <div class="title">{{ filterTime(i) }}</div> -->

              <!-- <div class="cont" v-if="text.split(',')[i]"></div> -->
              <div class="cont">
                <template
                  v-for="item in formatTimeArray(record.clockDateStart)"
                >
                  <span class="timezone">
                    <span v-if="item.name == '上班'">
                      <a-icon class="work" type="arrow-up"></a-icon>
                    </span>
                    <span v-if="item.name == '下班'">
                      <a-icon class="workoff" type="arrow-down"></a-icon>
                    </span>
                    {{ item.name + item.time }}
                    <!-- <a-badge
                      color="#f00"
                      :text="item.name + item.time"
                    ></a-badge> -->
                  </span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import Breadcrumb from "../../components/Breadcrumb.vue";
import { SYSORGSLIST } from "@/api";

const columns = [
  {
    title: "打卡照片",
    dataIndex: "faceImg",
    align: "center",
    key: "faceImg",
    width: "120px",
    fixed: "left",
    type: "hide",
    scopedSlots: { customRender: "faceImg" },
  },
  {
    title: "姓名",
    width: "120px",
    dataIndex: "personalName",
    key: "personalName",
    fixed: "left",
  },
  {
    title: "打卡记录",
    dataIndex: "record",
    key: "record",
    type: "hide",
    scopedSlots: { customRender: "record" },
  },
  {
    title: "时长统计(小时)",
    dataIndex: "longTime",
    align: "center",
    key: "longTime",
    width: "200px",
    fixed: "right",
    type: "hide",
    scopedSlots: { customRender: "longTime" },
  },
];

export default {
  mixins: [smartMixin],
  components: {
    SeniorSearch,
    Breadcrumb,
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      clockTime: "",
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      currentIndex: 0,
      tableData: [],
      loading: false,
      confirmLoading: false,
      userId: "",
      pagination: {},
      queryParam: {},
      form: this.$form.createForm(this),
      isAdmin: false,
      orgId: "",
      orgList: [],
      queryParamSearch: {
        soId: "",
      },
    };
  },
  mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
    };
    this.getDataList();

    this.user = this.$store.state.user;
    this.isAdmin =
      this.user.username == ("xadmin" || "admin") ||
      Array.contains(this.user.roles, 1);
    this.getSoDataList();
  },
  methods: {
    selectOrg(value) {
      this.orgId = value;
      console.log(this.orgId);
    },
    getSoDataList() {
      this.queryParamSearch.ids = 1;
      this.$axios
        .get(SYSORGSLIST, {
          params: this.queryParamSearch,
        })
        .then((res) => {
          const temp = res.value;
          const arr = [];
          this.orgList = this.initRes(temp, arr);
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
          if (item.children) {
            this.initRes(item.children, temp[index].children);
          }
        });
      return temp;
    },
    formatHour(hour) {
      if (hour.startsWith("0")) {
        hour = hour.substring(1, 1);
      }
      console.log(Number(hour));
      return Number(hour);
    },
    formatTimeArray(timeString) {
      const temp = [];
      let arr = timeString.split("|");
      arr.forEach((item) => {
        item = JSON.parse(item);
        console.log(item);
        temp.push({
          time: item[1],
          name: item[0],
        });
      });
      console.log(temp);
      return temp;
    },
    onDateChange(date, dateString) {
      console.log(date, dateString);
      this.form.setFieldsValue({
        clockTime: dateString,
      });
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        const realValue = {};
        for (let item in values) {
          if (
            values[item] !== undefined &&
            values[item] !== null &&
            values[item] !== ""
          ) {
            if (
              typeof values[item] === "string" &&
              (values[item].indexOf("[") != -1 ||
                values[item].indexOf("]") != -1)
            ) {
              values[item] = encodeURI(values[item]);
            }

            if (values[item] instanceof Object) {
              if (
                item.indexOf("bcStart") > -1 ||
                item.indexOf("bcEnd") > -1 ||
                item.indexOf("bkTime") > -1
              ) {
                values[item] = moment(values[item]).format("YYYY-MM-DD");
              } else {
                values[item] = moment(values[item]).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
            }
          } else {
            values[item] = null;
          }
          realValue[item] = values[item];
        }
        console.log("error", error);
        console.log("Received values of form: ", values);
        if (!error) {
          this.setQueryParam(values);
        }
      });
    },
    handleReset() {
      this.form.resetFields();
    },
    filterTime(i) {
      if (i < 10) {
        return "0" + i + ":00";
      } else {
        return i + ":00";
      }
    },
    setQueryParam(values) {
      this.queryParam = {
        ...this.queryParam,
        ...values,
      };
      console.log(this.queryParam);
      this.getDataList();
    },
    removeItem(index) {
      this.formItemArr.splice(index, 1);
    },
    showConfirmDeleteItem(id) {
      this.deleteItem(
        "/bualarmtypeController/delete",
        "/bualarmtypeController/getAdvancedQuery.do",
        id
      );
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = "/bualarmtypeController/update.do";
          } else {
            //新增
            path = "/bualarmtypeController/save.do";
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
      this.modalVisible = true;
      if (!data.isTrusted) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "类型编辑";
        setTimeout(() => {
          this.form.setFieldsValue({
            sId: data.sId,
            sName: data.sName,
            sTel: data.sTel,
            sWorkType: data.sWorkType,
            sreport: data.sreport,
            sgender: data.sgender,
          });
        }, 300);
      } else {
        // 新增
        this.formTitle = "类型申请";
        this.isEdit = false;
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    getDataList() {
      // this.queryParam.clockTime = "2022-06-08";
      this.queryParam.empWorkType = 1;
      this.loading = true;
      this.$axios
        .get("/clockRecordController/getGroupByPersonalId", {
          params: this.queryParam,
        })
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
.handleButtons {
  margin: 20px 0;
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
  td {
    position: relative;
  }
  .ant-badge-status-text {
    font-size: 12px;
  }
}
.record-time-wrapper {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .record-time {
    min-width: 120px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      text-align: center;
      // line-height: 40px;
      // border-bottom: solid 1px #f0f0f0;
      // border-right: solid 1px #f0f0f0;
    }
    .cont {
      display: flex;
      align-items: center;
      flex: 1;
      // min-height: 30px;
      // border-right: solid 1px #f0f0f0;
      overflow: hidden;
    }
  }
}
.timezone {
  margin: 8px;
  line-height: 40px;
}
.work {
  color: rgb(11, 192, 101);
}
.workoff {
  color: rgb(14, 169, 207);
}
</style>
