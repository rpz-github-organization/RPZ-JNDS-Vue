<template>
  <div class="Signin">
    <img src="https://rpzoss.oss-cn-chengdu.aliyuncs.com/Public/8-8-2019-summber-bg.jpeg"
     alt="" class="cover-bg">
    <h3 v-html="SigninTitle"></h3>

    <SigninForm :check="false" ></SigninForm>
  </div>
</template>

<script>
import SigninForm from './SigninForm.vue';

export default {
  name: 'Signin',
  props: {
    SigninTitle: String,
  },
  components: {
    SigninForm,
  },
  data() {
    return {

    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Signin {
  width: 90%;
  margin: 10px auto 110px auto;
  text-align: center;
}
.Signin h1,h2,h3,h4,h5 {
  margin-top: 15px;
  margin-bottom: 0;
  font-weight: bolder;
}

.cover-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  opacity: 0.3;
}
</style>
