<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-27 22:16:26
 * @LastEditTime: 2022-09-16 16:53:24
 * @Description: 组件创建
-->
<template>
  <div class="content">
    <a-input-search
      style="margin-bottom: 8px"
      placeholder="搜索机构名"
      @change="onChange"
    />
    <a-tree
      v-if="orglist && orglist.length"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="orglist"
      :selected-keys="selectedKeys"
      @expand="onExpand"
      @select="onSelect"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
    <common-loading ref="commonLoading"></common-loading>
  </div>
</template>

<script>
import { SYSORGSLIST } from "@/api";

import CommonLoading from "@/components/Loading";
export default {
  data() {
    return {
      orglist: [],
      autoExpandParent: false,
      expandedKeys: ["1"],
      selectedKeys: ["1"],
      selectedKeyBack: [],
      searchValue: "",
      allKeys: [],
      allKeysVal: [],
      loadingVisible: true,
    };
  },

  components: { CommonLoading },

  computed: {},

  methods: {
    onExpand(expandedKeys) {
      console.log(expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    onSelect(e) {
      console.log(e);
      if (e.length) {
        this.selectedKeyBack = e;
        this.selectedKeys = e;
      } else {
        this.selectedKeys = this.selectedKeyBack;
      }
      // this.selectedKeys = e;
      this.$parent.$refs.userlist.getDataList({
        orgId: this.selectedKeys.join(","),
      });
    },
    onChange(e) {
      const value = e.target.value;
      console.log(value);
      console.log(this.allKeys);
      const expandedKeys = this.allKeysVal
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.orglist);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    getDataList(data) {
      this.loading = true;
      this.$axios
        .get(SYSORGSLIST, {
          params: data,
        })
        .then((res) => {
          const arr = [];
          this.selectedKeys = [res.value[0].soId];
          this.expandedKeys = [res.value[0].soId];
          this.selectedKeyBack = this.selectedKeys;
          this.orglist = this.initRes(res.value, arr);
          console.log(this.orglist);
          console.log(this.allKeys);
          this.loading = false;
          this.$refs.commonLoading.hideLoading();
        });
    },

    initRes(res, temp) {
      console.log(temp);
      res &&
        res.length &&
        res.forEach((item, index) => {
          this.allKeys.push(item.soId);
          this.allKeysVal.push({ key: item.soId, title: item.soBname });
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
  },
};
</script>
<style lang="css" scoped>
.content {
  position: relative;
  height: 100%;
}
</style>
