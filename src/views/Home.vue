<template>
  <div class="home">
    <top-bar>
      <template>
        slot
      </template>
    </top-bar>

    <tab-bar />
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from '@/components/TopBar/index.vue';
import TabBar from '@/components/TabBar/index.vue';

export default {
  name: 'Home',
  components: {
    TopBar,
    TabBar,
  },
};
</script>
<style lang="scss">
  .test-box{
    width: 200px;
    height: 50px;
    background-color: red;
  }
</style>
