<template>
  <div class="wphint">
    <p>码上有屏保</p>
    <img :src='qr' v-if='qr'>
    <div class="closewpbtn" @click='hidehint'>了解</div>
  </div>
</template>

<script>
export default {
  name: 'pcfocus',
  data() {
    return {
      qr:''
    }
  },
  methods:{
    hidehint:function(){
      window.localStorage.wphint = true;
      this.$emit('closewpbtn');
    }
  },
  created:function(){
    this.ajax.post('geneqr', {
      url:window.location.href
    }).then((res) => {
      this.qr = res.data
    })
  }
}
</script>
