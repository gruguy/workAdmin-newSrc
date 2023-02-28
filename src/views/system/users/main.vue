<!--
 * @Author: gruguy
 * @lastEditor: gruguy
 * @Date: 2022-05-20 16:55:38
 * @LastEditTime: 2022-09-16 16:18:09
 * @Description: 组件创建
-->
<template>
  <div class="cont view">
    <!-- <breadcrumb> </breadcrumb> -->
    <div class="leftOrg">
      <department-tree ref="departmentTree"></department-tree>
    </div>
    <div class="rightUserlist">
      <user-list ref="userlist"></user-list>
    </div>
  </div>
</template>

<script>
import UserList from "./index";
import DepartmentTree from "@/components/DepartmentTree";
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  data() {
    return {
      orglist: [],
      autoExpandParent: true,
      expandedKeys: [],
      searchValue: "",
      allKeys: [],
    };
  },

  components: { UserList, DepartmentTree, Breadcrumb },

  computed: {},
  mounted() {
    const orgId = this.$store.state.user.orgId;
    this.$refs.departmentTree.getDataList({ ids: orgId });
    this.$refs.userlist.getDataList({ orgId });
  },
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
      this.$refs.userlist.getDataList({
        orgId: e.join(","),
      });
    },
    onChange(e) {
      const value = e.target.value;
      console.log(value);
      console.log(this.allKeys);
      const expandedKeys = this.allKeys
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
          this.orglist = this.initRes(res.value, arr);
          console.log(this.orglist);
          console.log(this.allKeys);
          this.loading = false;
        });
    },

    initRes(res, temp) {
      console.log(temp);
      res &&
        res.length &&
        res.forEach((item, index) => {
          this.allKeys.push({ key: item.soId, title: item.soId });
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
<style lang="scss" scoped>
.cont {
  display: flex;
  .leftOrg {
    width: 220px;
    padding: 10px;
    height: calc(100vh - 150px);
    overflow: auto;
    margin-right: 10px;
    display: block;
    background-color: #fff;
  }
  .rightUserlist {
    flex: 1;
  }
}
</style>
