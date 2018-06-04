<template>
  <div class="Chat clearfix" id="Chat">
    <div class="ChatBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="ulwrapper">
          <ul>
             <li v-for="(list,index) in data.offlinelist" :class="[list.current === 'current' ? 'current':'']" :index="index"  :current= "list.current" @click="adclick(list,index)" :useraid="list.aid" :sessionid="list.session_id" :id="list.aid">
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
        offineContNum:0,
      },
      isAid:'',// 判断当前聊天对象是否打开聊天对话框
      claerMessageUrl:'http://stoneapi.snail.com/v2/user/friend/set-message-read',
      getfriendInfo:"http://stoneapi.snail.com/v2/user/friend/friend-info",
      getTimeUrl:'https://stoneapi.snail.com/v2/env/time',
      oldDate:0
    }
  },
  watch:{
    "$store.state.menu.list":function(){
      var selectData = $.extend(true, [], this.$store.state.menu.list),
          chatList = $.extend(true, [], this.data.offlinelist);  
      if(selectData[0]){
        this.fromFriendsList(selectData,chatList)
        this.isAid = selectData[0].aid
      }
    },
    "$store.state.realchat.chatinfolist":function(){
      var chatText = $.extend(true, {}, this.$store.state.realchat.chatinfolist),
          chatList = $.extend(true, [], this.data.offlinelist),
          defaultMessage = {
            "text": chatText.content,
            "avatar": "",
            "time":"",
            "is_type": "isOther"
          },
          nowtime = this.time(chatText.timestamp,'qt');
      if((parseInt(nowtime) - parseInt(this.oldDate)) > parseInt(3)){
        defaultMessage.time = this.time(chatText.timestamp,'all')
        this.oldDate = this.time(chatText.timestamp,'qt')
      }

      if(chatText){
        this.formChatList(chatText,chatList,defaultMessage);
      }
    },
    "$store.state.realchat.friendonline":function(){ // 监听好友上线
      var onlineData = $.extend(true, [], this.$store.state.realchat.friendonline),
          chatList = $.extend(true, [], this.data.offlinelist);
      if(onlineData){
        for(var i in chatList){
          if(parseInt(this.data.offlinelist[i].aid) === parseInt(onlineData.aid)){
            this.data.offlinelist[i].is_online = parseInt(1)
          }
        }
      }
    },
    "$store.state.realchat.friendoffline":function(){ // 监听好友下线
      var offlineData = $.extend(true, [], this.$store.state.realchat.friendoffline),
          chatList = $.extend(true, [], this.data.offlinelist);
      if(offlineData){
        for(var i in chatList){
          if(parseInt(this.data.offlinelist[i].aid) === parseInt(offlineData.aid)){
            this.data.offlinelist[i].is_online = parseInt(0)
          }
        }
      }
    },
    "$store.state.realchat.chatview":function(){ // 监听实时发送消息
      var chatviewData = $.extend(true, [], this.$store.state.realchat.chatview),
          chatList = $.extend(true, [], this.data.offlinelist);
      if(chatviewData){
        this.fromFriendsList(chatviewData,chatList)
        this.isAid = chatviewData[0].aid
      }
    }
  },
  methods: {
    time:function(unixtimestamp,type){  
      var unixtimestamp = new Date(unixtimestamp*1000);  
      var year = 1900 + unixtimestamp.getYear();  
      var month = "0" + (unixtimestamp.getMonth() + 1);  
      var date = "0" + unixtimestamp.getDate();  
      var hour = "0" + unixtimestamp.getHours();  
      var minute = "0" + unixtimestamp.getMinutes();  
      var second = "0" + unixtimestamp.getSeconds();  
      if(type === 'all'){
        return year + "-" + month.substring(month.length-2, month.length)  + "-" + date.substring(date.length-2, date.length)  
            + " " + hour.substring(hour.length-2, hour.length) + ":"  
            + minute.substring(minute.length-2, minute.length) + ":"  
            + second.substring(second.length-2, second.length);  
      }else if(type == 'hm'){
        return hour.substring(hour.length-2, hour.length) + ":"  + minute.substring(minute.length-2, minute.length)  
      }else{
        return minute.substring(minute.length-2, minute.length)
      }
    },
    formChatList:function(chatText,chatList,defaultMessage){   // 从实时聊天过来
      var tempData = [],
          alist = [], // 列表不存在当前会话
          blist = []; // 列表存在当前会话
      if(chatList[0]){ // 如果聊天存在 
        for(var i in chatList){
          if(parseInt(chatList[i].aid) !== parseInt(chatText.aid)){
            alist.push(chatList[i])  //  好友列表中无
          }else{
            blist.push(chatList[i]) //好友列表中有
          }
        }
        if(blist[0]){ // 如果存在 则说明 存在当前聊天列表中   
          defaultMessage.avatar = blist[0].avatar
          tempData.push(defaultMessage)
          blist[0].messages = $.extend(true, [], tempData)
          blist[0].message_count = blist[0].message_count + 1
          blist[0].last_message = chatText.content
          blist[0].last_send_at = this.time(chatText.timestamp,'hm')
          alist.unshift(blist[0]) // 将其提升到第一个
          this.saveFromChatRecord(blist[0],'chat_yes')
          this.data.offlinelist = $.extend(true, [], alist)
          this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) + parseInt(1),applyNum:this.$store.state.menu.applyNum})
        }else{
          this.$fetch(this.getfriendInfo,{friend_aid:parseInt(chatText.aid)}).then((response) => {
          if(response.code === 200){
              var newData= response.result
              defaultMessage.avatar = newData.avatar
              newData.message_count = 1
              newData.last_message = chatText.content
              newData.last_send_at = this.time(chatText.timestamp,'hm')
              newData.current = ''
              newData.messages = []
              newData.messages.push(defaultMessage)
              this.data.offlinelist.push(newData)
              this.saveFromChatRecord(newData,'chat_no')
              this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) + parseInt(newData.message_count),applyNum:this.$store.state.menu.applyNum})
            }
          })
        } 
      }else{ // 如果聊天列表不存在则说明该会话没有产生过，则需要新建一个  并且新建聊天存储区
        var _this = this
        this.$fetch(this.getfriendInfo,{friend_aid:parseInt(chatText.aid)}).then((response) => {
          if(response.code === 200){
            var newData = response.result
            defaultMessage.avatar = newData.avatar
            newData.message_count = 1
            newData.last_message = chatText.content
            newData.last_send_at = this.time(chatText.timestamp,'hm')
            newData.messages = []
            newData.current = ''
            newData.messages.push(defaultMessage)
            _this.data.offlinelist.push(newData)
            _this.saveFromChatRecord(newData,'chat_no')
            this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) + parseInt(newData.message_count),applyNum:this.$store.state.menu.applyNum})
          }
        })
      }
    },
    saveFromChatRecord:function(data,type){
      var chatRecList = $.extend(true, [], this.$store.state.record.list), // 聊天记录保存列表
          DeTemp = {"session_id":data.session_id,messages:[]},
          tempData = [],
          tempData2;
      if(type === 'chat_no'){
          DeTemp.messages.push(data.messages[0])
          this.$store.commit('chatrecordstate',{data:DeTemp})
      }else if(type == "chat_yes"){
        if(data.messages[0]){
          for(var i in chatRecList){
            if(chatRecList[i].session_id === data.session_id){
              tempData = chatRecList[i].messages
            }
          }
          tempData2 = $.extend(true, [], data.messages)
          tempData.push(tempData2[0]) 
          if(this.isAid == data.aid && this.$store.state.menu.cause === true && this.$store.state.menu.other === false){
            // 同时清除未读消息
            this.chatData = data
            this.claerMessageNum(data.session_id,data.message_count,data.aid,0) 
            DeTemp.messages = this.chatData.messages = $.extend(true, [], tempData)
          }else{
            DeTemp.messages = $.extend(true, [], tempData)
          }
          this.$store.commit('chatrecordstate',{data:DeTemp})
        }else{
          for(var i in chatRecList){
            if(chatRecList[i].session_id === data.session_id){
              tempData = chatRecList[i].messages
            }
          }
          this.chatData.messages = $.extend(true, [], tempData)
        }
      }
    },
    saveFromFriendsRecord:function(data,type){
      var chatRecList = $.extend(true, [], this.$store.state.record.list), // 聊天记录保存列表
          DeTemp = {"session_id":data.session_id,messages:[]},
          tempData = [];
       if(type === "friends_no"){
         this.$store.commit('chatrecordstate',{data:DeTemp})
       }else if(type === "friends_yes"){
        if(data.messages[0]){
          for(var i in chatRecList){
            if(chatRecList[i].session_id === data.session_id){
              tempData = chatRecList[i].messages
            }
          }
          // tempData.push(data.messages)
          DeTemp.messages = this.chatData.messages = $.extend(true, [], tempData)
          this.$store.commit('chatrecordstate',{data:DeTemp})
        }else{
          for(var i in chatRecList){
            if(chatRecList[i].session_id === data.session_id){
              tempData = chatRecList[i].messages
            }
          }
          this.chatData.messages = $.extend(true, [], tempData)
        }
       }
    },
    fromFriendsList:function(selectData,chatList){
      var alist = [], // 列表不存在当前会话
          blist = []; // 列表存在当前会话
      if(selectData[0]){ // 如果有从好友列表过来的才执行操作
        for(var i in chatList){
          if(parseInt(chatList[i].aid) !== parseInt(selectData[0].aid)){
            chatList[i].current = ''
            alist.push(chatList[i])  //  好友列表中无
          }else{
            chatList[i].current = ''
            blist.push(chatList[i]) //好友列表中有
          }
        }
        if(blist[0]){ // 如果存在 则说明 存在当前聊天列表中   
          blist[0].current = 'current'
          if(selectData[0].last_message){
            blist[0].last_message = selectData[0].last_message
            blist[0].last_send_at = selectData[0].last_send_at
          }
          alist.unshift(blist[0]) // 将其提升到第一个 
          this.chatData = $.extend(true, [], blist[0]) // 并且 打开 对话窗口
          this.saveFromFriendsRecord(blist[0],'friends_yes');
          this.claerMessageNum(blist[0].session_id,blist[0].message_count,blist[0].aid,0) // 同时清除未读消息
        }else{
          selectData[0].messages = []
          selectData[0].current = 'current'
          alist.unshift(selectData[0]) // 不存在则将从好友列表传过来的赋值
          this.chatData = $.extend(true, [], alist[0]) // 同时打开对话窗口
          this.saveFromFriendsRecord(selectData[0],'friends_no');
        }
        this.data.offlinelist = $.extend(true, [], alist)
        $(".Chat .ulwrapper li").removeClass('current').eq(0).addClass('current');
      }
    },
    adclick:function(list,index){
      var dom = event.currentTarget,
          chatrecordata = this.$store.state.record.list,
          messages,
          DeTemp = {"session_id":list.session_id,messages:[]};
      $(".Chat .ulwrapper li").removeClass('current');
      $(dom).addClass('current');
      this.isAid = list.aid
      if(chatrecordata.length > 0){ 
        for(var i in chatrecordata){
          if(chatrecordata[i].session_id === list.session_id){
             messages = chatrecordata[i].messages
          }
        }
        list.messages = $.extend(true, [], messages)
      }else{
        if(list.messages){
          DeTemp.messages = list.messages
          this.$store.commit('chatrecordstate',{data:DeTemp})
        }
      }
      this.chatData = list
      this.isDefault = this.sendMsg = true
      this.claerMessageNum(list.session_id,list.message_count,list.aid,index)
    },
    claerMessageNum:function(session_id,message_count,aid,index){
      // 设置消息为已读
      if(message_count > 0){
        this.$post(this.claerMessageUrl,{session_id:session_id}).then((response) => {
          if(response.code === 200){
            this.$store.commit('menustate',{messageNum:parseInt(this.$store.state.menu.messageNum) - parseInt(message_count),applyNum:this.$store.state.menu.applyNum})
            this.data.offlinelist[index].message_count = 0

          }
        })
      }
    },
  },
  mounted(){
    //离线消息   获取到时  同时存储到本地
    var vm = this
    vm.$http({
      url: this.data.offlineUrl,
      method: 'jsonp',
      params: {},
      jsonp: 'callback',
      emulateJSON: true,
      headers: {
        'Content-Type': 'x-www-from-urlencoded'
      }
    }).then(function (res) {
      if(res.body.code === 200){
        var DeTemp = {"session_id":"",messages:[]};
        for(var i in res.body.list){
          this.data.offlinelist.push(res.body.list[i])
          var list = res.body.list[i]
          DeTemp.session_id = list.session_id
          DeTemp.messages = list.messages
          this.$store.commit('chatrecordstate',{data:DeTemp})
        }
        this.data.offineContNum = res.body.sum_count
        this.$store.commit('menustate',{messageNum:res.body.sum_count,applyNum:this.$store.state.menu.applyNum})
      }
    })


    // this.$fetch(this.data.offlineUrl).then((response) => {
    //   if(response.code === 200){
    //     var DeTemp = {"session_id":"",messages:[]};
    //     for(var i in response.list){
    //       this.data.offlinelist.push(response.list[i])
    //       var list = response.list[i]
    //       DeTemp.session_id = list.session_id
    //       DeTemp.messages = list.messages
    //       this.$store.commit('chatrecordstate',{data:DeTemp})
    //     }
    //     this.data.offineContNum = response.sum_count
    //     this.$store.commit('menustate',{messageNum:response.sum_count,applyNum:this.$store.state.menu.applyNum})
    //   }
    // })
    //当前时间
    this.$fetch(this.getTimeUrl).then((response) => {
      if(response.code === 200){
        this.oldDate = this.time(response.timestamp,'qt')
      }
    })
  },
  created: function () {
    // $(window).resize(function(){
    //   $('.Chat').height($(window).height()-2)
    // })
    // $(function(){
    //   $('.Chat').height($(window).height()-2)
    // })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/Chat.css'
</style>
