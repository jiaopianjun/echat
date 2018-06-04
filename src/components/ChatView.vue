<template>
  <div :class="['ChatView clearfix',{'defaultState':isDefault == false}]" :id="chatData.aid">
    <navBar></navBar>
    <div class="ChatViewCont" v-show="chatData.nickname != 'default'"  :otheraid="chatData.aid">
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
             <div class="edMenuIcon face" v-if="false"></div>
             <div class="edMenuIcon image"  v-if="false">
               <input type="file"/>
             </div>
          </div>
          <div class="edCont">
            <div class="edContWarp" contenteditable="true" @keydown.13="enter($event)" id="sendTextarea" @focus="removeSendTs"></div>
            <span v-show="tshow" @click="removeSendTs">按回车键发送消息...</span>
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
     
    }
  },
  data () {
    return {
      tshow:this.sendMsg,
      messageList:[],
      data:{
        sendmessageUrl:'http://stoneapi.snail.com/v2/user/friend/send-text-message',
        peoinfo:[],
      },
      getTimeUrl:'https://stoneapi.snail.com/v2/env/time',
      nowtime:0
    }
  },
  methods: {
    count:function(obj){
      obj.on('keyup',function(){
          var txtval = obj.text().length;
          var str = parseInt(txtval);
          console.log(str)
          if(str > 1024 ){
            obj.html(obj.text().substring(0, 1024));
            if (typeof obj == 'string') obj = document.getElementById(obj)
            obj.focus();
            if(window.getSelection){
              var sel = window.getSelection();            
              var tempRange = document.createRange();
              tempRange.setStart(obj[0].firstChild, obj[0].firstChild.length);
              sel.removeAllRanges();
              sel.addRange(tempRange);
            }
          }
      });
    },
    getNowtime:function(){
      this.$fetch(this.getTimeUrl).then((response) => {
        if(response.code === 200){
          this.nowtime = this.time(response.timestamp,'hm')
        }
      })
    },
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
    saveRecord:function(data,text){
      var list = {
        "session_id":this.chatData.session_id,
        messages:[]
      };
      list.messages.push(data)
      this.$store.commit('chatrecordstate',{data:list,type:'on'})
      this.chatData.last_message = text
      // this.getNowtime() //获取实时时间
      this.chatData.last_send_at = this.nowtime
      var data = {
        type:'chatview',
        list:[this.chatData]
      };
      this.$store.commit('realchat',{data:data})
    },
    sendText:function(text){
      this.sendMessage(this.chatData.aid,text);
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
      console.log(this.chatData,'sdg')
    },
    sendMessage:function(aid,content){
      var on = { 
        is_type:"isSelf",
        time:"",
        text:content,
        avatar:this.$store.state.peinfo.list.avatar
      }
      this.$post(this.data.sendmessageUrl,{to_aid:aid,content:content}).then((response) => {
        if(response.code === 200){
          this.messageList.push(on)
          this.nowtime = this.time(parseInt(response.timestamp),'hm')
          this.saveRecord(on,content)
        }else if(response.code === 500){
          var data = {"message":response.message}
          this.$store.commit('rulestate',{type:'other',status:true,data:data})
          $('.edContWarp').blur()
        }
      })
    }
  },
  mounted(){
    this.count($("#sendTextarea"))
    this.$fetch(this.getTimeUrl).then((response) => {
      if(response.code === 200){
        this.nowtime = this.time(parseInt(response.timestamp),'hm')
      }
    })
  },
  created: function () {
    // $(window).resize(function(){
    //   $('.ChatView').height($(window).height()-2).width($(window).width()-332)
    //   $('.ChatViewContWarp').height($(window).height()-237)
    // })
    // $(function(){
    //   $('.ChatView').height($(window).height()-2).width($(window).width()-332)
    //   $('.ChatViewContWarp').height($(window).height()-237)
    // })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/ChatView.css'
</style>
