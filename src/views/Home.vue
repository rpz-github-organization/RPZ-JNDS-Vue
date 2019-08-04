<template>
  <div class="home">
    <div class="flex-container">
      <img class="logo" alt="SICNU logo" width="100" src="../assets/sicnulogo.jpg">
      <img class="logo" alt="JNDS logo" width="100" src="../assets/jklogo.png">
    </div>
    <Signin :SigninTitle="SigninTitle"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Signin from '@/components/Signin.vue';

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
  .flex-container {
    display: flex;
    justify-content: center;
  }

  .logo {
    margin: 0 20px;
  }
</style>
