<template>
  <div class="Check">
    <h3> * 查询报名结果 * </h3>

    <SigninForm :check="true" ></SigninForm>
  </div>
</template>

<script>
import SigninForm from '@/components/SigninForm.vue';

export default {
  name: 'Check',
  components: {
    SigninForm,
  },
  data() {
    return {

    };
  },
};
</script>

<style scoped>
.Check {
  padding: 20px;
}

.Check h1,h2,h3,h4,h5 {
  margin-top: 15px;
  font-weight: bolder;
}
</style>
