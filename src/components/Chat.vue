<template>
  <div class="Chat clearfix" id="Chat">
    <div class="ChatBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="ulwrapper">
          <ul>
             <li v-for="(list,index) in test" :class="[list.index == 0 ? 'current':'']" @click="adclick(list)">
                <div :class="[list.online == false ? 'offline':'']">
                    <div class="userHd">
                      <div class="userHdImg"><img src="../images/default.png"/></div>
                      <span class="onlineState online_game" v-if="list.state != ''">
                        <em><i></i>正在玩{{list.state}}</em>
                      </span>
                    </div>
                    <div class="userInfo">
                       <div class="userInfoA">
                          <span class="name textHidden">{{list.name}}</span>
                          <span class="userMessageNum textHidden" v-if="list.messagenum > 0" :num="list.messagenum">{{list.messagenum > 99 ? '99+': list.messagenum}}</span>
                       </div>
                       <div class="userInfoB">
                          <span class="oneMessage textHidden">{{list.newmessage}}</span>
                          <span class="userInfoTime textHidden">{{list.newtime}}</span>
                       </div>
                    </div>
                </div>
             </li>
          </ul>
        </div>
      </div>
    </div>
    <ChatView :chatData.sync="chatData" :isDefault.sync="isDefault" :placeholder.sync="placeholder"></ChatView>
  </div>
</template>
<script>
import ChatView from './ChatView.vue'
export default {
  name: 'Chat',
  components: {
    ChatView: ChatView
  },
  data () {
    return {
      test:[{"id":"1","name":"周杰伦","state":"NBA2k18","online":true,"newmessage":"你出来 我找你有事","newtime":"10:00","messagenum":13},
      {"id":"2","name":"张惠妹","state":"王者荣耀","online":false,"newmessage":"我一会就来","newtime":"12:00","messagenum":0},
      {"id":"3","name":"郭德纲","state":"","online":true,"newmessage":"我要去说相声了","newtime":"16:00","messagenum":133}],
      chatData:[{"name":"default"}],
      isDefault:false,
      placeholder:true
    }
  },
  watch:{
    "$store.state.menu.list":function(){
      var newData = $.extend(true, [], this.$store.state.menu.list),
          oldData = $.extend(true, [], this.test),
          storeData = [];
      if(newData[0]){
        for(var i in oldData){
          if(oldData[i].id !== newData[0].id){
             storeData.push(oldData[i])
          }
        }
        storeData.unshift(newData[0])
        this.test = $.extend(true, [], storeData)
        this.chatData = $.extend(true, [], newData)
        $(".Chat .ulwrapper li").removeClass('current').eq(0).addClass('current');
        this.claerMessageNum()
      }
    }
  },
  methods: {
    adclick:function(list){
      var dom = event.currentTarget;
      $(".Chat .ulwrapper li").removeClass('current');
      $(dom).addClass('current').find('.userMessageNum').hide();
      this.chatData[0].name=list.name
      this.chatData[0].state=list.state
      this.isDefault = this.placeholder = true
      this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) - parseInt(list.messagenum)})
    },
    claerMessageNum:function(){
      this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) - parseInt(list.messagenum)})
    }
  },
  mounted(){
  },
  created: function () {
    var allnum = 0;
    for(var i in this.test){
       allnum += parseInt(this.test[i].messagenum)
    }
    this.$store.commit('menustate',{messageNum:allnum})
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/Chat.css'
</style>
