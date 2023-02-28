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
            <a-input v-decorator="['upId']"></a-input>
          </a-form-item>
          <a-form-item
            label="版本号"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'upVersion',
                { rules: [{ required: true, message: '请输入版本号' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="上传软件"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="uploadUrl"
              :headers="headers"
              :before-upload="beforeUpload"
              @change="handleChange"
              v-decorator="[
                'upUrl',
                { rules: [{ required: true, message: '请选择上传软件' }] },
              ]"
            >
              <div class="img-wrapper" v-if="imageUrl">
                <a :href="imageUrl" alt="avatar">{{ fileName }}</a>
              </div>
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传App</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="版本特性"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-textarea
              :rows="6"
              v-decorator="[
                'upDesc',
                { rules: [{ required: true, message: '请输入更新版本特性' }] },
              ]"
            >
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { SYSROLEADD, SYSROLEUPDATE } from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      loading: false,
      modalVisible: false,
      modalW: "500px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      isEdit: false,

      headers: {
        Authorization: this.$store.state.user.token,
      },
      uploadUrl: process.env.VUE_APP_API_BASEURL + "/upload/uploadImg",
      imageUrl: "",
    };
  },
  computed: {
    fileName() {
      let arr = this.imageUrl.split("/");
      return arr[arr.length - 1];
    },
  },
  //方法集合
  methods: {
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
        // Get this url from response in real world.
        this.$message.success(info.file.response.msg);
        this.imageUrl = info.file.response.value.data.link;
      }
    },
    beforeUpload(file) {
      console.log(file.type);
      let fileName = file.name;
      let fileArr = fileName.split(".");
      let fileType = fileArr[fileArr.length - 1];
      const isAPK =
        file.type === "application/vnd.android.package-archive" ||
        fileType == "apk";
      if (!isAPK) {
        this.$message.error("只能上传apk包");
      }
      const isLt200M = file.size / 1024 / 1024 < 200;
      if (!isLt200M) {
        this.$message.error("apk包必须小于 200MB!");
      }
      return isAPK && isLt200M;
    },
    init() {
      // this.getTypeList();
    },
    openModal(isEdit, data) {
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
            url = "/upAppServerController/update";
          } else {
            url = "/upAppServerController/save";
          }
          console.log(url);
          values = {
            ...values,
            upUrl: this.imageUrl,
            upTime: "2023-2-24 23:56:00",
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
</style>
