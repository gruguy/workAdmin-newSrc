<template>
  <a-pagination
    @change="onChange"
    :hideOnSinglePage="hideOnSinglePage"
    :defaultCurrent="current"
    :total="total"
  />
</template>

<script>
export default {
  name: "pagination",
  props: ["total", "current"],
  data() {
    return {
      hideOnSinglePage: false,
    };
  },
  methods: {
    onChange(page) {
      console.log(page);
      this.$emit("getCurrentPage", page);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global";
</style>
