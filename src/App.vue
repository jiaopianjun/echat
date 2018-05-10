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
  data () {
    return {
       data:[]
    }
  },
  watch:{
    data:{  
      handler:function(val,oldval){  
        this.$store.commit('realchat',{data:val})
      },  
      deep:true
    },
  },
  methods: {
    getCookie:function(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
    }
  },
  mounted () {
    // this.socket()
    var ws = new WebSocket("wss://stone.snail.com:4433/");
    var _this = this,
        token = _this.getCookie('token');
      ws.onopen = function (evt) {
        ws.onmessage = function (evt) { 
          var received_msg = evt.data;
          _this.data = evt.data
          console.log(_this.data,'123')
        };
      ws.send('{"type":"auth", "token":"'+token+'"}');
    };   
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
