<template>
  <div :class="['ChatView clearfix',{'defaultState':isDefault == false}]">
    <navBar></navBar>
    <div class="ChatViewCont" v-show="chatData.nickname != 'default'">
       <div class="ChatViewContMenu">
         <span class="">{{chatData.nickname}}</span>
         <em v-if="chatData.playing_status != 0">正在玩：{{chatData.playing_status != 0 && chatData.nickname != 'default' ? chatData.playing_game_info.name : ''}}</em>
       </div>
       <div class="ChatViewContWarp">
          <div class="v_a">
             <ul class="a_b">
                <li :class="list.is_type" v-for="(list,index) in messageList">
                    <p class="chatTime" v-if="list.time">{{list.time}}</p>
                    <div class="chatStrip clearfix">
                       <div class="chatUserImg">
                          <img :src="list.avatar"/>
                       </div>
                       <div class="chatText">{{list.text}}</div>
                       <div class="chatState"></div>
                    </div>
                </li>
             </ul>
          </div>
       </div>
       <div class="ChatViewContEditer">
          <div class="edMenu">
             <div class="edMenuIcon face"></div>
             <div class="edMenuIcon image">
               <input type="file"/>
             </div>
          </div>
          <div class="edCont">
            <div class="edContWarp" contenteditable="true" @keydown.13="enter($event)" id="sendTextarea" @focus="removeSendTs"></div>
            <span v-show="tshow">按回车键发送消息...</span>
          </div>
       </div>
    </div>
  </div>
</template>
<script>
import navBar from './navBar.vue'
export default {
  name: 'editor',
  components:{
    navBar:navBar
  },
  props:['chatData','isDefault','sendMsg'],
  watch:{
    chatData:{  
      handler:function(val,oldval){
        if(val.messages){
          this.messageList = val.messages
        }
        $(document).ready(function(){ 
          $(".edContWarp").html('');
          $(".v_a").scrollTop($(".v_a")[0].scrollHeight + 160);
        })
      },  
      deep:true
    },
    Chatrecord:{  
      handler:function(val,oldval){  
        $(document).ready(function(){ 
          $(".v_a").scrollTop($(".v_a")[0].scrollHeight + 160);
        })
      },  
      deep:true
    },
    "$store.state.peinfo.list":function(){
      if(this.$store.state.peinfo.list){
        this.data.peinfo = this.$store.state.peinfo.list

      }
    },
    "$store.state.record.list":function(){
      // console.log(this.$store.state.record.list,'dd')
    }
  },
  data () {
    return {
      tshow:this.sendMsg,
      messageList:[],
      data:{
        sendmessageUrl:'http://stoneapi.snail.com/v2/user/friend/send-text-message',
        peoinfo:[],
      }
    }
  },
  methods: {
    saveRecord:function(data){
      var list = {
        "session_id":this.chatData.session_id,
        messages:[]
      };
      list.messages.push(data)
       console.log('1')
      this.$store.commit('chatrecordstate',{data:list,type:'on'})
    },
    sendText:function(text){
      var on = { 
        is_type:"isSelf",
        time:"",
        text:text,
        avatar:this.$store.state.peinfo.list.avatar
      }
      this.messageList.push(on)

      this.saveRecord(on)
    },
    enter:function(obj){ 
      var e = e || window.event, ec = e.keyCode || e.which;
      if (!e.ctrlKey && 13 == ec) {
        if($('.edContWarp').text() != '') {
          this.sendText($('.edContWarp').text())
        }
        $(document).ready(function(){ 
          $(".v_a").scrollTop($(".v_a")[0].scrollHeight+160);
        })
        $('.edContWarp').html('')
        obj.preventDefault();
        return false;
      }else if (e.ctrlKey && 13 == ec) {
        $("#sendTextarea").append("<div><br/></div>");
        var o = document.getElementById("sendTextarea").lastChild;        
        var textbox = document.getElementById('sendTextarea');
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(textbox);
        range.collapse(false);
        range.setEndAfter(o);
        range.setStartAfter(o);
        sel.removeAllRanges();
        sel.addRange(range);
      }   
    },
    removeSendTs:function(){
      this.tshow = false
    },
    sendMessage:function(){
      this.$post(this.data.sendmessageUrl).then((response) => {
        if(response.code === 200){
          
        }
      })
    }
  },
  mounted(){

  },
  created: function () {
    $(window).resize(function(){
      $('.ChatView').height($(window).height()-2)
      $('.ChatViewContWarp').height($(window).height()-237)
    })
    $(function(){
      $('.ChatView').height($(window).height()-2)
      $('.ChatViewContWarp').height($(window).height()-237)
    })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/ChatView.css'
</style>
