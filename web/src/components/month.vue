<template>
<div class="listwrapper">
  <header>
    <router-link :to="{ name: 'latest'}">
      <h1 class="list">今日</h1></a>
    </router-link>
  </header>
  <p class="month">{{curmonth}}</p>

    <div class="mainlist">
      <div v-for='post in posts'>
        <router-link :to="{ name: 'day', params: { date: post.day }}">
          <div><img :src="dispurl(post.uri)"></div>
        </router-link>
      </div>
    </div>

  <div class="monthctrl">
    <router-link v-if='prevmonth.year' :to="{ name: 'month', params: { date: prevmonth.full }}">
      <div class="listctrl left">{{prevmonth.year}}<small>{{prevmonth.month}}</small></div>
    </router-link>
    <router-link v-if='nextmonth.year' :to="{ name: 'month', params: { date: nextmonth.full }}">
      <div class="listctrl right">{{nextmonth.year}}<small>{{nextmonth.month}}</small></div>
    </router-link>

  </div>
</div>

</template>

<script>
export default {
  name: 'month',
  data() {
    return {
      curmonth:'loading',
      nextmonth:{},
      prevmonth:{},
      posts:[]
    }
  },
  computed:{

  },
  methods:{
    dispurl:function(uri){
      return this.imgCdn+'/jinri/'+uri+'/jrthumb';
    },
    load:function(){
      this.nextmonth = {};
      this.prevmonth = {};
      this.ajax("month/"+this.$route.params.date).then((res) => {
        var data = res.data;

        if(data.prevmonth){
          var d = data.prevmonth.split('-');
          this.prevmonth={
            year:d[0],
            month:d[1],
            full:data.prevmonth
          }
        }
        if(data.nextmonth){
          var d = data.nextmonth.split('-');
          this.nextmonth={
            year:d[0],
            month:d[1],
            full:data.nextmonth
          }
        }
        this.posts = data.docs;
        this.curmonth = data.curmonth;

      })
    }
  },
  created:function(){
    this.load()
  },
  watch: {
    '$route' (to, from) {

      this.load()
    }
  }
}
</script>
