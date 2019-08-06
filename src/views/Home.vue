<template>
  <div class="home">
    <div class="row-container">
      <img class="logo" alt="SICNU logo"  src="../assets/sicnulogo.jpg">
      <img class="logo" alt="JNDS logo" src="../assets/jklogo.png">
    </div>
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
      return `<h2 style="font-weight: bolder; margin: 0;">四川师范大学</h2>
      第${this.No}届计算机技能大赛 · 报名处`;
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
