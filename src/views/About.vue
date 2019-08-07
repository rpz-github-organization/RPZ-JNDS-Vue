<template>
  <div class="About">
    <img
      src="https://rpzoss.oss-cn-chengdu.aliyuncs.com/Public/8-8-2019-about.png"
      alt
      class="cover-bg"
    />

    <div class="about-container">
      <h1>
        <strong>关于本报名站点</strong>
      </h1>

      <p class="content">
        如果您在报名过程中有遇到任何问题，请及时联系计算机科学协会获取技术支持，
        联系地址成龙校区西实验楼105办公室
        <br />
        <br />本次报名同样支持人工报名，
        <strong>
          若您有意填写纸质报名表，
          <br />请到成龙校区西实验楼105领取报名表
        </strong>
      </p>

      <p class="subdescription">
        本站点最终解释权归属于四川师范大学计算机科学学院,
        <br />由四川师范大学计算机科学协会搭建并维护
        <br />本站备案号: 蜀ICP备18030485号-1
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  margin-top: 25px;
}
.subdescription {
  color: darkslategray;
  font-size: 13px;
  font-weight: bold;
}
.content {
  text-align: left;
  font-size: 20px;
  width: 80%;
  margin: 20px auto;
}

.cover-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  object-fit: scale-down;
  width: 100%;
  opacity: 0.3;
}
</style>
