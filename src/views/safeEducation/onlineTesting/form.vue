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
          <!-- <a-form-item hidden>
            <a-input v-decorator="['learingId']"></a-input>
          </a-form-item> -->
          <a-form-item
            label="参与人"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              mode="tags"
              @change="handleChangePerson"
              v-decorator="[
                'personalAll',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
              <a-select-option v-for="item in personlist" :key="item.id">{{
                item.personalName
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="学习内容"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              rows="6"
              v-decorator="[
                'learningId',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
              <a-select-option
                v-for="item in onlinelist"
                :key="item.onlineId"
                >{{ item.learningTitle }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="学习时间"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-date-picker style="width: 100%" v-decorator="['learningDate']">
            </a-date-picker>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="图片"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <div v-if="imgList" class="img-wrappers">
              <div class="img-wrapper" v-for="item in imgList">
                <img class="img" :src="item" alt="img" />
              </div>
            </div>

            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/api/upload/uploadImg"
              :headers="headers"
              :before-upload="beforeUpload"
              @change="handleChange"
              v-decorator="['img']"
            >
              <div>
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图标</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { PERSONALINFOADD, PERSONALINFOUPDATE, WORKTYPELISTALL } from "@/api";
import { PERSONALINFOLISTALL } from "@/api";
import moment from "moment";
export default {
  data() {
    //这里存放数据
    return {
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
      personlist: [],
      onlinelist: [],
    };
  },
  //方法集合
  methods: {
    getOnlineList() {
      this.$axios.get("/onlineLearningController/getListprams").then((res) => {
        this.onlinelist = res.value;
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
      this.getOnlineList();
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
            url = "/learningRecordController/update";
          } else {
            url = "/learningRecordController/save";
          }
          console.log(url);
          values = {
            ...values,
            personalAll: values.personalAll.join(","),
            img: this.imgList.join(","),
            learningDate: moment(values.learningDate).format(
              "YYYY-MM-DD hh:mm:ss"
            ),
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
