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
          <a-form-item
            label="头像"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <!--
              :action="uploadUrl"
              :headers="headers"
              @change="handleChange" -->
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              :customRequest="customImageRequest"
              v-decorator="[
                'personalImage',
                { rules: [{ required: true, message: '请选择上传头像' }] },
              ]"
            >
              <div class="img-wrapper" v-if="imageUrl">
                <img :src="imageUrl" alt="avatar" />
              </div>
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传图标</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item hidden>
            <a-input v-decorator="['id']"></a-input>
          </a-form-item>
          <a-form-item
            label="姓名"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'personalName',
                { rules: [{ required: true, message: '请输入姓名' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="是否项目经理"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-radio-group
              placeholder="是否项目经理"
              v-decorator="[
                'isPm',
                {
                  initialValue: 0,
                },
              ]"
            >
              <a-radio :value="1"> 是 </a-radio>
              <a-radio :value="0"> 否 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="手机号"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              placeholder="请输入手机号"
              v-decorator="[
                'personalPhone',
                { rules: [{ required: true, message: '请输入手机号' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="身份证号"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input
              placeholder="请输入身份证号"
              @blur="calculateAgeAndSex"
              v-decorator="[
                'personalId',
                {
                  rules: [
                    { required: true, message: '请输入身份证号' },
                    { validator: this.regIDType },
                  ],
                },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="年龄"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              readonly="readonly"
              placeholder="输入身份证号自动计算"
              style="width: 100%"
              v-decorator="[
                'age',
                {
                  rules: [{ required: true, message: '输入身份证号自动计算' }],
                },
              ]"
            >
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="性别"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              placeholder="请选择性别"
              v-decorator="[
                'personalSex',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
              <a-select-option :value="0">男</a-select-option>
              <a-select-option :value="1">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item
            label="工种"
            placeholder="请选择工种"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              @change="workTypeChange"
              v-decorator="[
                'workTypeId',
                { rules: [{ message: '请输入...' }] },
              ]"
            >
              <a-select-option
                v-for="(item, index) in workTypeList"
                :key="index"
                :value="item.id"
                >{{ item.workTypeName }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>

        <!-- <a-col :span="12">
          <a-form-item
            label="部门"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-select
              v-decorator="['deptId', { rules: [{ message: '请输入...' }] }]"
            >
              <a-select-option key="1" value="1">dddd</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="24">
          <a-form-item
            label="所属部门"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-tree-select
              placeholder="请选择所属部门"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="orgList"
              tree-default-expand-all
              v-decorator="[
                'orgIds',
                {
                  initialValue: 1,
                  rules: [
                    {
                      message: '请选择上级部门',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import {
  PERSONALINFOADD,
  PERSONALINFOUPDATE,
  WORKTYPELISTALL,
  SYSORGSLIST,
} from "@/api";
export default {
  data() {
    //这里存放数据
    return {
      modalVisible: false,
      modalW: "700px",
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      },
      confirmLoading: false,
      formTitle: "新增",
      form: this.$form.createForm(this),
      score: 0,
      isEdit: false,
      workTypeName: "",
      workTypeList: [],
      headers: {
        Authorization: this.$store.state.user.token,
      },
      uploadUrl: process.env.VUE_APP_API_BASEURL + "/upload/uploadImg",
      imageUrl: "",
      loading: false,
      spinning: false,
      orgList: [],
    };
  },
  //方法集合
  methods: {
    init() {
      this.getTypeList();
    },
    getOrgList() {
      this.spinning = true;
      this.$axios.get(SYSORGSLIST, { params: { ids: 1 } }).then((res) => {
        const arr = [];
        this.orgList = this.initRes(res.value, arr);
        this.spinning = false;
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
    calculateAgeAndSex() {
      const id = this.form.getFieldValue("personalId");
      if (id) {
        console.log(id);
        const ageAndSex = this.analyzeIDCard(id);
        this.form.setFieldsValue({
          age: ageAndSex.age,
          personalSex: Number(ageAndSex.sex),
        });
      }
    },
    regIDType(rule, value, callback) {
      const form = this.form;
      var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
      if (form.getFieldValue("personalId")) {
        if (!reg.test(form.getFieldValue("personalId"))) {
          callback("身份证格式不正确");
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    analyzeIDCard(IDCard) {
      var sexAndAge = {};
      //获取用户身份证号码
      var userCard = IDCard;
      //如果用户身份证号码为undefined则返回空
      if (!userCard) {
        return sexAndAge;
      }

      // 获取性别
      if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
        sexAndAge.sex = "0";
      } else {
        sexAndAge.sex = "1";
      }

      // 获取出生日期
      // userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14)
      var yearBirth = userCard.substring(6, 10);
      var monthBirth = userCard.substring(10, 12);
      var dayBirth = userCard.substring(12, 14);
      // 获取当前年月日并计算年龄
      var myDate = new Date();
      var monthNow = myDate.getMonth() + 1;
      var dayNow = myDate.getDate();
      var age = myDate.getFullYear() - yearBirth;
      if (
        monthNow < monthBirth ||
        (monthNow == monthBirth && dayNow < dayBirth)
      ) {
        age--;
      }
      // 得到年龄
      sexAndAge.age = age;
      console.log(sexAndAge);
      // 返回 性别和年龄
      return sexAndAge;
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
        this.imageUrl = info.file.response.value.data.link;
      }
    },
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        if (!file.type.includes("image")) {
          this.$message.warning("请上传图片");
          reject(new Error("请上传图片"));
          return;
        }
        const newFile = await this.compressImg(file);
        resolve(newFile);
      });
      console.log(file, "before");
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("只能上传png或者jpg");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小必须小于 2MB!");
      }
      // 压缩图片
      this.compressImg(file);
      return isJpgOrPng && isLt2M;
    },
    customImageRequest(info) {
      const { file } = info;
      console.log(info, "uploadFile");
      // blob方式预览图片
      // this.imageUrl = window.URL.createObjectURL(file);
      // 组装数据
      const formData = new FormData();
      formData.append("avatar", file);
      // 发送请求
      this.getUplodBackName(formData)
        .then((res) => {
          console.log(res, "ooooooooooo");
          this.$message.success("上传成功");
          // Get this url from response in real world.
          // this.$message.success(info.file.response.msg);
          console.log(info.file, "info.file");
          this.imageUrl = res.value.data.link;
        })
        .catch((err) => {
          console.log(err);
          this.$message.warning("上传失败");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getUplodBackName(parameter) {
      return this.$axios({
        url: "/upload/uploadImg",
        method: "post",
        // 传输文件流需要单独设置请求头
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: parameter,
      });
    },
    // base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    compressImg(file) {
      const that = this;
      var files;
      var fileSize = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(
        2
      );
      var read = new FileReader();
      read.readAsDataURL(file);
      return new Promise(function (resolve, reject) {
        read.onload = function (e) {
          var img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            // 默认按比例压缩
            var w = this.width;
            var h = this.height;
            // 生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var base64;
            // 创建属性节点
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            ctx.drawImage(this, 0, 0, w, h);
            if (fileSize < 1) {
              // 如果图片小于一兆 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.5);
            } else if (fileSize > 1 && fileSize < 2) {
              // 如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.5);
            } else {
              // 如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file["type"], 0.2);
            }
            // 回调函数返回file的值（将base64编码转成file）
            files = that.dataURLtoFile(base64, file.name); // 如果后台接收类型为base64的话这一步可以省略
            resolve(files);
          };
        };
      });
    },
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      //获取部门列表
      this.getOrgList();
      if (isEdit) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
        setTimeout(() => {
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          this.imageUrl = data.personalImage;
          console.log(params.blebId);
          params.orgIds = data.orgId;
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
            url = PERSONALINFOUPDATE;
          } else {
            url = PERSONALINFOADD;
          }
          console.log(url);
          this.imageUrl = this.imageUrl.replace(/^blob:/g, "");
          values = {
            ...values,
            workTypeName: this.workTypeName,
            personalImage: this.imageUrl,
          };

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
    getTypeList() {
      this.$axios.get(WORKTYPELISTALL).then((res) => {
        if (res.code == 1) {
          this.workTypeList = res.value;
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
.avatar {
  width: 100px;
  height: 100px;
}
.img-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  &:hover {
    &::before {
      opacity: 1;
      transition: opacity ease 0.4s;
    }

    &:after {
      opacity: 1;
      transition: opacity ease 0.4s;
    }
  }
  &:after {
    top: 0;
    left: 0;
    opacity: 0;
    width: 100px;
    height: 100px;
    position: absolute;
    content: "修改";
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f0f0f0;
  }
  &::before {
    top: 0;
    left: 0;
    opacity: 0;
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
