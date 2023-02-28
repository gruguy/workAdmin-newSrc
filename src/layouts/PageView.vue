<template>
  <div class="content">
    <div class="page-header-index-wide">
      <slot>
        <router-view ref="content" />
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageView'
  }
</script>

<style lang=scss rel="stylesheet/scss" scoped>
    @import '@/assets/styles/global.scss';

</style>
