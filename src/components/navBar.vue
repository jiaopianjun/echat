<template>
  <div class="navBar" id="navBar">
     <span class="navBarClose" @click="closewindow"></span>
     <!-- <span class="Maximization"></span>
     <span class="minimize"></span> -->
  </div>
</template>
<script>
export default {
  name: 'navBar',
  data () {
    return {
      
    }
  },
  methods: {
    closewindow:function(){
      stone.closeWindow()
    }
  },
  mounted(){
  },
  created: function () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../sass/stylesheets/navBar.css'
</style>
