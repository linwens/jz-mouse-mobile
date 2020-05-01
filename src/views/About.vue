<template>
  <div class="about">
    <h1>This is an about page</h1>
    <van-button type="default">默认按钮</van-button>
  </div>
</template>
<script>
import { Button } from 'vant';

export default {
  data() {
    return {};
  },
  components: {
    'van-button': Button,
  },
};
</script>
<style lang="scss">

</style>
