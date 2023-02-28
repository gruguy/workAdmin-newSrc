<template>
  <a-modal
    :title="formTitle"
    :visible="modalVisible"
    :confirmLoading="confirmLoading"
    :width="modalW"
    @ok="handleOk"
    @cancel="handleModalCancel"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item hidden>
              <a-input v-decorator="['id']"></a-input>
            </a-form-item>
            <a-form-item
              label="项目名"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                placeholder="请输入项目名"
                v-decorator="[
                  'projectName',
                  { rules: [{ required: true, message: '请输入项目名' }] },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="种植类型"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-radio-group
                placeholder="请选择种植类型"
                v-decorator="[
                  'plantType',
                  { rules: [{ required: true, message: '请选择种植类型' }] },
                ]"
              >
                <a-radio :value="item.id" v-for="item in plantTypeList">
                  {{ item.plantName }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              label="指导价"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input-number
                placeholder="请输入指导价"
                style="width: 100%"
                v-decorator="[
                  'guidePrice',
                  { rules: [{ required: true, message: '请输入指导价' }] },
                ]"
              >
              </a-input-number>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              label="价格单位"
              :label-col="formLayout.labelCol"
              :wrapper-col="formLayout.wrapperCol"
            >
              <a-input
                placeholder="请输入价格单位"
                v-decorator="[
                  'proUnit',
                  {
                    rules: [{ required: true, message: '请输入价格单位' }],
                  },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data() {
    //这里存放数据
    return {
      spinning: true,
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
      plantTypeList: [],
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
    getPlantTypeList() {
      this.$axios.get("plantTypeInfoController/getListprams").then((res) => {
        this.plantTypeList = res.value;
        this.spinning = false;
      });
    },
    openModal(isEdit, data) {
      this.spinning = true;
      this.getPlantTypeList();
      this.modalVisible = true;
      this.form.resetFields();
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
          this.form.setFieldsValue(params);
        }, 300);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            proUnit: "元/亩",
          });
        });
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
            url = "employmentProjectInfoController/update";
          } else {
            url = "employmentProjectInfoController/save";
          }
          console.log(url);
          values = {
            ...values,
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
