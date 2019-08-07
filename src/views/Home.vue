<template>
  <div class="home">
    <Signin :SigninTitle="SigninTitle"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Signin from '../components/Signin.vue';

export default {
  name: 'home',
  components: {
    Signin,
  },
  data() {
    return {
      No: 14,
    };
  },
  computed: {
    SigninTitle() {
      return `<h3 style="font-weight: bolder; margin: 0;">四川师范大学</h3>
      <h2>第${this.No}届计算机技能大赛</h2><h3>✍️报名处</h3>`;
    },
  },
};
</script>

<style scoped>
  .row-container {
    display: block;
  }

  .logo {
    display: inline-block;
    margin: 0 20px;
    width: 28%;
  }
</style>
