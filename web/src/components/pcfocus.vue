<template>
  <div class="view" v-if='display'>
    <div class="content">
      <transition name="fade" appear>
        <router-link class='prevday' :to="{ name: 'day', params: { date: prevdate.full }}" v-if='data.prevpost&&disppager'>
          <div class="ctrl ctrl_left" @click='hideframe(false)' @mouseover='tilt(true)' @mouseout='replace'>
            {{prevdate.year}}<small>{{prevdate.date}}</small>
          </div>
        </router-link>
      </transition>

      <transition :name="flyindir" appear>
      <div :class="tiltStyle" :style='{width:framesize}'  @click='showwp' @transitionend='cardleaved' class="frame">
        <div class="aspect-ratio">
        <img :src="dispurl">
        </div>
      </div>
      </transition>

      <transition name="fade" appear>
        <router-link class='nextday' :to="{ name: 'day', params: { date: nextdate.full }}" v-if='data.nextpost&&disppager'>
        <div class="ctrl ctrl_right" @click='hideframe(true)' @mouseover='tilt(false)' @mouseout='replace'>
          {{nextdate.year}}<small>{{nextdate.date}}</small>
        </div>
        </router-link>
      </transition>

    </div>
    <transition name="fade" appear>
      <div v-if='data.content&&disppager' class="intro" v-html="dispcontent">
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'pcfocus',
  data() {
    return {
      busy:true,
      display:false,
      data:{},
      tiltStyle:{left:false,right:false,hideleft:false,hideright:false},
      prevdate:{},
      nextdate:{},
      busy:true,
      disppager:false,
      framesize:'',
      wpmode:false
    }
  },
  methods:{
    showwp:function(){
      this.wpmode = !this.wpmode;
      if(!window.localStorage.wphint&&this.wpmode&&this.data.dispwpuri){
        this.bus.$emit('showwphint')
      }else{
        this.bus.$emit('closewpbtn')
      }
    },
    showpager:function(){
      this.disppager = true;
    },
    hideframe:function(dir){
      //点击导航后
      if(this.busy){return;}//设置一个busy，如果同一页已经点击了就退回
      this.busy=true;
      this.disppager = false;//隐藏两个pager,为了使他们以同一的时间显示与隐藏
      if(dir){
        this.bus.flyindir = false;//改变飞入方向
        this.tiltStyle.hideleft = true;
      }else{
        this.bus.flyindir = true
        this.tiltStyle.hideright = true;
      }//根据dir设置主图飞走方向，这个方法只操作了样式，下面交到路由钩子继续执行
      this.tiltStyle.left = false;
      this.tiltStyle.right = false;//关闭主图的倾斜样式，防止卡顿
    },
    cardleaved:function(){
      this.bus.$emit('cardleaved')//绑定在主图上的transitionend事件，发起一个leaved事件，有一定的时差隐患
    },
    tilt:function(left){
      if(this.busy){return;}
      //busy的作用在于防止重复点击和防止动画卡顿，飞入动画和倾斜动画同时会很卡，所以动画完全结束之前，busy应该是true，同时这个函数直接返回
      if(!left){
        this.tiltStyle.left=true;
      }else{
        this.tiltStyle.right=true;
      }
    },
    replace:function(){
      this.tiltStyle.left=false;
      this.tiltStyle.right=false;
    },
    filldate:function(d,obj){
      var datearray = d.split('-');
      obj.year = datearray[0];
      obj.date = datearray[1]+'/'+datearray[2];
      obj.full = d;
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.bus.$emit('postchanging')
    if(to.name=='latest'){next();}
    this.bus.$on('cardleaved',()=>{//当路由改变，只有当card动画结束后才会进入下一页面
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    if(to.name=='month'||to.name == 'latest'){
      next();
    }
    this.bus.$on('cardleaved',()=>{//当路由改变，只有当card动画结束后才会进入下一页面
      next()
    })
  },
  computed:{
    flyindir:function(){
      if(this.bus.flyindir){
        return 'cardleft'
      }else{
        return 'cardright'
      }
    },
    dispurl:function(){
      if(!this.wpmode){
        return (this.data.uri)? this.imgCdn+'/jinri/'+this.data.uri:"";
      }else{
        return (this.data.wpimguri)? this.imgCdn+'/jinri/'+this.data.wpimguri:"";
      }
    },
    dispcontent:function(){
      return (this.data.content)? this.data.content.replace(/\n/g, "<br />"):"";
    }
  },
  created:function(){
    this.bus.$on('screensizeChange',(screensize)=>{
      this.framesize = (screensize-410)*0.562 +"px";
      this.bus.framesize = this.framesize;
    })
    this.framesize = this.bus.framesize;
    this.bus.$on('cardleaved',this.showpager);
    var uri = ''
    if (this.$route.name=='day'){
      uri ='day/'+this.$route.params.date;
    }else{
      uri = 'latest'
    }
    this.ajax(uri).then((res) => {
      this.disppager = false;
      this.data = res.data;
      if(this.data.prevpost) this.filldate(this.data.prevpost,this.prevdate)
      if(this.data.nextpost) this.filldate(this.data.nextpost,this.nextdate);
      var angle =Math.round(Math.random() *24)-12;
      this.bus.$emit('changebg', res.data.color,angle,res.data.dayofweek);//计算并发送样式给外框
      this.display = true;//填充完数据，显示他们
      this.busy = false;//关闭busy使链接可以点击
    })
  }
}
</script>
