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
              label="查询月份"
            >
              <a-input
                type="hidden"
                v-decorator="['clockTime']"
                placeholder="请输入用工时间"
              />
              <a-month-picker @change="onDateChange" placeholder="请搜索时间" />
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
        :rowKey="(record) => record.id"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 440 + 120 * getMonthDay(clockTime) }"
      >
        <template slot="faceImg" slot-scope="text, record">
          <a-avatar shape="square" :size="64" icon="user" :src="text" />
        </template>
        <template slot="record" slot-scope="text, record">
          <div ref="record-time-wrapper" class="record-time-wrapper">
            <div class="record-time" v-for="i in getMonthDay(clockTime)">
              <div class="title">{{ filterDate(i) }}</div>

              <div class="cont">
                <template
                  v-for="item in formatTimeArray(record.clockDateStart)"
                >
                  <template
                    class="timezone"
                    v-if="item.time.substring(9, 10) == i - 1"
                  >
                    <template v-for="(it, i) in item.name">
                      <span class="item">
                        <span v-if="it[0] == '上班'">
                          <a-icon class="work" type="arrow-up"></a-icon>
                        </span>
                        <span v-if="it[0] == '下班'">
                          <a-icon class="workoff" type="arrow-down"></a-icon>
                        </span>
                        <span class="name">{{ [it[0]] + it[1] }}</span>
                      </span>
                    </template>
                  </template>
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import moment from "moment";
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
    title: "时长统计（天）",
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
    this.getClockMonth();
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
      this.queryParamSearch.soFId = 1;
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
    getClockMonth(date) {
      let date1 = date ? new Date(date) : new Date();
      this.clockTime =
        date1.getMonth() + 1 < 10
          ? date1.getFullYear() + "-" + "0" + (date1.getMonth() + 1)
          : date1.getFullYear() + "-" + (date1.getMonth() + 1);
      this.queryParam = {
        page: 1,
        rows: 10,
        clockTime: this.clockTime,
      };
      this.getDataList();
    },
    getMonthDay(clockTime) {
      let clockTimeArr = clockTime.split("-");
      let days = new Date(clockTimeArr[0], clockTimeArr[1], 0).getDate();
      console.log(days);
      return days;
    },
    formatHour(hour) {
      if (hour.startsWith("0")) {
        alert(222);
        hour = hour.substring(1, 1);
      }
      console.log(Number(hour));
      return Number(hour);
    },
    formatTimeArray(timeString) {
      const temp = [];
      let arr = timeString.split("?");
      arr.forEach((item) => {
        // item = JSON.parse(item);
        item = item.split("|");
        console.log(item);
        const name = item.filter((v, i) => i !== 0);
        let nameArr = [];
        name.forEach((item) => {
          nameArr.push(JSON.parse(item));
        });
        console.log(nameArr);
        temp.push({
          time: item[0],
          name: nameArr,
        });
      });
      console.log("pppppppppppp");
      console.log(temp);
      return temp;
    },
    onDateChange(date, dateString) {
      console.log(date, dateString);
      this.form.setFieldsValue({
        clockTime: dateString,
      });
      this.clockTime = dateString;
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
    filterDate(i) {
      return i;
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
    getDataList() {
      this.queryParam.empWorkType = 3;
      this.loading = true;
      this.$axios
        .get("/clockRecordController/getGroupByPersonalIdMonth", {
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
td {
  height: auto;
}
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
    // width: 240px;
    min-width: 80px;
    height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: solid 1px #f0f0f0;
      border-right: solid 1px #f0f0f0;
    }
    .cont {
      flex: 1;
      // min-height: 30px;
      height: 100px;
      border-right: solid 1px #f0f0f0;
      display: flex;
      align-items: center;
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
.item {
  // display: block;
  display: inline-block;
  margin-right: 20px;
}
</style>
