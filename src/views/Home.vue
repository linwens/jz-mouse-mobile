<template>
  <div class="home">
    <top-bar>
      <template>
        <xs-select class="ml17" />
      </template>
    </top-bar>

    <tab-bar />
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from '@/components/TopBar/index.vue';
import FormSelect from '@/components/Form/select.vue';
import TabBar from '@/components/TabBar/index.vue';

export default {
  name: 'Home',
  components: {
    TopBar,
    'xs-select': FormSelect,
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
