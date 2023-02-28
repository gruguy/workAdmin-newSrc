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
            <a-form-item label="种植类型">
              <a-input type="hidden" v-decorator="['appId']" />
              <a-radio-group
                @change="onPlantTypeChange"
                placeholder="请选择种植类型"
                v-decorator="[
                  'plantType',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择种植类型',
                      },
                    ],
                  },
                ]"
              >
                <a-radio
                  v-for="item in plantTypeList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.plantName }}
                </a-radio>
                <!-- <a-radio value="水稻"> 水稻 </a-radio>
              <a-radio value="其他"> 其他 </a-radio> -->
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用工项目">
              <a-radio-group
                @change="onChange"
                placeholder="请选择用工项目"
                v-decorator="[
                  'empProject',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择用工项目',
                      },
                    ],
                  },
                ]"
              >
                <template v-if="projectList && projectList.length">
                  <a-radio
                    v-for="item in projectList"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.projectName }}
                  </a-radio>
                </template>
                <div v-else>暂无用工项目</div>
                <!-- <a-radio value="2"> 拌肥拌药晒种 </a-radio>
                <a-radio value="3"> 播种撒地边撒草 </a-radio> -->
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用工类型">
              <a-radio-group
                @change="onUseTypeChange"
                placeholder="请选择用工类型"
                v-decorator="[
                  'useType',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择用工类型',
                      },
                    ],
                  },
                ]"
              >
                <a-radio value="1"> 点工 </a-radio>
                <a-radio value="2"> 包工 </a-radio>
                <!-- <a-radio value="3"> 固定工 </a-radio> -->
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="form.getFieldValue('useType') == 1">
            <a-form-item label="点工类型">
              <a-radio-group
                @change="onChange"
                placeholder="请选择点工类型"
                v-decorator="[
                  'empType',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择点工类型',
                      },
                    ],
                  },
                ]"
              >
                <a-radio value="1"> 小时工 </a-radio>
                <a-radio value="2"> 天工 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="form.getFieldValue('useType') == 2">
            <a-form-item label="包工目标">
              <a-input type="hidden" v-decorator="['empType']" />
              <a-input-number
                placeholder="包工目标（亩）"
                style="width: 220px"
                v-decorator="[
                  'muProject',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入包工目标（亩）',
                      },
                    ],
                  },
                ]"
              />
              <span style="margin-left: 10px">亩</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :label="projectManagerName">
              <a-input
                type="hidden"
                v-decorator="[
                  'projectManager',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  },
                ]"
              />
              <a-auto-complete
                :placeholder="`请选择${projectManagerName}`"
                style="width: 220px"
                @select="onPSelect"
                @search="onPSearch"
                @change="onPChange"
                option-label-prop="value"
                :allowClear="true"
                v-decorator="[
                  'projectManagerName',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  },
                ]"
              >
                <template slot="dataSource">
                  <a-select-option
                    v-for="item in personlist"
                    :key="item.id"
                    :value="item.personalName"
                    :title="item.personalName"
                  >
                    {{ item.personalName }}
                  </a-select-option>
                </template>
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="用工时间">
              <a-date-picker
                @change="onDateChange"
                v-decorator="[
                  'empTime',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择用工时间',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <!-- <a-form-item hidden label="用工开始时间">
              <a-input v-decorator="['empTime']" />
            </a-form-item>
            <a-form-item hidden label="用工结束时间">
              <a-input v-decorator="['empTimeEnd']" />
            </a-form-item> -->
          </a-col>
          <a-col :span="24">
            <a-form-item label="用工人数">
              <a-input-number
                placeholder="请输入用工人数"
                style="width: 220px"
                v-decorator="[
                  'empPersonalCount',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用工人数',
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>

          <!-- <a-col :span="12">
          <a-form-item label="工作内容">
            <a-textarea
              multiple
              :rows="5"
              placeholder="请输入工作内容"
              v-decorator="[
                'empContents',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入工作内容',
                    },
                  ],
                },
              ]"
            >
            </a-textarea>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="申请图标">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/api/upload/uploadImg"
              :headers="headers"
              :before-upload="beforeUpload"
              @change="handleChange"
              v-decorator="[
                'appImg',
                { rules: [{ required: true, message: '请选择上传图标' }] },
              ]"
            >
              <div v-if="imageUrl" class="img-wrapper">
                <img :src="imageUrl" alt="avatar" />
              </div>
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传图标</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col> -->
        </a-row>
      </a-form>
    </a-spin>
    <!-- <a-divider></a-divider> -->
    <!-- 人员选择table -->
    <!-- <a-table
      :columns="columns"
      :data-source="needArr"
      :pagination="false"
      :loading="listLoading"
    >
      <span
        slot="empWorkType"
        slot-scope="text, record, index"
        style="min-width: 140px; display: inline-block"
      >
        <a-select
          default-value="1"
          @change="changeWOrkType($event, index)"
          style="width: 100px; display: inline-block"
        >
          <a-select-option key="1">小时工</a-select-option>
          <a-select-option key="2">天工</a-select-option>
          <a-select-option key="3">月工</a-select-option>
        </a-select>
      </span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="delItem(record)">删除</a>
      </span>
    </a-table> -->
    <!-- <a-divider></a-divider>
    <a-button
      class="ant-btn ant-btn-dashed"
      icon="plus"
      block
      @click="openPersonList"
      >选择人员</a-button
    >
    <person-list ref="personlist" @ok="getData"></person-list> -->
  </a-modal>
