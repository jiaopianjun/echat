<template>
  <div id="app" class="app">
    <router-view :key="key"></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  mounted () {

  },
  created: function () {
    $(window).resize(function(){
      $('.app').height($(window).height()).width($('body').width()+17)
    })
    $(function(){
      $('.app').height($(window).height()).width($('body').width()+17)
    })
  }
}
</script>

<style>
  @import 'sass/stylesheets/Reset.css'
</style>
