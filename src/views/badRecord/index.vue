<template>
  <div class="white-bg-wrapper">
    <breadcrumb>
      <a-button v-has="'add'" type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </breadcrumb>
    <h2>{{ $route.name }}</h2>
    <senior-search :columns="columns" @ok="setQueryParam"></senior-search>
    <!--操作按钮组-->
    <!-- <div class="handleButtons">
      <a-button type="danger" ghost @click="openDialogAndOrder"
        ><a-icon type="plus" />新增</a-button
      >
    </div> -->
    <div class="white-bg">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        size="middle"
        :rowKey="(record) => record.blackId"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="faceImg" slot-scope="text, record">
          <!-- <img :src="text" class="avatar" /> -->
          <a-avatar
            shape="square"
            :size="64"
            icon="user"
            :src="text"
            @click="showImage(text)"
          />
        </template>
        <template slot="blackSex" slot-scope="text">
          <a-tag v-if="text == 0">男</a-tag>
          <a-tag v-else>女</a-tag>
        </template>
        <template slot="auditingState" slot-scope="text">
          <a-tag color="orange" v-if="text == 0">待审核</a-tag>
          <a-tag color="green" v-if="text == 1">审核通过</a-tag>
          <!-- <a-tag color="green" v-if="text == 2">审核通过</a-tag> -->
          <a-tag color="red" v-if="text == 3">不通过</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <span v-has="'edit'">
            <a @click="openDialogAndOrder(record)"> 编辑 </a>
            <a-divider type="vertical"></a-divider>
          </span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item
                v-has="'confirmExam'"
                v-if="record.auditingState == 0"
              >
                <a href="javascript:;" @click="showExmine(record, 1)"
                  >确认审核</a
                >
              </a-menu-item>

              <a-menu-item v-has="'reject'" v-if="record.auditingState == 0">
                <a href="javascript:;" @click="showExmine(record, 3)"
                  >审核拒绝</a
                >
              </a-menu-item>
              <a-menu-item v-has="'delete'">
                <a
                  href="javascript:;"
                  @click="showConfirmDeleteItem(record.blackId)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <modal-form ref="addForm" @loadData="getDataList"></modal-form>
    <modal-prompt
      ref="modalPrompt"
      @ok="getReason"
      :title="confirmTitle"
    ></modal-prompt>
  </div>
</template>

<script>
import SeniorSearch from "@/components/SeniorSearch";
import { smartMixin } from "@/utils/mixins.js";
import ModalForm from "./form.vue";
import ModalPrompt from "@/components/prompt";
import {
  BLACKLISTLIST,
  BLACKLISTADD,
  BLACKLISTUPDATE,
  BLACKLISTDEL,
  BLACKLLISTEXMINE,
} from "@/api";
import Breadcrumb from "../../components/Breadcrumb.vue";

const columns = [
  {
    title: "个人头像",
    dataIndex: "faceImg",
    key: "faceImg",
    width: "120px",
    align: "center",
    type: "hide",
    scopedSlots: { customRender: "faceImg" },
  },
  {
    title: "姓名",
    dataIndex: "blackName",
    key: "blackName",
  },
  {
    title: "性别",
    dataIndex: "blackSex",
    key: "blackSex",
    type: "select",
    scopedSlots: { customRender: "blackSex" },
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
  //   dataIndex: "sTel",
  //   key: "sTel"
  // },
  {
    title: "不良状态",
    dataIndex: "auditingState",
    key: "auditingState",
    scopedSlots: { customRender: "auditingState" },
  },
  {
    title: "身份证号",
    dataIndex: "blackCode",
    key: "blackCode",
  },
  {
    title: "加入说明",
    dataIndex: "describeRemark",
    scopedSlots: { customRender: "describeRemark" },
    // type: "select",
    // dataList: [
    //   {
    //     name: "在岗履职差",
    //     value: 1
    //   },
    //   {
    //     name: "身体状态不佳",
    //     value: 2
    //   },
    //   {
    //     name: "存在违法违纪行为",
    //     value: 3
    //   }
    // ]
  },
  {
    title: "操作",
    key: "action",
    width: "180px",
    align: "center",
    type: "hide",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  mixins: [smartMixin],
  components: {
    SeniorSearch,
    ModalForm,
    ModalPrompt,
    Breadcrumb,
  },
  data() {
    return {
      columns,
      modalVisible: false,
      modalImgVisible: false,
      currentImg: "",
      modalW: "600px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      formItemArr: [
        {
          prName: "",
          prModel: "",
          prNum: null,
          prUnit: "",
        },
      ],
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
      confirmTitle: "",
      currentItem: {},
      currentState: 0,
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
    showImage(text) {
      // 判断地址是否正确
      const reg = /^[(http)(https)]/;
      console.log(reg.test(text));
      if (reg.test(text)) {
        this.$viewerApi({
          images: [text],
        });
      }
    },
    handleImgCancel() {
      this.modalImgVisible = false;
    },
    showImg(url) {
      this.currentImg = url;
      this.modalImgVisible = true;
    },
    addItem(index) {
      this.currentIndex = index;
      this.formItemArr.push({
        prName: "",
        prModel: "",
        prNum: null,
        prUnit: "",
      });
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
      this.deleteItem(BLACKLISTDEL, BLACKLISTLIST, id);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let path = "";
          if (this.isEdit) {
            //编辑
            path = BLACKLISTUPDATE;
          } else {
            //新增
            path = BLACKLISTADD;
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
      this.loading = true;
      this.$axios
        .get(BLACKLISTLIST, { params: this.queryParam })
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
    showExmine(data, state) {
      this.currentItem = data;
      this.currentState = state;
      switch (state) {
        case 1:
          this.confirmTitle = "确认审核";
          break;
        case 2:
          this.confirmTitle = "审核通过";
          break;
        case 3:
          this.confirmTitle = "审核拒绝";
          break;
      }
      this.$refs.modalPrompt.showModal();
    },
    getReason(val) {
      console.log(val);
      console.log(this.currentItem);
      this.toExine(
        this.currentItem.blackId,
        this.currentItem.blackCode,
        this.currentState,
        val.reason
      );
    },
    toExine(id, blackCode, state, reason) {
      this.$axios
        .post(BLACKLLISTEXMINE, {
          blackId: id,
          blackCode: blackCode,
          auditingState: state,
          auditingExplain: reason,
        })
        .then((res) => {
          if (res.code == 1) {
            this.$message.success("处理成功！");
          } else {
            this.$message.error("处理失败！");
          }
          this.$refs.modalPrompt.onHide();
          this.getDataList();
        });
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
</style>
