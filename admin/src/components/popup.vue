<template>
<transition name="leftin">
  <p v-show="display" class="popup">
    {{info}}
  </p>
</transition>
</template>

<script>
export default {
  name: 'popup',
  data() {
    return {
      display: false,
      info: '',
      timer: ''
    }
  },
  created: function() {
    this.bus.$on('popMessageComing', (message) => {
      clearTimeout(this.timer);
      this.info = message
      this.display = true;
      this.timer = setTimeout(() => this.display = false, 1500)
    })
  }


}
</script>
