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
            <a-input v-decorator="['id']" style="width: 100%"></a-input>
          </a-form-item>
          <a-form-item
            label="交通费"
            :label-col="formLayout.labelCol"
            :wrapper-col="formLayout.wrapperCol"
          >
            <a-input-number
              style="width: 100%"
              placeholder="请输入交通费"
              v-decorator="[
                'trafficExpense',
                { rules: [{ required: true, message: '请输入交通费' }] },
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
      imageUrl: "",
      loading: false,
    };
  },
  //方法集合
  methods: {
    init() {},
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
    analyzeIDCard(IDCord) {
      var sexAndAge = {};
      //获取用户身份证号码
      var userCard = IDCord;
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
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log("isEdit", isEdit);
      if (isEdit) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "补充交通费";
        setTimeout(() => {
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          this.imageUrl = data.personalImage;
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
            url = "/projectManagerClockController/update";
          } else {
            url = PERSONALINFOADD;
          }
          console.log(url);
          values = {
            ...values,
            workTypeName: this.workTypeName,
            personalImage: this.imageUrl,
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
