<template>
  <div class="Chat clearfix" id="Chat">
    <div class="ChatBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="ulwrapper">
          <ul>
             <li v-for="(list,index) in data.offlinelist" :class="[list.index == 0 ? 'current':'']" @click="adclick(list)" :useraid="list.aid" :sessionid="list.session_id">
                <div :class="[list.is_online == 0 ? 'offline':'']">
                    <div class="userHd">
                      <div class="userHdImg"><img :src="list.avatar"/></div>
                      <span class="onlineState online_game" v-if="list.playing_status != 0">
                        <em><i></i>正在玩{{list.playing_game_info.name}}</em>
                      </span>
                    </div>
                    <div class="userInfo">
                       <div class="userInfoA">
                          <span class="name textHidden">{{list.nickname}}</span>
                          <span class="userMessageNum textHidden" v-if="list.message_count > 0" :num="list.message_count">{{list.message_count > 99 ? '99+': list.message_count}}</span>
                       </div>
                       <div class="userInfoB">
                          <span class="oneMessage textHidden">{{list.last_message}}</span>
                          <span class="userInfoTime textHidden">{{list.last_send_at}}</span>
                       </div>
                    </div>
                </div>
             </li>
          </ul>
        </div>
      </div>
    </div>
    <ChatView :chatData.sync="chatData" :isDefault.sync="isDefault" :sendMsg.sync="sendMsg"></ChatView>
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
      chatData:{"nickname":"default"},
      isDefault:false,
      sendMsg:true,
      data:{
        offlinelist:[],
        offlineUrl:'http://stoneapi.snail.com/v2/user/friend/offline-message-list',
        offineContNum:0
      },
      claerMessageUrl:'http://stoneapi.snail.com/v2/user/friend/set-message-read'
    }
  },
  watch:{
    "$store.state.menu.list":function(){
      var newData = $.extend(true, [], this.$store.state.menu.list),
          oldData = $.extend(true, [], this.data.offlinelist),
          storeData = [],
          recordData = $.extend(true, [], this.$store.state.record.list),
          newrecordData = {"session_id":"",messages:[]},
          tempData = [];
      if(newData[0]){
        for(var i in oldData){
          if(oldData[i].aid !== newData[0].aid){
             storeData.push(oldData[i])
          }
        }
        storeData.unshift(newData[0])
        this.data.offlinelist = $.extend(true, [], storeData)
        this.chatData = $.extend(true, [], newData[0])
        $(".Chat .ulwrapper li").removeClass('current').eq(0).addClass('current'); 

        if(recordData.length > 0){
          for(var i in recordData){
            if(recordData[i].session_id === newData[0].session_id){
              tempData = recordData[i].messages
            }else{
              this.chatData.messages = []
            }
          }
          newrecordData.messages = this.chatData.messages = $.extend(true, [], tempData)
          newrecordData.session_id = newData[0].session_id
          this.$store.commit('chatrecordstate',{data:newrecordData})
        }else{
          this.chatData.messages = []
          newrecordData.session_id = newData[0].session_id
          this.$store.commit('chatrecordstate',{data:newrecordData})
        }
      }
    }
  },
  methods: {
    adclick:function(list){
      var dom = event.currentTarget,
          chatrecordata = this.$store.state.record.list,
          messages;
      $(".Chat .ulwrapper li").removeClass('current');
      $(dom).addClass('current').find('.userMessageNum').hide();
      
      if(chatrecordata){
        for(var i in chatrecordata){
          if(chatrecordata[i].session_id === list.session_id){
             messages = chatrecordata[i].messages
          }
        }
      }
      list.messages = $.extend(true, [], messages)
      this.chatData = list
      this.isDefault = this.sendMsg = true
      this.claerMessageNum(list.session_id,list.message_count)
    },
    claerMessageNum:function(session_id,message_count){
      // 设置消息为已读
      this.$post(this.claerMessageUrl,{session_id:session_id}).then((response) => {
        if(response.code === 200){
          this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) - parseInt(message_count)})
        }
      })
    },
  },
  mounted(){
    this.$fetch(this.data.offlineUrl).then((response) => {
      if(response.code === 200){
        this.data.offlinelist = response.list
        this.data.offineContNum = response.sum_count
        this.$store.commit('menustate',{messageNum:response.sum_count})
      }
    })
  },
  created: function () {
    $(window).resize(function(){
      $('.Chat').height($(window).height()-2)
    })
    $(function(){
      $('.Chat').height($(window).height()-2)
    })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/Chat.css'
</style>
