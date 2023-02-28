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
            <a-input v-decorator="['onlineId']"></a-input>
          </a-form-item>
          <a-form-item label="标题">
            <a-input
              v-decorator="[
                'learningTitle',
                { rules: [{ required: true, message: '请输入...' }] },
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="内容">
            <a-input hidden :rows="8" v-decorator="['learningContent']">
            </a-input>
            <div style="border: 1px solid rgb(204, 204, 204)">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 300px; overflow-y: hidden"
                placeholder="输入内容"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { PERSONALINFOADD, PERSONALINFOUPDATE, WORKTYPELISTALL } from "@/api";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: {
    Editor,
    Toolbar,
  },
  data() {
    //这里存放数据
    return {
      modalVisible: false,
      modalW: "1000px",
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
      editor: null,
      html: "",
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            server: "/api/sysresourceController/uploadImg",
            timeout: 10 * 1000, // 5s
            fieldName: "custom-fileName",
            headers: {
              Accept: "text/x-json",
              Authorization: "",
            },
            maxFileSize: 10 * 1024 * 1024, // 10M
            base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
            meta: {
              otherKey: "yyy",
            },
            onBeforeUpload(file) {
              console.log("onBeforeUpload", file);

              return file; // will upload this file
              // return false // prevent upload
            },
            onProgress(progress) {
              console.log("onProgress", progress);
            },
            onSuccess(file, res) {
              console.log("onSuccess", file, res);
            },
            onFailed(file, res) {
              alert(res.message);
              console.log("onFailed", file, res);
            },
            onError(file, err, res) {
              alert(err.message);
              console.error("onError", file, err, res);
            },
          },
        },
      },
      mode: "default", // or 'simple'
    };
  },
  mounted() {
    // this.editor = Object.seal(editor);
    // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
    // }, 1500);
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  //方法集合
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
      console.log("onCreated", editor);
    },
    onChange(editor) {
      console.log("onChange", editor.children);
    },
    onDestroyed(editor) {
      console.log("onDestroyed", editor);
    },
    onMaxLength(editor) {
      console.log("onMaxLength", editor);
    },
    onFocus(editor) {
      console.log("onFocus", editor);
    },
    onBlur(editor) {
      console.log("onBlur", editor);
    },
    customAlert(info, type) {
      window.alert(`customAlert in Vue demo\n${type}:\n${info}`);
    },
    init() {
      this.getTypeList();
    },
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.form.resetFields();
      console.log(this.$store.state);
      this.editorConfig["MENU_CONF"].uploadImage.headers.Authorization =
        this.$store.state.user.token;
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
          this.editor.setHtml(params.learningContent);
          console.log(params.blebId);
          this.form.setFieldsValue(params);
        }, 600);
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
            url = "/onlineLearningController/update";
          } else {
            url = "/onlineLearningController/save";
          }
          console.log(url);
          values = {
            ...values,
            learningContent: this.editor.getHtml(),
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
::v-deep .ant-form-item-label {
  font-weight: bold;
  float: left;
  width: 80px;
}
::v-deep .ant-form-item-control-wrapper {
  width: calc(100% - 80px);
  float: left;
}
</style>
