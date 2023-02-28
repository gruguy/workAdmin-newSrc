import { mapGetters, mapActions } from "vuex";

export const smartMixin = {
  data() {
    return {
      spinningGJ: true,
      spinning: true,
      confirmLoading: false,
      rejectLoading: false,
      adcode: 330000,
      checkData: [],
      modalDeviceVisible: false,
      confirmWorkListLoading: false,
      currentWarningTypeList: [],
      modalVisible: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 12 },
      },
      personList: [], //人员列表
      deviceList: [], // 设备列表
      woLevelList: [], // 告警等级列表
      wTList: [], // 告警类型列表
      checkedTypeValues: [], //选中的告警类型数组
      boxLevelList: [], // 设备等级
      loadingOption: {
        text: "数据正在加载...",
        color: "#fff",
        textColor: "#fff",
        maskColor: "rgba(0, 0, 0, 0.4)",
      },
    };
  },
  computed: {
    ...mapGetters(["menuCollapse", "menuListState", "currentSelectedIndex"]),
  },
  methods: {
    ...mapActions([
      "setMenuCollapse",
      "setMenuListState",
      "setCurrentSelectedIndex",
    ]),
    goback() {
      this.$router.go(-1);
    },
    backToParent() {
      this.$router.back();
    },
    getTableList(url, page) {
      this.loading = true;
      this.$axios.get(url, { params: { page: page } }).then((res) => {
        let data = res.data;
        if (data && data.code === 1 && data.value && data.value.rows.length) {
          this.tableData = data.value.rows;
          console.log(this.tableData);
          const pagination = { ...this.pagination };
          pagination.total = data.value.total;
          this.loading = false;
          this.pagination = pagination;
        } else {
          this.loading = false;
          this.tableData = null;
        }
      });
    },
    handleUoloadChange(urlUpload, urlList, data) {
      if (data.file.status === "done") {
        let fileUrl =
          data.fileList[data.fileList.length - 1].response.value.data.link;
        this.$axios
          .post(this.GLOBAL.urlUpload, { filePath: fileUrl })
          .then((data) => {
            this.$message.info(data.msg);
            this.getTableList(this.GLOBAL.urlList, 1);
          });
      }
    },
    addTableItem(url, urlList, params) {
      this.$axios.post(url, params).then((res) => {
        console.log(res.data);
        let data = res.data;
        let msg = data.code === 1 ? data.msg : "新增失败";
        this.$message.info(msg);
        this.modalVisible = false;
        this.form.resetFields(); // 清除表单数据
        this.getTableList(urlList, 1);
      });
    },
    handleTableItem(url, urlList, params) {
      this.$axios.post(url, params).then((res) => {
        console.log(res.data);
        let data = res.data;
        let msg = data.msg;
        this.$message.info(msg);
        this.$emit("change", false);
        this.modalVisible = false;
        this.form.resetFields(); // 清除表单数据
        this.isEdit = false;
        this.getTableList(urlList, 1);
      });
    },
    deleteItem(url, urlList, id) {
      this.$confirm({
        title: "确认删除",
        content: "删除后不可恢复，确认删除？",
        onOk: () => {
          this.loading = true;
          this.$axios.get(url, { params: { ids: id } }).then((data) => {
            let msg = data.code === 1 ? data.msg : "删除失败";
            this.$message.info(msg);
            this.getDataList(urlList, 1);
          });
        },
      });
    },
    chartsSize(container, charts) {
      function getStyle(el) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, null);
        } else {
          return el.currentStyle;
        }
      }

      // let wi = parseInt(getStyle(container, 'width').width) - 20 + 'px';
      let hi = parseInt(getStyle(container, "height").height) - 60 + "px";
      charts.style.height = hi;
    },
    promiseisNotNull(obj) {
      if (!obj) {
        obj = "";
      }
      return obj;
    },
    getPersonList(fn) {
      this.$axios
        .post(this.INDEXAPI.GETPERSONLIST, { adcode: this.adcode })
        .then((data) => {
          this.personList = data.value;
          fn && fn();
        });
    },
    getDeviceList() {
      this.$axios
        .post(this.INDEXAPI.GETPERSONLIST, { adcode: this.adcode })
        .then((data) => {
          this.deviceList = data.value;
        });
    },
    getWorkOrderLevel() {
      this.$axios.get(this.INDEXAPI.GETWORKORDERLEVEL).then((data) => {
        this.woLevelList = data.value;
      });
    },
    getWarningType(id) {
      this.$axios
        .get(this.INDEXAPI.GETWARNINGTYPE, { params: { bId: id } })
        .then((data) => {
          this.spinning1 = false;
          if (data && data.code == 1) {
            this.currentWarningTypeList = data.value;
          }
        });
    },
    getSmartBoxLevel() {
      this.$axios.get(this.INDEXAPI.GETSMARTBOXLEVEL).then((data) => {
        this.boxLevelList = data.value;
      });
    },
    onChangeType(checkedValues) {
      console.log(checkedValues);
      this.checkedTypeValues = checkedValues;
    },
    // 打开详情
    openWarningModal(data) {
      let id = "";
      let boxId = "";
      if (data && !data.isTrusted) {
        id = data.wId;
        boxId = data.bId;
        this.checkData = data.wType;
      } else {
        id = this.chart1Data[this.realIndex].wId;
        boxId = this.chart1Data[this.realIndex].boxData.bId;
        this.checkData = this.chart1Data[this.realIndex].wType;
      }
      console.log("00000000");
      console.log(data);
      this.getWarningTypeByBoxId(boxId);
      this.$axios
        .get(this.INDEXAPI.GETWARNINGBYID, { params: { id: id } })
        .then((data) => {
          console.log("00000000");
          console.log(data);
          this.currentWarningData = data.value;
          this.spinningGJ = false;
        });
      this.warningVisible = true;
    },
    // 处理误报
    handlFalseWarningOk() {
      this.confirmFalseWarningLoading = true;
      this.falseWarningVisible = false;
      this.form.validateFields((err, values) => {
        if (!err) {
          console.info("success");
          values = {
            ...values,
            wId: this.currentWarningData.wId,
          };
          this.$axios
            .post(this.INDEXAPI.HANDLEFALSEALERM, values)
            .then((data) => {
              this.confirmFalseWarningLoading = false;
              if (data && data.code == 1) {
                this.$message.success("属于误报，已处理！");
              } else {
                this.$message.error("操作失败！");
              }
            });
        }
      });
    },
    getWarningTypeByBoxId(id) {
      this.$axios
        .get(this.INDEXAPI.GETWARNINGTYPE, { params: { bId: id } })
        .then((data) => {
          this.spinning1 = false;
          this.currentWarningTypeList = data.value;
          this.currentWarningTypeList.forEach((item) => {
            if (item.wtName == this.checkData) {
              this.checkData = [item.wtId];
            }
          });
        });
    },
    handleWarningOk() {
      this.confirmWarningLoading = true;
      this.warningVisible = false;
      this.spinningGJ = true;
      this.openWorkListModal();
    },
    handleFalseWarningCancel() {
      this.falseWarningVisible = false;
      this.spinningGJ = true;
    },
    handleWarningWrong() {
      this.warningVisible = false;
      this.falseWarningVisible = true;
      this.spinningGJ = true;
    },
    handleWarningCancel() {
      this.warningVisible = false;
      this.spinningGJ = true;
    },
    openWorkListModal() {
      this.getPersonList();
      this.workListVisible = true;
      this.warningVisible = false;
    },
    handlWorkListOk() {
      this.confirmWorkListLoading = true;
      this.form.validateFields((err, values) => {
        values = {
          ...values,
          wtIds: values.wtIds.join(","),
        };
        if (!err) {
          this.$axios
            .post(this.INDEXAPI.HANDLEDEVICEALERM, values)
            .then((data) => {
              if (data && data.code == 1) {
                this.$message.success("完成下单");
                this.initChart1Data(); //更新数据
              }
              this.workListVisible = false;
              this.confirmWorkListLoading = false;
            });
        } else {
          this.confirmWorkListLoading = false;
        }
      });
    },
    handleWorkListCancel() {
      this.workListVisible = false;
    },
    getDataList(url, fn) {
      this.$axios
        .get(url, {
          params: {
            type: this.boxType,
            adcode: this.adcode,
            page: this.currentPage,
          },
        })
        .then((data) => {
          fn && fn(data);
        });
    },
    getCurrentPage(page) {
      this.currentPage = page;
      this.spinning = true;
      this.getDataList(this.urlList, (data) => {
        let pageNum = data.value.pageNum;
        this.dataList = this.currentPage !== pageNum ? [] : data.value.rows;
        this.spinning = false;
      });
    },
  },
};