</template>

<script>
import moment from "moment";
import { EMPLOYMENTADD, EMPLOYMENTUPDATE, SYSORGSLIST } from "@/api";
import personList from "@/components/selectPersonlist";
const columns = [
  {
    title: "姓名",
    dataIndex: "personalName",
    key: "personalName",
  },
  {
    title: "工作类别",
    dataIndex: "empWorkType",
    key: "empWorkType",
    scopedSlots: { customRender: "empWorkType" },
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: {
    personList,
  },
  data() {
    //这里存放数据
    return {
      projectManagerName: "项目经理",
      spinning: true,
      loading: false,
      imageUrl: "",
      headers: {
        Authorization: this.$store.state.user.token,
      },
      format: "YYYY-MM-DD",
      listLoading: false,
      columns,
      personlist: [],
      modalVisible: false,
      modalW: "600px",
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
      selectedKeys: [],
      orgList: [],
      needArr: [],
      plantTypeList: [],
      projectList: [],
      currentPlantName: "",
    };
  },
  //方法集合
  methods: {
    onPSelect(value) {
      console.log(value);
      const currentPersonId = this.personlist.find(
        (item) => item.personalName == value
      ).id;
      this.form.setFieldsValue({
        projectManager: currentPersonId,
      });
      // this.dataSource = value ? this.searchResult(value) : [];
      // this.form.setFieldsValue({
      //   projectManager: value,
      // });
      // this.personlist = this.personlist.filter(
      //   (person) => person.name.indexOf(searchText) > -1
      // );
    },
    onPSearch(searchText) {
      this.personlist = this.personlist.filter(
        (person) => person.name.indexOf(searchText) > -1
      );
      console.log(22222);
    },
    onPChange(value) {
      console.log(22222);
      // this.personlist = this.personlist.filter(
      //   (person) => person.name.indexOf(value) > -1
      // );
    },
    onChange(e) {
      console.log(e);
    },
    onUseTypeChange(e) {
      console.log(e.target.value);
      this.$nextTick(() => {
        setTimeout(() => {
          this.form.setFieldsValue({
            empType: e.target.value == 2 ? "4" : e.target.value,
          });
        }, 800);
      });
    },
    onPlantTypeChange(e, i) {
      console.log(e);
      console.log(i);
      // 重置用工项目
      this.form.setFieldsValue({
        empProject: "",
      });
      const id = e.target.value;
      this.currentPlantName = this.plantTypeList.find(
        (item) => item.id === id
      ).plantName;
      console.log(this.currentPlantName);
      this.getProjectList(id);
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
    changeWOrkType(e, index) {
      this.needArr[index].empWorkType = e;
    },
    init() {
      // this.getTypeList();
    },
    onDateChange(date, dateString) {
      console.log(date, dateString);
      this.form.setFieldsValue({
        empTime: dateString[0],
        empTimeEnd: dateString[1],
      });
    },
    getData(keys) {
      this.listLoading = true;
      this.selectedKeys = keys;
      // this.personlist = list;
      // 查询人员
      // this.getPersonList(keys.join(","));
    },
    getDetailData(id) {
      this.$axios.get("/appliactionTypeController/queryVO?id=" + id);
    },
    getPersonList() {
      this.$axios
        .get("/personalInformationController/getListprams", {
          params: { isPm: 1 },
        })
        .then((res) => {
          this.personlist = res.value;
          console.log("this.personlist", this.personlist);
        });
    },
    openPersonList() {
      this.$refs.personlist.showModal(this.selectedKeys);
    },
    openModal(isEdit, data) {
      this.modalVisible = true;
      this.getPlantType();
      this.getPersonList();
      if (isEdit) {
        // 编辑
        this.isEdit = true;
        this.formTitle = "编辑";
        this.$nextTick(async () => {
          console.log(this.form, this);
          this.form.resetFields();
          let params = {};
          for (let key in data) {
            params[key] = data[key];
          }
          params.useType = params.empType != "4" ? params.empType : "2";
          console.log(params);
          this.spinning = true;
          const res = await this.syncGetProjectList(params.plantType);
          this.projectList = res.value;
          this.currentPlantName = this.plantTypeList.find(
            (item) => item.id === params.plantType
          ).plantName;
          console.log(params);
          console.log(params.empType);
          params.empTimeAll = [params.empTime, params.empTimeEnd];
          console.log(params.empTime);
          this.form.setFieldsValue(params);
          setTimeout(() => {
            this.form.setFieldsValue({
              empProject: params.empProject,
              empType: params.empType,
              muProject: params.muProject,
              projectManager: params.projectManager,
              projectManagerName: params.projectManagerName,
            });

            this.spinning = false;
          }, 300);

          console.log(this.form);
          // }, 500);
        });
        // 查询人员
        // this.getPersonList(data.appId);
      } else {
        // 新增
        this.formTitle = "新增";
        this.isEdit = false;
        this.selectedKeys = [];
        this.personlist = [];
        this.form.resetFields();
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
        console.log(err);
        if (!err) {
          this.confirmLoading = true;
          console.log("Received values of form: ", values);
          let url = "";
          console.log(isEdit);
          if (isEdit) {
            url = EMPLOYMENTUPDATE;
          } else {
            url = EMPLOYMENTADD;
          }
          values = {
            ...values,
            appName: this.formatName(this.currentPlantName),
            // applicationTypeBOList: this.needArr,
            // appImg: this.imageUrl,
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
    formatName(name) {
      let now = new Date();
      return (
        name +
        "-" +
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1) +
        "-" +
        now.getDate() +
        " " +
        now.getHours() +
        ":" +
        now.getMinutes()
      );
    },
    workTypeChange(e) {
      this.workTypeName = this.workTypeList.find(
        (item) => item.id === e
      ).workTypeName;
    },
    delItem(obj) {
      console.log(obj);
      this.needArr = this.needArr.filter(
        (item) => item.personalId !== obj.personalId
      );
      this.selectedKeys = this.selectedKeys.filter(
        (item) => item !== obj.personalId
      );
      console.log(this.selectedKeys);
    },
    getPlantType() {
      this.$axios.get("/plantTypeInfoController/getListprams").then((res) => {
        this.spinning = false;
        this.plantTypeList = res.value;
      });
    },
    getProjectList(id) {
      this.spinning = true;
      this.$axios
        .get("/employmentProjectInfoController/getListprams?plantType=" + id)
        .then((res) => {
          this.projectList = res.value;
          this.spinning = false;
        });
    },
    async syncGetProjectList(id) {
      return await this.$axios.get(
        "/employmentProjectInfoController/getListprams?plantType=" + id
      );
    },
    async syncGetPlantTypeList() {
      return await this.$axios.get("/plantTypeInfoController/getListprams");
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
  width: 100px;
}
::v-deep .ant-form-item-control-wrapper {
  width: calc(100% - 100px);
  float: left;
}
::v-deep .ant-empty-normal {
  margin: 0;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
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
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
