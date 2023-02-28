<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-23 13:13:31
 * @LastEditTime: 2022-05-23 13:44:22
 * @Description: 组件创建
-->
<template>
  <a-modal
    v-model="promptVisible"
    :title="title"
    @ok="onOk"
    :confirmLoading="confirmLoading"
  >
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      @submit="handleSubmit"
    >
      <a-form-item label="原因">
        <a-input
          v-decorator="[
            'reason',
            { rules: [{ required: true, message: '请输入原因' }] }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    title: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      promptVisible: false,
      confirmLoading: false
    };
  },

  components: {},

  computed: {},

  methods: {
    showModal() {
      this.promptVisible = true;
    },
    onOk() {
      this.handleSubmit();
    },
    onHide() {
      this.promptVisible = false;
      this.confirmLoading = false;
      this.form.resetFields();
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          console.log("Received values of form: ", values);
          this.$emit("ok", values);
        }
      });
    }
  }
};
</script>
<style lang="css" scoped></style>
