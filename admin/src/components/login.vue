<template>
<div>
  <header>
    <h1>JINRI<small> admin console</small></h1>
  </header>
  <div class="container">
    <div class="icon"></div>
    <div class="form">
      <input v-on:keyup.enter="submit" v-model="username" type="text" placeholder="用户名">
      <input v-on:keyup.enter="submit" v-model="password" autocomplete="new-password" type="password" placeholder="密码">
      <a href='#' v-on:click="submit" class="btn">登录</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit: function() {
      this.ajax.post(this.apiUrl + 'su/login', {
        username: this.username,
        password: this.password
      }).then((res) => {
        if(res.data.token){
          sessionStorage.token = res.data.token;
          this.bus.$emit('popMessageComing', '已经登录，等待跳转');
          setTimeout(() => this.$router.push({name:'list'}), 1000);
          return;
        }
        switch (res.data) {
          case "user":
            this.bus.$emit('popMessageComing', '用户名不对');
            break;
          case "pw":
            this.bus.$emit('popMessageComing', '密码不对');
            break;
        }

      })
    }

  },
  created: function() {

  }

}
</script>
