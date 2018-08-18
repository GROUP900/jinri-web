<template>
<div class="outerframe" ref='outerframe' @mousewheel="openspanel($event,'qrm')">
  <header>
    <router-link :to="{ name: 'latest'}">
      <h1>今日</h1>
    </router-link>
  </header>


  <router-view :key="key" mode="out-in"></router-view>

  <div class="toolbar">

    <div class="buttons">
      <div class="qr" @click='openspanel(null,"qr")'></div>
      <div class="all" @click='showall'></div>
      <div class="info" @click='openspanel(null,"info")'></div>
    </div>
    <p class="whatday">{{dispdow}}</p>
  </div>

<div class="motionbgwrapper"><div class='motionbg' :style="{ top:bgoffset,background: bgcolor,transform:bgangle}"></div></div>
<div class="bg"></div>
<transition name="sp">
  <spanel v-if='showspanel' @fold='resetsp' :mode='spmode'></spanel>
</transition>
<transition name="topin">
<wphint v-if='wphint' @closewpbtn='wphint=false'></wphint>
</transition>
</div>
</template>

<script>
import spanel from './spanel.vue'
import wphint from './wphint.vue'
export default {
  name: 'pcframe',
  data() {
    return {
      bgcolor:'',
      bgangle:'',
      dayofweek:'',
      screenHeight:680,
      bgoffset:'',
      shine:false,
      showspanel:false,
      spmode:'qr',
      spstatus:"",
      wphint:false
    }
  },
  components:{
    'spanel':spanel,
    'wphint':wphint
  },
  computed:{
    dispdow:function(){
      if(!this.dayofweek){
        return 'loading'
      }else{
        return this.dayofweek+ '/7'
      }
    },
    key:function() {
      return (this.$route.params.date)?this.$route.params.date:'latest';
    }
  },
  methods:{
    resetsp:function(){
      if(this.spstatus=='closing'){return}
      this.showspanel=false;
      this.spstatus='closing';
    },
    openspanel:function(ev,type){
      if(this.spstatus=='showing'){return;}
      switch(type){
        case 'qrm':
          if(ev.wheelDelta>0){return;}
        case 'qr':
          this.spmode = 'qr';
        break;
        case 'info':
          this.spmode = 'info';
        break;
      }
      this.showspanel = true;
      this.spstatus='showing';
    },
    showall:function(){
      var month = (this.$route.params.date)?this.$route.params.date.slice(0,7):'this';
      this.$router.push({ name: 'month', params: { date: month }})
    },
    resetframe:function(){
      if(this.sphidebusy){return;}
      this.sphidebusy = true;
      this.screenHeight = this.$refs.outerframe.clientHeight;
      this.bus.$emit('screensizeChange',this.screenHeight);
      this.bgoffset = (this.screenHeight-4230)+'px';
    }
  },
  created:function(){
    this.bus.$on('changebg',(color,angle,dow)=>{
      this.shine = true;
      this.bgcolor = color;
      this.bgangle = "translateX(-50%) rotateY("+angle+"deg)";
      this.dayofweek =dow;
    })
    this.bus.$on('showwphint',()=>{
      this.wphint = true;
    })
    this.bus.$on('closewpbtn',()=>{
      this.wphint = false;
    })
    this.bus.$on('postchanging',()=>{
      this.wphint = false;
    })
  },
  mounted:function(){
    this.resetframe();
    window.onresize = ()=>{
      this.resetframe();
    }
  },
  beforeRouteLeave (to, from, next) {
      if(to.name=='month'){
        window.onresize = null
      }
      next()
  }
}
</script>
