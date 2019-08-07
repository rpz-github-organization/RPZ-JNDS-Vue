<template>
  <div class="Check">
    <img class="cover-bg"
    src="https://rpzoss.oss-cn-chengdu.aliyuncs.com/Public/8-8-2019-search-bg.png" alt="">
    <h3> * 查询报名结果 * </h3>

    <SigninForm :check="true" ></SigninForm>
  </div>
</template>

<script>
import SigninForm from '../components/SigninForm.vue';

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

.cover-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  object-fit: scale-down;
  width: 100%;
  opacity: 0.5;
}
</style>
