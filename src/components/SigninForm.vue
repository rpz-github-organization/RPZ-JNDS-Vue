<template>
  <div class="SigninForm">

    <!-- check 所需的视图部分 -->
    <a-tabs
      defaultActiveKey="id"
      @change="checkTypeCallback"
      style="margin-bottom: 25px;"
      v-show="check"
    >
      <!-- 可输入票据号 id 的 Tab panel -->
      <a-tab-pane tab="🎫按票据号查找" key="id">
        <a-input-search
          placeholder="请输入您的报名票据号"
          v-model="check_id"
          ref="userNameInput"
          @search="findById"
        >
          <a-icon slot="prefix" type="link" />
          <a-button slot="enterButton">查询</a-button>
        </a-input-search>
      </a-tab-pane>

      <!-- 可输入查询的各项目的 Tab panel -->
      <a-tab-pane tab="📋按信息查找" key="props" forceRender>
        <a-alert message=" 请注意：三个查询字段都是可选的" type="warning" showIcon
        style="margin-bottom: 15px; text-align: left; font-weight: bold;"/>
        <a-input addonBefore="姓名: " placeholder="请输入要查询的报名者姓名"
         style="margin-bottom: 10px;" v-model="check_name" />
        <a-input addonBefore="学号: " placeholder="请输入要查询的报名者学号"
         style="margin-bottom: 10px;" v-model="check_sicnuid" />
        <a-input addonBefore="手机: " placeholder="请输入要查询的报名者手机号"
         style="margin-bottom: 10px;" v-model="check_phone" />
        <a-button block icon="search" @click="findByProps">查询</a-button>
      </a-tab-pane>
    </a-tabs>

    <!-- 提交与动作的结果返回提示 -->
    <a-alert
      class="copyid"
      v-if="alert_show"
      :data-clipboard-text="record_id"
      @click="copyFallback"
      :message="alert_title"
      :description="alert_content"
      :type="alert_type"
      showIcon
      style="margin-bottom: 20px;"
    />

    <!-- 报名表单卡片视图 -->
    <a-card hoverable v-show="form_show" style="margin-bottom: 20px;"
    v-for="(card, ckey) in form_cards" :key="ckey">
      <a-card-meta title=" * 您的报名表单 * ">
        <p class="form-card-description" slot="description">
          请仔细填写，单人参赛与组队参赛请分两次报名
        </p>
      </a-card-meta>

      <!-- 报名表单卡片 action栏 -->
      <template class="ant-card-actions" slot="actions">
        <div @click="saveAndSubmit(ckey)">
          <a-icon type="save" />
          <span class="save-span">保存并提交</span>
        </div>
      </template>

      <!-- 表单内容 -->
      <div class="form-content">
        <!-- 报名方式 单人还是组队 -->
        <a-row style="margin-bottom: 20px;">
          <label class="form-label" for="group-select">报名方式：</label>
          <a-radio-group id="singleOrNot" v-model="card.single"
          @change="onSignTypeChange($event, ckey)">
            <a-radio :value="1">单人</a-radio>
            <a-radio :value="0">组队</a-radio>
          </a-radio-group>
        </a-row>

        <!-- 报名项目组别 -->
        <a-row style="margin-bottom: 20px;">
          <label class="form-label" for="group-select">报名组别：</label>
          <a-radio-group :options="projectOptions"
          style="width:50%;margin:0;display:inline-flex;
           flex-direction:column;"
          v-model="card.project" />
        </a-row>

        <!-- 填写组员人数 -->
        <a-row style="margin-bottom: 20px;" v-show="!card.single">
          <label class="form-label" for="member-count">组员人数：</label>
          <a-input-number
            id="member-count"
            :min="2"
            :max="4"
            :step="1"
            v-model="card.member_count"
            @change="onMemberCountChange($event, ckey)"
          />
        </a-row>

        <p class="member-info-title">* 参赛人员信息 *</p>

        <!-- 填写参赛人员信息 -->
        <a-card
          v-for="(member, mkey) in card.info_list"
          :key="mkey"
          style="margin-bottom: 15px;"
          hoverable
        >
          <!-- 组员姓名 -->
          <a-input
            addonBefore="姓名:"
            placeholder="请输入参赛者姓名"
            v-model="member.name"
            style="margin-bottom: 16px"
          />
          <!-- 组员学号 -->
          <a-input
            addonBefore="学号:"
            placeholder="请输入参赛者学号"
            v-model="member.sicnuid"
            style="margin-bottom: 16px"
          />
          <!-- 组员手机号 -->
          <a-input addonBefore="手机:"
           placeholder="请输入参赛者手机号" v-model="member.phone"
          />
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import projectinfojson from '../assets/project-info.json';

const projectOptionsArray = [
  { label: '计算机综合素质竞赛', value: '计算机综合素质竞赛' },
  { label: '微课与课件设计', value: '微课与课件设计' },
  { label: '数字媒体设计', value: '数字媒体设计' },
  { label: '平面艺术设计', value: '平面艺术设计' },
  { label: '算法与AI应用', value: '算法与AI应用' },
];

