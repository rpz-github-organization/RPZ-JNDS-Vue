<template>
  <div id="app">
    <router-view/>
    <a-back-top />
    <div class="footer">
      <div>
        <a-icon type="edit"></a-icon>
        <router-link to="/">报名处</router-link>
      </div>
      <div>
        <a-icon type="search" />
        <router-link to="/check">报名查询</router-link>
      </div>
      <div>
        <a-icon type="edit"></a-icon>
        <router-link to="/about">咨询联系</router-link>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 20px 0;
  color: #2c3e50;
}

.footer {
  display: flex;
  position: fixed;
  cursor: pointer;
  padding: 10px 0;
  left: 0;
  bottom: 0;
  color: #2c3e50;
  box-sizing: border-box;
  background:linear-gradient(white,#e8f5f9);
  width: 100%;
}
.footer div{
  flex: 1;
  padding: 5px;
  border-right: 1px solid lightgray;
}
.footer div a{
  display: block;
  cursor: pointer;
  color:black;
  font-weight: 900;
}
.on{
  color: rgb(25, 137, 250);
}
</style>
