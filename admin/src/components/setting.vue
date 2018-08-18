<template>
<div class="container">
<p class='settinglabel'>修改密码</p>
<div class="form">
  <input v-model="oldpw" type="password" placeholder="输入旧密码">
  <input v-model="newpw" type="password" placeholder="输入新密码">
  <input v-model="repeat" type="password" placeholder="重复新密码">
  <a href='#' v-on:click="submit" class="text">确认修改</a>
</div>
<p class='settinglabel'>About</p>
<p class='about'>Wit🐱 in 2017 with 900.https://www.nine00.com</p>
</div>
</template>

<script>
export default {
  name: 'setting',
  data() {
    return {
      oldpw: '',
      newpw: '',
      repeat:''
    }
  },
  methods:{
    submit:function(){
      if(!this.oldpw||!this.newpw||!this.repeat){
        this.bus.$emit('popMessageComing', '都填好再按');
        return;
      }
      if(this.newpw!=this.repeat){
        this.bus.$emit('popMessageComing', '重复的密码不正确');
        return;
      }else if(this.newpw.length<8){
        this.bus.$emit('popMessageComing', '太短的密码（不足8位）');
        return;
      }
      this.ajax.post(this.apiUrl + 'su/changepw',{newpw:this.newpw,oldpw:this.oldpw}).then((res) => {
        switch(res.data){
          case "wrong": this.bus.$emit('popMessageComing', '错误的旧密码');break;
          case "done": this.bus.$emit('popMessageComing', '密码已修改，请重新登录');
          setTimeout(() => this.$router.push({name:'logout'}), 1000);
          break;
          default: this.bus.$emit('popMessageComing', '未能成功修改，重试或联系智力猫');break;
        }
      })
    }
  }
}
</script>
