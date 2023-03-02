<template>
  <div class="white-bg-wrapper">
    <breadcrumb> </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <!-- <senior-search :columns="columns" @ok="setQueryParam"></senior-search> -->
    <!--操作按钮组-->
    <div class="handleButtons">
      <span class="filter">
        <span class="title">种植类型:</span>
        <span class="item-wrapper">
          <a-button-group>
            <a-button
              v-for="(item, index) in plantTypeList"
              :key="item.id"
              @click="changeType(index, item.id)"
              :type="currentTypeIndex === index ? 'primary' : ''"
            >
              {{ item.plantName }}
            </a-button>
          </a-button-group>
        </span>
      </span>
      <a-button-group style="margin-right: 20px">
        <a-button
          :type="currentPriceTypeIndex == index ? 'primary' : ''"
          @click="changePriceType(index)"
          v-for="(item, index) in priceTypeList"
          :key="index"
        >
          {{ item }}
        </a-button>
        <!-- <a-button @click="changePriceType(2)">亩平均</a-button> -->
      </a-button-group>
      <a-button-group>
        <a-button
          :type="currentTimeTypeIndex == index ? 'primary' : ''"
          v-for="(item, index) in timeTypeList"
          @click="changeTimeType(index)"
          :key="index"
        >
          {{ item }}
        </a-button>
      </a-button-group>
      <a-date-picker
        v-if="currentTimeTypeIndex == 0"
        v-model="clockStartTimes"
        style="margin-left: 20px"
        format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        placeholder="选择日期"
        @change="dateChange"
      />
      <a-month-picker
        format="YYYY-MM"
        v-if="currentTimeTypeIndex == 1"
        v-model="clockStartTimes"
        style="margin-left: 20px"
        :disabled-date="disabledDate"
        placeholder="选择月份"
        @change="monthChange"
      />
    </div>
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.soId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: 1300 }"
      >
        <!-- soTotalAverage" : "soTotal -->
        <template slot="soTotalAverage" slot-scope="text">
          <span style="font-weight: bold">￥{{ text }}</span>
        </template>
        <template slot="soTotal" slot-scope="text">
          <span style="font-weight: bold">￥{{ text }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import moment from "moment";
import {
  PERSONALINFOLIST,
  PERSONALINFOADD,
  PERSONALINFOUPDATE,
  PERSONALINFODEL,
  SETPERSONBLACKLIST,
} from "@/api";
import Breadcrumb from "@/components/Breadcrumb.vue";

const columns = [
  {
    title: "机构名称",
    dataIndex: "soBname",
    align: "center",
    minWidth: "120px",
    key: "soBname",
    scopedSlots: { customRender: "soBname" },
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
      currentTypeIndex: 0,
      plantTypeList: [],
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      modalW: "900px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      headers: {
        Authorization: this.$store.state.user.token,
      },
      currentIndex: 0,
      tableData: [],
      loading: false,
      confirmLoading: false,
      formTitle: "",
      flowStatus: 0,
      flowId: "",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      userId: "",
      pagination: {},
      queryParam: {},
      examineTitle: "",
      id: "",
      auditingState: "",
      examineState: "",
      examineVisible: false,
      priceTypeList: ["总价", "亩平均"],
      timeTypeList: ["日", "月", "全部"],
      currentPriceTypeIndex: 0,
      currentTimeTypeIndex: 0,
      clockStartTimes: moment(new Date()).format("YYYY-MM-DD"),
      average: false,
      staticColumn: [],
      tempCloumnArr: [],
    };
  },
  async mounted() {
    this.queryParam = {
      pageNum: 1,
      pageSize: 10,
      searchType: 1, // 1 日 2月 3 年
      clockStartTimes: moment(new Date()).format("YYYY-MM-DD"),
      plantType: "",
    };
    const typeRes = await this.getPlantTypeListOnce();
    this.plantTypeList = typeRes.value;

    this.queryParam.plantType = typeRes.value[0].id;
    // this.queryParam.telAreaCode = typeRes.value[0].id;
    this.getDataList();
    const res = await this.getProductListAsync(typeRes.value[0].id);
    const tempCloumnArr = res && res.value;
    this.tempCloumnArr = tempCloumnArr;
    this.staticColumn = columns;
    this.concatColumn(tempCloumnArr);
  },
  methods: {
    concatColumn(tempCloumnArr) {
      let tempColumn = [];
      if (this.plantTypeList[this.currentTypeIndex].plantName == "小麦") {
        tempColumn = [];
        tempColumn.push({
          title: "小麦面积(亩)",
          dataIndex: "soLogo",
          align: "center",
          width: "120px",
          key: "soLogo",
        });
      }
      if (this.plantTypeList[this.currentTypeIndex].plantName == "水稻") {
        tempColumn = [];
        tempColumn.push({
          title: "水稻面积(亩)",
          dataIndex: "soFname",
          align: "center",
          width: "120px",
          key: "soFname",
        });
      }
      if (this.currentTypeIndex == 2) {
        tempColumn = [];
      }
      console.log(tempCloumnArr, "tempCloumnArr");
      if (tempCloumnArr && tempCloumnArr.length) {
        tempCloumnArr.forEach((item, index) => {
          tempColumn.push({
            title: item.projectName,
            dataIndex: this.average
              ? "average" + index
              : "allPriceCount" + index,
            key: this.average ? "average" + index : "allPriceCount" + index,
            width: 80,
            align: "center",
          });
        });
      }
      tempColumn.push({
        title: this.currentTypeIndex == 2 ? "总费用" : "合计",
        dataIndex:
          this.currentPriceTypeIndex == 1 ? "soTotalAverage" : "soTotal",
        align: "center",
        // width: "120px",
        key: this.currentPriceTypeIndex == 1 ? "soTotalAverage" : "soTotal",
        fixed: "right",
        scopedSlots: { customRender: "soTotal" },
      });
      this.columns = columns.concat(tempColumn);
      console.log(this.columns.length, "gruguy");
    },
    dateChange(val) {
      this.clockStartTimes = moment(val).format("YYYY-MM-DD");
      this.queryParam.clockStartTimes = this.clockStartTimes;
      this.getDataList();
    },
    monthChange(val) {
      this.clockStartTimes = moment(val).format("YYYY-MM");
      this.queryParam.clockStartTimes = this.clockStartTimes;
      this.getDataList();
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf("day");
    },
    changeTimeType(index) {
      this.currentTimeTypeIndex = index;
      if (index == 2) {
        this.getDataList();
      }
    },
    changePriceType(type) {
      this.currentPriceTypeIndex = type;
      this.average = type == 1 ? true : false;
      console.log(this.tempCloumnArr);
      this.concatColumn(this.tempCloumnArr);
    },
    async changeType(index, id) {
      this.currentTypeIndex = index;
      this.queryParam.plantType = id;
      if (this.currentTypeIndex == 2) {
        this.tempCloumnArr = [];
        this.queryParam.telAreaCode = id;
      } else {
        delete this.queryParam.telAreaCode;
        const res = await this.getProductListAsync(id);
        this.tempCloumnArr = res && res.value;
      }
      this.concatColumn(this.tempCloumnArr);
      this.getDataList();
    },
    async getPlantTypeListOnce() {
      return await this.$axios.get("plantTypeInfoController/getListprams");
    },
    getPlantTypeList() {
      this.$axios.get("plantTypeInfoController/getListprams").then((res) => {
        this.plantTypeList = res.value;
        this.spinning = false;
      });
    },
    openDetail(data) {
      this.$refs.detailView.showDetail(data);
      // this.$router.push(`/projectManage/infoDetailPage/${id}`);
    },
    setQueryParam(values) {
      this.queryParam = {
        ...this.queryParam,
        ...values,
      };
      console.log(this.queryParam);
      this.getDataList();
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
        .get("/projectManagerClockController/statistics", {
          params: this.queryParam,
        })
        .then((res) => {
          if (res.code === 1) {
            let tempArr = [];
            res.value &&
              res.value.forEach((item, index) => {
                tempArr.push(item);
                let total = 0;
                let totalAverage = 0;
                tempArr[index].list.forEach((it, i) => {
                  total += Number(it.allPriceCount);
                  totalAverage += Number(it.average);
                  tempArr[index]["average" + i] = it.average;
                  tempArr[index]["allPriceCount" + i] = it.allPriceCount;
                });
                tempArr[index].soTotal = total;
                tempArr[index].soTotalAverage =
                  totalAverage > 0
                    ? totalAverage / tempArr[index].list.length
                    : 0;
                if (tempArr[index].children) {
                  tempArr[index].children.forEach((child, i) => {
                    let totalC = 0;
                    let totalCAverage = 0;
                    child.childrenList.forEach((childC, ic) => {
                      totalC += parseFloat(childC.allPriceCount);
                      totalCAverage += parseFloat(childC.average);
                      child["average" + ic] = childC.average;
                      child["allPriceCount" + ic] = childC.allPriceCount;
                    });

                    child.soTotal = total;
                    child.soTotalAverage =
                      totalAverage > 0
                        ? totalAverage / tempArr[index].list.length
                        : 0;
                  });
                }
              });
            console.log(tempArr);
            this.tableData = tempArr;

            // const pagination = { ...this.pagination };
            // pagination.total = res.value.total;
            this.loading = false;
            // this.pagination = pagination;
          } else {
            this.loading = false;
            this.tableData = null;
          }
        });
    },
    async getProductListAsync(plantType) {
      this.queryParam = {
        ...this.queryParam,
        plantType,
      };
      this.loading = true;
      return await this.$axios.get(
        "/employmentProjectInfoController/getListprams",
        {
          params: this.queryParam,
        }
      );
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
.filter {
  margin-left: 20px;
  margin-right: 20px;
  .title {
    padding-right: 10px;
  }
  .item-wrapper {
    .item {
      padding: 4px 12px;
      cursor: pointer;
      background-color: #f0f0f0;
      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &.active {
        background-color: #096dd9;
        color: #fff;
      }
    }
  }
}
</style>
