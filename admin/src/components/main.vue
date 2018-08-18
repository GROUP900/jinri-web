<template>
<div>
  <header>
    <h1>JINRI<small> admin console</small></h1>
    <ul class="menu">
        <li><router-link :to="{name:'add'}">新增</router-link></li>
        <li><router-link :to="{name:'list'}">列表</router-link></li>
        <li><router-link :to="{name:'setting'}">配置</router-link></li>
        <li><router-link :to="{name:'logout'}">登出</router-link></li>
    </ul>
  </header>
  <transition appear name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
export default {
  name: 'main'
}
</script>
