<template>
  <a-modal
    :title="formTitle"
    :visible="modalVisible"
    :confirmLoading="confirmLoading"
    :width="modalW"
    @ok="handleOk"
    @cancel="handleModalCancel"
  >
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item hidden>
            <a-input v-decorator="['riceId']"></a-input>
          </a-form-item>
          <a-form-item
            label="农具种类"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              @change="handleChangeType"
              v-decorator="[
                'riceType',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
              <a-select-option v-for="item in typelist" :key="item.key">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24" v-if="typeIndex != -1">
          <a-form-item
            label="劳务项目"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              @change="handleChangeLabour"
              rows="6"
              v-decorator="[
                'labourName',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
              <a-select-option v-for="item in labourList" :key="item.id">{{
                item.labourName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="labourIndex != -1">
          <a-form-item
            label="价格"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              :placeholder="`最高不能大于管理员设置的${labourList[labourIndex].labourPrice}`"
              :max="labourList[labourIndex].labourPrice"
              style="width: 100%"
              rows="6"
              v-decorator="[
                'labourPrice',
                {
                  initialValue: labourList[labourIndex].labourPrice,
                  rules: [{ required: true, message: '请输入...' }],
                },
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="labourIndex != -1">
          <a-form-item
            label="单位"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              :max="labourList[labourIndex].labourUnit"
              style="width: 100%"
              rows="6"
              v-decorator="[
                'labourUnit',
                {
                  initialValue: labourList[labourIndex].labourUnit,
                  rules: [{ required: true, message: '请输入...' }],
                },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="24" v-if="labourIndex != -1">
          <a-form-item
            label="总亩数/总天数"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              style="width: 100%"
              rows="6"
              @input="calPrice"
              v-decorator="[
                'countMu',
                {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入...' }],
                },
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>

        <a-col :span="24" v-if="labourIndex != -1">
          <a-form-item
            label="总价"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              readonly
              style="width: 100%"
              rows="6"
              v-decorator="[
                'countPrice',
                {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入...' }],
                },
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { PERSONALINFOADD, PERSONALINFOUPDATE, WORKTYPELISTALL } from "@/api";
import { PERSONALINFOLISTALL } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      typeIndex: -1,
      labourIndex: -1,
      modalVisible: false,
      modalW: "600px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      headers: {
        Authorization: this.$store.state.user.token,
      },
      imgList: [],
      score: 0,
      isEdit: false,
      workTypeName: "",
      typelist: [
        {
          key: 1,
          name: "水稻机插秧价",
        },
        {
          key: 2,
          name: "水稻旱直播价",
        },
        {
          key: 3,
          name: "水稻水直播价",
        },
        {
          key: 4,
          name: "三麦",
        },
      ],
      labourList: [],
      typeUrlList: [
        "riceDrySeedingController",
        "riceMachineSeedingController",
        "riceWaterSeddingController",
        "threeRiceSeedingController",
      ],
    };
  },
  //方法集合
  methods: {
    handleChangeType(e) {
      console.log(e);
      this.typeIndex = Number(e) - 1;
      this.getLabourList();
    },
    calPrice() {
      this.form.setFieldsValue({
        countPrice: 0,
      });
    },
    handleChangeLabour(e) {
      this.labourIndex = this.labourList.findIndex((item) => item.id == e);
      console.log(this.labourIndex);
    },
    getLabourList() {
      this.$axios
        .get(`/${this.typeUrlList[this.typeIndex]}/getListprams`)
        .then((res) => {
          this.labourList = res.value;
          // this.form.setFieldsValue({
          //   labourPrice: this.labourList[this.labourIndex].labourPrice,
          // });
        });
    },
    handleChangePerson(e) {
      console.log(e);
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
        // Get this url from response in real world.
        this.$message.success(info.file.response.msg);
        this.imgList.push(info.file.response.value.data.link);
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("只能上传png或者jpg");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小必须小于 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    init() {
      this.getPersonList();
    },
    openModal(isEdit, data) {
      this.getPersonList();
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      if (isEdit) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
        setTimeout(() => {
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          console.log(params.blebId);
          this.form.setFieldsValue(params);
        }, 300);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
      }
    },

    handleOk() {
      this.handleSubmit(this.isEdit);
    },

    handleModalCancel() {
      this.modalVisible = false;
      this.form.resetFields();
    },
    handleSubmit(isEdit) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          console.log("Received values of form: ", values);
          let url = "";
          console.log(isEdit);
          if (isEdit) {
            url = "/farmToolsPriceController/update";
          } else {
            url = "/farmToolsPriceController/save";
          }
          console.log(url);
          values = {
            ...values,
          };
          console.log(values);

          this.$axios.post(url, values).then((res) => {
            console.log(res);
            this.confirmLoading = false;
            let type = res.code == 1 ? "success" : "error";
            this.$message[type](res.msg);
            if (res.code == 1) {
              this.modalVisible = false;
              this.$emit("loadData");
            }
          });
        }
      });
    },
    getPersonList() {
      this.$axios
        .get(PERSONALINFOLISTALL, {
          // auditingState: 2,
        })
        .then((res) => {
          if (res.code == 1) {
            this.personlist = res.value;
          }
        });
    },
    workTypeChange(e) {
      this.workTypeName = this.workTypeList.find(
        (item) => item.id === e
      ).workTypeName;
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.map-wrapper {
  position: relative;
  .mapSelect {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 4px;
    padding: 4px 10px;
    background-color: #1890ff;
    color: #fff;
    text-align: center;
  }
}
.img-wrappers {
  display: flex;
}
.img-wrapper {
  display: flex;
  height: 100px;
  width: 100px;
  border: solid 1px #f0f0f0;
  margin: 0 10px 10px 0;
}
</style>
