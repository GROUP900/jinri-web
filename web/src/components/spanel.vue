<template>
  <div class="spanel"  @mousewheel="fold($event)">
    <div class="foldbtn" @click='fold'></div>

    <div v-if='qrmode' class='postqr'>
      <img :src='qr' v-if='qr'>
      <p>{{dispdate}}</p>
    </div>
    <div class="about" v-else>
      <div class="aboutr1">
        <img src="https://open.weixin.qq.com/qr/code/?username=whimdesign">
        <div>
          <h3>早知今日 何必当初</h3>
          <p>微信公众号：今日，关注以获取联系与新动态</p>
        </div>
      </div>
      <div class="aboutr2">
        <h3>关于[今日]</h3>
        <p>重新定义的：早知今日 何必当初<br>
        今日翻译为Today，最直接的意思就是今天，将今天的所见所闻，所想所念所思考都通过影像和小文的形式记录下来，没有定义也没有界限，只是单纯的抒发情绪，为什么是今日？<br>
        因为希望可以活在当下，不去纠结过去也不盲目未来，认真的把今天过完，这就够了，其他的，交给时间。
        </p>
      </div>
    </div>

    <div class="copy">
      <div></div>
      <p>&copy; TODAY,900</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'spanel',
  data() {
    return {
      qr:''
    }
  },
  computed:{
    dispdate:function(){
      return (this.$route.params.date)?this.$route.params.date.replace(/-/g,'/'):"TODAY";
    },
    qrmode:function(){
      if(this.mode=='qr'){
        return true;
      }else{return false;}
    }
  },
  props: ['mode'],
  methods:{
    fold:function(ev){
      if(!ev.wheelDelta){
        return this.$emit('fold');
      }
        if(ev.wheelDelta>0){
          this.$emit('fold');
        }
    },
    loadqr:function(){
      this.ajax.post('geneqr', {
        url:window.location.href
      }).then((res) => {
        this.qr = res.data
      })
    }
  },
  created:function(){
    this.loadqr()
  }
}
</script>
