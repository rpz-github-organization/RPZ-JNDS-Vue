<template>
  <div class="SigninForm">
    <!-- 提交与动作的结果返回提示 -->
    <a-alert
      class="copyid"
      v-show="alert_show"
      :data-clipboard-text="record_id"
      @click="copyFallback"
      :message="alert_title"
      :description="alert_content"
      :type="alert_type"
      showIcon
      style="margin-bottom: 20px;"
    />

    <!-- 报名表单卡片视图 -->
    <a-card hoverable>
      <a-card-meta title=" * 您的报名表单 * " description="请仔细填写，单人参赛与组队参赛请分两次报名"></a-card-meta>
      <!-- 报名表单卡片 action栏 -->
      <template class="ant-card-actions" slot="actions">
        <div @click="saveAndSubmit">
          <a-icon type="save" />
          <span class="save-span">保存并提交</span>
        </div>
      </template>

      <!-- 表单内容 -->
      <div class="form-content">
        <!-- 报名方式 单人还是组队 -->
        <a-row style="margin-bottom: 20px;">
          <label class="form-label" for="group-select">报名方式：</label>
          <a-radio-group id="singleOrNot" v-model="single" @change="onSignTypeChange">
            <a-radio :value="true">单人</a-radio>
            <a-radio :value="false">组队</a-radio>
          </a-radio-group>
        </a-row>

        <!-- 报名项目组别 -->
        <a-row style="margin-bottom: 20px;">
          <label class="form-label" for="group-select">报名组别：</label>
          <a-select id="group-select" size="default" style="width: 65%;" v-model="project">
            <a-select-option
              v-for="(item, pkey) in projectinfo"
              :key="pkey"
              :value="item.name"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-row>

        <!-- 填写组员人数 -->
        <a-row style="margin-bottom: 20px;" v-show="!single">
          <label class="form-label" for="member-count">组员人数：</label>
          <a-input-number
            id="member-count"
            :min="2"
            :max="4"
            :step="1"
            v-model="member_count"
            @change="onMemberCountChange"
          />
        </a-row>

        <p class="member-info-title">* 参赛人员信息 *</p>

        <!-- 填写参赛人员信息 -->
        <a-card v-for="(member, mkey) in info_list" :key="mkey"
        style="margin-bottom: 15px;" hoverable>
          <a-input
            addonBefore="姓名:"
            placeholder="请输入参赛者姓名"
            v-model="member.name"
            style="margin-bottom: 16px"
          />
          <a-input
            addonBefore="学号:"
            placeholder="请输入参赛者学号"
            v-model="member.sicnuid"
            style="margin-bottom: 16px"
          />
          <a-input addonBefore="手机:" placeholder="请输入参赛者手机号" v-model="member.phone" />
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script>
import Clipboard from 'clipboard';

export default {
  name: 'SigninForm',
  props: {
    projectinfo: Array,
    check: Boolean,
  },
  data() {
    const clipboard = new Clipboard('.copyid');
    clipboard.on('success', (e) => {
      this.copyFallback();
      e.clearSelection();
    });

    return {
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
              if (info[key].length < 2) validateResult = false;
              break;
          }
        });
      });
      return validateResult;
    },
  },
  created() {},
  mounted() {
    this.refreshMemberList(this.member_count);
  },
  methods: {
    // alert 中的 id号 复制成功的回调
    copyFallback() {
      this.$message.success('复制成功，快去粘贴保存起来吧！', 3);
    },

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
      if (this.validateInfoList) {
        this.$http.post(
          '/jnds/signin/',
          {
            single: this.single ? 1 : 0,
            project: this.project,
            info_list: this.info_list,
          },
        )
          .then((res) => {
            console.log(res);
            const action = res.data.status === 201 ? '录入' : '更新';
            this.$message.success(`您的报名信息已经${action}成功`, 3);
            // Mongodb 中记录的索引id号
            // eslint-disable-next-line
            this.record_id = res.data.bundle_data.result._id;
            this.alert_title = `这是你的报名票据号，点击即可复制  ${this.record_id}`;
            this.alert_content = `票据号是您查询的最便捷方式，请妥善保存到赛事开始前，
          若对本次报名有任何疑问请到成龙校区西实验楼105咨询。`;
            this.alert_type = 'success';
            this.alert_show = true;
          })
          .catch((err) => {
            console.log(err);
            this.alert_title = '提交失败！可能是哪里出了错误!';
            this.alert_content = `${err.response.data.msg}`;
            this.alert_type = 'error';
            this.alert_show = true;
          });
      } else {
        this.$message.error('您的报名表单填写有误，请检查后重试', 3);
      }
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
</style>
