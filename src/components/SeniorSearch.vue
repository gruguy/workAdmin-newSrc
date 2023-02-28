<template>
  <div id="components-form-demo-advanced-search" class="advanced-search">
    <a-form
      v-if="columns && columns.length"
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
        <template v-for="(item, index) in filterShow(columns)">
          <a-col
            v-if="item.type && item.type == 'datetime'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-date-picker
                showTime
                v-decorator="[
                  item.dataIndex2 ? item.dataIndex2 : item.dataIndex,
                ]"
                :placeholder="`请搜索${item.title}`"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="item.type && item.type == 'time'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-time-picker
                v-decorator="[
                  item.dataIndex2 ? item.dataIndex2 : item.dataIndex,
                ]"
                :placeholder="`请搜索${item.title}`"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="item.type && item.type == 'date'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-date-picker
                v-decorator="[
                  item.dataIndex2 ? item.dataIndex2 : item.dataIndex,
                ]"
                :placeholder="`请搜索${item.title}`"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="item.type && item.type == 'range'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-range-picker
                @change="onRangeChange($event, 'string', item.dataIndex)"
                :show-time="{ format: 'HH:mm' }"
                v-decorator="[item.dataIndex + 's']"
              />
            </a-form-item>
            <a-form-item hidden>
              <a-input v-decorator="[item.dataIndex]" />
            </a-form-item>
            <a-form-item hidden>
              <a-input v-decorator="[item.dataIndex + '1']" />
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="item.type && item.type == 'week'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-select
                v-decorator="[
                  item.dataIndex2 ? item.dataIndex2 : item.dataIndex,
                ]"
                :placeholder="`请搜索${item.title}`"
              >
                <a-select-option :key="item.value" v-for="item in weekList">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="item.type && item.type == 'select'"
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-select
                v-decorator="[item.target ? item.target : item.dataIndex]"
                :placeholder="`请搜索${item.title}`"
              >
                <a-select-option :key="it.value" v-for="it in item.dataList">{{
                  it.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="
              item.type &&
              item.type == 'selectAsync' &&
              item.target == 'bwmType'
            "
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-select
                v-decorator="[item.dataIndex2]"
                :placeholder="`请搜索${item.title}`"
              >
                <a-select-option
                  :key="it.value"
                  v-for="it in warningTypeList"
                  >{{ it.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-else-if="
              item.type &&
              item.type == 'selectAsync' &&
              item.target == 'deviceType'
            "
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-select
                v-decorator="[item.dataIndex2]"
                :placeholder="`请搜索${item.title}`"
              >
                <a-select-option :key="it.datId" v-for="it in deviceTypeList">{{
                  it.datName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-else
            :key="index"
            :sm="8"
            :style="{ display: index < count ? 'block' : 'none' }"
          >
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              :label="item.title"
            >
              <a-input
                v-decorator="[
                  item.dataIndex2 ? item.dataIndex2 : item.dataIndex,
                ]"
                :placeholder="`请搜索${item.title}`"
              />
            </a-form-item>
          </a-col>
        </template>
        <a-col
          v-if="!expand"
          ref="initBtns"
          :class="{
            initBtns: !expand || filterShow(columns).length % 4 != 0,
          }"
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
            <a-button type="primary" ghost html-type="submit" icon="search">
              搜索
            </a-button>
            <a-button
              type="default"
              :style="{ marginLeft: '8px' }"
              icon="reload"
              @click="handleReset"
            >
              重置
            </a-button>
            <span
              class="unfold"
              :style="{
                marginLeft: '8px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }"
              @click="toggle"
              v-if="filterShow(columns).length > 2"
            >
              展开
              <a-icon :type="expand ? 'up' : 'down'" />
            </span>
          </span>
        </a-col>
      </a-row>
      <div class="search-footer" v-if="expand">
        <a-col
          ref="initBtns"
          :class="{
            initBtns: !expand || filterShow(columns).length % 4 != 0,
          }"
          :sm="24"
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
            <a-button type="primary" ghost html-type="submit" icon="search">
              搜索
            </a-button>
            <a-button
              type="default"
              :style="{ marginLeft: '8px' }"
              icon="reload"
              @click="handleReset"
            >
              重置
            </a-button>
            <span
              class="unfold"
              :style="{
                marginLeft: '8px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }"
              @click="toggle"
              v-if="filterShow(columns).length > 2"
            >
              收起
              <a-icon type="up" />
            </span>
          </span>
        </a-col>
      </div>
    </a-form>
    <!--<div class="search-result-list">-->
    <!--Search Result List-->
    <!--</div>-->
  </div>
</template>
<script>
import moment from "moment";
import { SYSORGSLIST } from "@/api";

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      dataType: "YYYY-MM-DD",
      expand: false,
      form: this.$form.createForm(this),
      deviceTypeList: [],
      warningTypeList: [],
      rangeKey: "",
      rangeValue: "",
      rangeKey1: "",
      rangeValue1: "",
      weekList: [
        {
          name: "周一",
          value: 1,
        },
        {
          name: "周二",
          value: 2,
        },
        {
          name: "周三",
          value: 3,
        },
        {
          name: "周四",
          value: 4,
        },
        {
          name: "周五",
          value: 5,
        },
        {
          name: "周六",
          value: 6,
        },
        {
          name: "周日",
          value: 7,
        },
      ],
      isAdmin: false,
      orgId: "",
      orgList: [],
      queryParam: {
        ids: this.$store.state.user.orgId,
      },
    };
  },
  computed: {
    count() {
      return this.expand ? 100 : this.isAdmin ? 1 : 2;
    },
  },
  updated() {
    console.log("updated");
  },
  mounted() {
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
      this.$axios
        .get(SYSORGSLIST, {
          params: this.queryParam,
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
    onRangeChange(arr, dateString, key) {
      this.rangeKey = key;
      this.form.setFieldsValue({
        [key]: moment(arr[0]).format("YYYY-MM-DD HH:mm:ss"),
        [key + "1"]: moment(arr[1]).format("YYYY-MM-DD HH:mm:ss"),
      });
      // this.rangeValue = moment(arr[0]).format('YYYY-MM-DD HH:mm:ss')
      // this.rangeKey1 = key + '1'
      // this.rangeValue1 = moment(arr[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    getDeviceTypeList() {
      this.$http
        .get(`/deviceAgreementTypeController/getAdvancedQuery.do`, {
          params: {
            pageNo: 1,
            pageSize: 100,
          },
        })
        .then((data) => {
          if (data && data.code == 1) {
            this.deviceTypeList = data.value.rows;
          }
        });
    },
    getWarningTypeList() {
      this.$http
        .get(`/codedataController/getCode.do`, {
          params: {
            parentid: "04",
            pageNo: 1,
            pageSize: 100,
          },
        })
        .then((data) => {
          if (data && data.length) {
            this.warningTypeList = data.filter((item) => item.value != "0413");
          }
        });
    },
    filterShow(list) {
      return list.filter((item) => item.type !== "hide");
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
            console.log("--------");
            console.log(values[item]);
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
          this.$emit("ok", realValue);
        }
      });
    },

    handleReset() {
      this.form.resetFields();
      console.log("pppppppppppppppp");
      console.log(this.form.getFieldsValue());
      // if (this.rangeKey1) {
      //   this.rangeValue = ''
      //   this.rangeValue1 = ''
      // }
    },

    toggle() {
      this.expand = !this.expand;
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1200px) {
  ::v-deep .ant-form-item-label {
    display: none;
  }
}

.initBtns {
  // margin-top: -45px;
  display: flex;
  justify-content: end;
}

.initBtns-last {
  // margin-top: -25px;
}

::v-deep .ant-form-item-label {
  min-width: 130px;
  label {
    // min-width: 105px;
    display: inline-block;
    // width: auto;
  }
}
.unfold {
  color: #333;
  font-size: 16px;
  cursor: pointer;
}
.search-footer {
  margin-top: 20px;
  border-top: solid 1px #f0f0f0;
  height: 50px;
  padding: 8px 0 8px 0;
}
.ant-input,
.ant-select {
  width: 220px !important;
  max-width: none;
}
</style>