export default {
  name: 'SigninForm',
  props: {
    check: Boolean,
  },
  data() {
    const clipboard = new Clipboard('.copyid');
    clipboard.on('success', (e) => {
      this.copyFallback();
      e.clearSelection();
    });

    return {

      // check 的方式
      check_type: 'id',
      // check 查询的数据项
      check_id: '',
      check_name: '',
      check_sicnuid: '',
      check_phone: '',

      form_show: !this.check,
      // 表单卡片数组 ->
      // - 报名时：只给一张表单卡片，卡片内info_list 可以填写多人
      // - 查询时若出现一人多个报名记录： v-for 表单数组 渲染卡片
      projectinfo: projectinfojson,
      projectOptions: projectOptionsArray,
      form_cards: [],

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
      // 检查所有表单卡片里的 info_list input框填写情况
      let validateResult = true;
      for (let i = 0, len = this.form_cards.length; i < len; i += 1) {
        // eslint-disable-next-line
        this.form_cards[i].info_list.forEach((info) => {
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
                if (info[key].length < 2) validateResult = false;
                break;
            }
          });
        });
        // 若没有选择报名项目同样返回错误
        if (this.form_cards[i].project === '') validateResult = false;
      }

      return validateResult;
    },
  },
  created() {},
  mounted() {
    // 默认单卡
    this.initFormCards();
    // 单人
    this.flushMemberList(0, this.form_cards[0].member_count);
  },
  methods: {
    // alert 的封装
    alertMsg(type, title, content) {
      this.alert_type = type;
      this.alert_title = title;
      this.alert_content = content;

      this.alert_show = true;
    },
    // alert 中的 id号 复制成功的回调
    copyFallback() {
      this.$message.success('复制成功，快去粘贴保存起来吧！');
    },

    // 查询方式 tab 变更回调
    checkTypeCallback(key) {
      this.check_type = key;

      this.alert_title = ''; this.alert_content = '';
      this.alert_show = false;
      this.form_show = false;
    },
    // 查询的两个方式：
    findById() {
      this.$http.get(`/jnds/check/${this.check_id}`)
        .then((res) => {
          console.log(res.data);
          this.form_cards[0].member_count = res.data.bundle_data.result.info_list.length;
          this.form_cards[0].single = res.data.bundle_data.result.single;
          this.form_cards[0].project = res.data.bundle_data.result.project;
          this.form_cards[0].info_list = res.data.bundle_data.result.info_list;
          this.form_show = true;
          this.alertMsg(
            'success',
            '为您查询到如下记录',
            '请您仔细查看并核对，如有错误请及时修改！',
          );
        })
        .catch((err) => {
          this.alertMsg(
            'error',
            '没有查询到报名记录',
            '可能是出错了，如果问题持续存在请联系计协进行咨询！',
          );
          console.log(err.response);
        });
    },
    findByProps() {
      // 避免查询条件未填写
      if (this.check_type === 'props' && (this.check_name === ''
       && this.check_sicnuid === '' && this.check_phone === '')) {
        this.$message.error('你还没有输入查询的相关信息！', 2);
        return;
      }

      // 构造 GET 请求 带query的字符串
      let queryurl = '/jnds/check/?';
      if (this.check_name !== '') queryurl = queryurl.concat(`name=${this.check_name}&`);
      if (this.check_sicnuid !== '') queryurl = queryurl.concat(`sicnuid=${this.check_sicnuid}&`);
      if (this.check_phone !== '') queryurl = queryurl.concat(`phone=${this.check_phone}&`);

      this.$http.get(queryurl)
        .then((res) => {
          console.log(res.data);
          const results = res.data.bundle_data.result;
          this.form_cards = [];
          for (let i = 0, len = results.length; i < len; i += 1) {
            this.form_cards.push({
              // eslint-disable-next-line
              id: results[i]._id,
              member_count: results[i].info_list.length,
              single: results[i].single,
              project: results[i].project,
              info_list: results[i].info_list,
            });
          }

          this.form_show = true;
          this.alertMsg(
            'success',
            '为您查询到如下记录',
            '请您仔细查看并核对，如有错误请及时修改！',
          );
        })
        .catch((err) => {
          this.alertMsg(
            'error',
            '没有查询到报名记录',
            '可能是出错了，如果问题持续存在请联系计协进行咨询！',
          );
          console.log(err.response);
        });
    },

    // 表单卡片数组的初始化：
    initFormCards() {
      this.form_cards = [];
      this.form_cards.push({
        member_count: 1,
        // 以下是表单部分内的数据
        single: true,
        project: '',
        info_list: [],
      });
    },
    // 以下是表单相关的函数：
    // 刷新成员列表，可选补充式或重写式
    flushMemberList(i, value, flush = false) {
      const val = flush ? value : value - this.form_cards[i].info_list.length;
      if (flush) this.form_cards[i].info_list = [];
      for (let j = 0; j < val; j += 1) {
        this.form_cards[i].info_list.push({
          name: '',
          sicnuid: '',
          phone: '',
        });
      }
    },
    // 当报名类型发生变化时
    onSignTypeChange(e, ckey) {
      // e.target.value 代表 single : 是否是单人报名
      let isFlush = false;
      if (!e.target.value) {
        this.form_cards[ckey].member_count = 2;
      } else {
        this.form_cards[ckey].member_count = 1;
        isFlush = true;
      }
      this.flushMemberList(ckey, this.form_cards[ckey].member_count, isFlush);
    },
    // 当参赛人员数量变化时
    onMemberCountChange(count, ckey) {
      if (count < this.form_cards[ckey].info_list.length) this.form_cards[ckey].info_list.pop();
      this.flushMemberList(ckey, count, false);
    },
    // 提交新的表单或是更新已有记录
    saveAndSubmit(ckey) {
      if (this.check_type === 'id' && this.check_id !== '') {
        // 提交已有记录的 表单更新请求
        if (this.validateInfoList) {
          this.$http
            .put(`/jnds/signin/${this.check_id}`, {
              single: this.form_cards[0].single,
              project: this.form_cards[0].project,
              info_list: this.form_cards[0].info_list,
            })
            .then((res) => {
              // console.log(res);
              const action = '更新';
              this.$message.success(`您的报名信息已经${action}成功`, 2);
              // Mongodb 中记录的索引id号
              // eslint-disable-next-line
              this.record_id = res.data.bundle_data.result._id;
              this.alertMsg(
                'success',
                `票据号 ${this.record_id} 的报名信息已更新，点击可复制 id 号`,
                '票据号是您查询的最便捷方式，请妥善保存到赛事开始前，若对本次报名有任何疑问请到成龙校区西实验楼105咨询。',
              );
            })
            .catch((err) => {
              // console.log(err);
              this.alertMsg(
                'error',
                '提交失败！可能是哪里出了错误!',
                `${err.response.data.msg}`,
              );
            });
        } else {
          this.$message.error('您的报名表单填写有误，请检查后重试', 2);
        }
      } else if (this.check_type === 'props') {
        // 提交已有记录的 表单更新请求
        if (this.validateInfoList) {
          console.log(ckey);
          this.$http
            .put(`/jnds/signin/${this.form_cards[ckey].id}`, {
              single: this.form_cards[ckey].single,
              project: this.form_cards[ckey].project,
              info_list: this.form_cards[ckey].info_list,
            })
            .then((res) => {
              // console.log(res);
              const action = '更新';
              this.$message.success(`您的报名信息已经${action}成功`, 2);
              // Mongodb 中记录的索引id号
              // eslint-disable-next-line
              this.record_id = res.data.bundle_data.result._id;
              this.alertMsg(
                'success',
                `票据号 ${this.record_id} 的报名信息已更新，点击可复制 id 号`,
                '票据号是您查询的最便捷方式，请妥善保存到赛事开始前，若对本次报名有任何疑问请到成龙校区西实验楼105咨询。',
              );
            })
            .catch((err) => {
              // console.log(err);
              this.alertMsg(
                'error',
                '提交失败！可能是哪里出了错误!',
                `${err.response.data.msg}`,
              );
            });
        } else {
          this.$message.error('您的报名表单填写有误，请检查后重试', 2);
        }
      } else if (!this.check) {
        // 提交新的表单，新的表单只能是 表单卡片Array的唯一的那一个
        if (this.validateInfoList) {
          this.$http
            .post('/jnds/signin/', {
              single: this.form_cards[0].single ? 1 : 0,
              project: this.form_cards[0].project,
              info_list: this.form_cards[0].info_list,
            })
            .then((res) => {
              console.log(res);
              const action = '录入';
              this.$message.success(`您的报名信息已经${action}成功`, 2);
              // Mongodb 中记录的索引id号
              // eslint-disable-next-line
              this.record_id = res.data.bundle_data.result._id;
              this.alertMsg(
                'success',
                `这是你的报名票据号，点击即可复制  ${this.record_id}`,
                '票据号是您查询的最便捷方式，请妥善保存到赛事开始前，若对本次报名有任何疑问请到成龙校区西实验楼105咨询。',
              );
            })
            .catch((err) => {
              console.log(err);
              this.alertMsg(
                'error',
                '提交失败！可能是哪里出了错误!',
                `${err.response.data.msg}`,
              );
            });
        } else {
          this.$message.error('您的报名表单填写有误，请检查后重试', 2);
        }
      }

      // 避免；用户看不到成功/错误的提示，滑动至顶部
      window.scroll(0, 0);
    },
  },
};
</script>

<style scoped>
.copyid {
  cursor: pointer;
}

.save-span {
  font-weight: bold;
  margin-left: 13px;
}

.member-info-title {
  text-align: center;
  font-size: 17px;
  font-weight: bold;
}

.form-label {
  font-weight: bold;
  width: 35%;
  display: inline-block;
}
.form-content {
  text-align: left;
  width: 100%;
  padding: 10px;
  margin: 20px auto;
}

.form-card-description {
  font-size: 11px;
  color: rgba(0,0,0,.45);
}
</style>
