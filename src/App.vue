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
       data:[],
       set:0
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
    },
    wsInit: function(){
      var ws = new WebSocket("wss://stoneapi.snail.com:4433");
      var _this = this;
      ws.onopen = function (evt) {
        ws.onmessage = function (evt) { 
          var received_msg = evt.data;
          _this.data = evt.data
          console.log(_this.data, 'received')
        };
        var match = document.cookie.match(/(?:^| )token=([^;]+)/);
        if (match) {
            var token = decodeURIComponent(match[1]);
            this.send('{"type":"auth", "token":"'+token+'"}');
        }
      };
      ws.onclose = function() {
        console.log('ws closed, try reconnect in 2s');
        setTimeout(function(){_this.wsInit()}, 2000);
      }


      window.clearInterval(this.set);
      function sendhert(){
        ws.send('{"type":"heart"}');
      }
      this.set = setInterval(sendhert,1000 * 60 * 14);
    }
  },
  mounted () {
    // this.socket()
    this.wsInit();

  },
  created: function () {
    // $(window).resize(function(){
    //   $('.app').height($(window).height()).width($('body').width()+17)
    // })
    // $(function(){
    //   $('.app').height($(window).height()).width($('body').width()+17)
    // })
  }
}
</script>

<style>
  @import 'sass/stylesheets/Reset.css'
</style>
