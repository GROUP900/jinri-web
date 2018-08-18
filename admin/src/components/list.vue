<template>
<div class="container">
  <div class="datecontrol">
    <span @click='switchmonth(false)'>上个月</span>
    <p>{{monthSelected}}</p>
    <span @click='switchmonth(true)'>下个月</span>
  </div>
  <div class="postswrapper">
    <div v-for='post in posts' class="post_block">
      <router-link :to="{ name: 'edit', params: { id: post._id }}">
        <img :src='post.dispuri'>
      </router-link>
      <p v-if="showremove" @click='drop(post._id)' class='removebtn'>删除</p>
    </div>
  </div>
  <div class="removetrigger" @click='showremove=!showremove'><span v-if='showremove'>取消</span><span v-else>删除</span></div>
</div>
</template>

<script>
var moment = require('moment');
export default {
  name: 'list',
  data() {
    return {
      monthSelected:'',
      posts:{},
      showremove:false
    }
  },
  watch: {
    monthSelected:function(){
      this.getposts(this.monthSelected);
    }
  },
  methods:{
    drop:function(id){
      this.ajax(this.apiUrl + 'su/drop/'+id).then((res) => {
        if(res.data=='done'){
          this.bus.$emit('popMessageComing', '日签已经删除');
          this.getposts(this.monthSelected)
        }else{
          this.bus.$emit('popMessageComing', '出现错误未能删除');
        }
      })
    },
    switchmonth:function(next){
      var cur = moment(this.monthSelected,"YYYY/MM");
      if(next){
        var final = cur.add(1,'months').format("YYYY/MM");
      }else{
        var final = cur.subtract(1,'months').format("YYYY/MM");
      }
      this.monthSelected = final
    },
    getposts:function(month){
      this.ajax.post(this.apiUrl + 'su/getmonthposts',{month:month}).then((res) => {
        this.posts = res.data;
        if(!this.posts[0]){
        this.bus.$emit('popMessageComing', '选中的月份没有日签');
        }
      })
    }
  },
  created: function() {
    this.monthSelected = moment().format("YYYY/MM");
  }
}
</script>
