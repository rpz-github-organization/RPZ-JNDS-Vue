<template>
  <div class="Signin">
    <h3 v-html="SigninTitle"></h3>

    <SigninForm :projectinfo="projectinfo" :check="false" ></SigninForm>
  </div>
</template>

<script>
import projectinfojson from '@/assets/project-info.json';
import SigninForm from '@/components/SigninForm.vue';

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
      projectinfo: projectinfojson,

      member_count: 1,
      // 以下是表单部分的数据
      single: true,
      project: '',
      info_list: [],

      // 提交后的反馈数据信息
      record_id: '',
      alert_show: false,
      alert_type: 'success',
      alert_title: '',
      alert_content: '',
    };
  },
  computed: {
    validateInfoList() {
      let validateResult = true;
      this.info_list.forEach((info) => {
        Object.keys(info).forEach((key) => {
          switch (key) {
            case 'phone':
            // 中国大陆地区的手机号为 11 位数字
              validateResult = /^\d{11}$/.test(info[key]);
              break;
            case 'sicnuid':
            // 四川师范大学的学号一般为 10位
              validateResult = /^\d{10}$/.test(info[key]);
              break;
            default:
              if (info[key].length === 0) validateResult = false;
              break;
          }
        });
      });
      return validateResult;
    },
  },
  mounted() {
    this.refreshMemberList(this.member_count);
  },
  methods: {
    refreshMemberList(value, flush = false) {
      const val = flush ? value : value - this.info_list.length;
      this.info_list = flush ? [] : [...this.info_list];
      for (let i = 0; i < val; i += 1) {
        this.info_list.push({
          name: '',
          sicnuid: '',
          phone: '',
        });
      }
    },
    // 当报名类型发生变化时
    onSignTypeChange(e) {
      // e.target.value 代表是否是单人报名
      let flush = false;
      if (!e.target.value) {
        this.member_count = 2;
      } else {
        this.member_count = 1;
        flush = true;
      }
      this.refreshMemberList(this.member_count, flush);
    },
    // 当参赛人员数量变化时
    onMemberCountChange(value) {
      this.refreshMemberList(value);
    },

    // 提交表单
    saveAndSubmit() {
      this.$http.post(
        '/jnds/signin/',
        {
          single: this.single ? 1 : 0,
          project: this.project,
          info_list: this.info_list,
        },
      ).then((res) => {
        console.log(res);
        this.$message.success('您的报名信息已经录入成功', 10);
        // Mongodb 中记录的索引id号
        // eslint-disable-next-line
        this.record_id = res.data.bundle_data.result._id;
        this.alert_title = `这是你本次报名记录的票据号  ${this.record_id}`;
        this.alert_content = `票据号是您查询的最便捷方式，请妥善保存到赛事开始前，
        若对本次报名有任何疑问请到成龙校区西实验楼105咨询。`;
        this.alert_type = 'success';
        this.alert_show = true;
      }).catch((err) => {
        console.log(err);
      });
    },
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
