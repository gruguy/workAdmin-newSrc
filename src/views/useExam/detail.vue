<!--
 * @Description:
 * @Version: 1.0
 * @Author: gruguy
 * @Date: 2022-03-07 10:17:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-02 10:59:17
-->
<template>
  <a-modal
    :title="modalTitle"
    :visible="detailVisible"
    @ok="handleDetailOk"
    @cancel="handleDetailCancel"
    width="900px"
  >
    <a-list>
      <h3>基本信息</h3>
      <a-list-item
        ><b>申请主题：{{ detailData.appName }}</b></a-list-item
      >
      <a-list-item>用人申请描述：{{ detailData.empContents }}</a-list-item>
      <a-list-item
        >审批状态：
        <a-tag v-if="detailData.auditingState == 2" color="#f50">
          被退回
        </a-tag>
        <a-tag v-if="detailData.auditingState == 1" color="#2db7f5">
          待审批
        </a-tag>
        <a-tag v-if="detailData.auditingState == 3" color="#87d068">
          审批中
        </a-tag>
        <a-tag v-if="detailData.auditingState == 4" color="#108ee9">
          已完成
        </a-tag>
      </a-list-item>
      <a-list-item>发起时间：{{ detailData.empTime }}</a-list-item>
    </a-list>
    <!-- 审批流程展示 -->
    <div class="steps">
      <h3>审批进度</h3>
      <a-steps :current="1" status="process" v-if="detailData.examState !== 4">
        <a-step title="完成" description="xadmin申请完成" />
        <a-step title="审批中" description="分厂领导审批" />
        <a-step title="待审批" description="总公司领导审批" />
      </a-steps>
      <a-steps :current="2" status="finish" v-else>
        <a-step title="完成" description="xadmin申请完成" />
        <a-step title="完成" description="分厂领导审批" />
        <a-step title="完成" description="总公司领导审批" />
      </a-steps>
    </div>
  </a-modal>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      modalTitle: "用工审批详情",
      detailVisible: false,
      detailData: {},
    };
  },
  //方法集合
  methods: {
    show(data) {
      this.detailVisible = true;
      this.detailData = data;
    },
    handleDetailOk() {},
    handleDetailCancel() {
      this.detailVisible = false;
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
};
</script>
<style lang="scss" scoped></style>
