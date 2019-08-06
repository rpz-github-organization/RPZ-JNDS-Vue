<template>
  <div class="Signin">
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
  margin: 10px auto;
  text-align: center;
}
.Signin h1,h2,h3,h4,h5 {
  margin-top: 15px;
  font-weight: bolder;
}

</style>
