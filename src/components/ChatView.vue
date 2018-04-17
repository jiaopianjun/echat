<template>
  <div :class="['ChatView clearfix',{'defaultState':isDefault == false}]">
    <navBar></navBar>
    <div class="ChatViewCont" v-show="chatData[0].name != 'default'">
       <div class="ChatViewContMenu">
         <span class="">{{chatData[0].name}}</span>
         <em v-if="chatData[0].state != ''">正在玩：{{chatData[0].state}}</em>
       </div>
       <div class="ChatViewContWarp">
          <div class="v_a">
             <ul class="a_b">
                <li :class="list.istype" v-for="(list,index) in Chatrecord">
                    <p class="chatTime" v-if="list.time">{{list.time}}</p>
                    <div class="chatStrip clearfix">
                       <div class="chatUserImg">
                          <img src="../images/default.png"/>
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
            <span v-show="placeholder">按回车键发送消息...</span>
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
  props:['chatData','isDefault','placeholder'],
  watch:{
    chatData:{  
      handler:function(val,oldval){  
        $(document).ready(function(){ 
          $(".edContWarp").html('');
          $(".v_a").scrollTop($(".v_a")[0].scrollHeight+160);
        })
      },  
      deep:true
    },
    Chatrecord:{  
      handler:function(val,oldval){  
        $(document).ready(function(){ 
          $(".v_a").scrollTop($(".v_a")[0].scrollHeight+160);
        })
      },  
      deep:true
    }
  },
  data () {
    return {
      Chatrecord:[
        {"istype":"isOther","time":"2018-02-06 :15:30:09","text":"好无聊哦"},
        {"istype":"isSelf","time":"2018-02-06 :15:31:09","text":"是的呢，明天去哪儿玩啊"},
        {"istype":"isSelf","time":"","text":"不知道啊，你呢"},
        {"istype":"isOther","time":"2018-02-06 :15:33:09","text":"我去苏州哦，要不要一起"},
        {"istype":"isOther","time":"","text":"等会去找你我们一起啊"}
      ]
    }
  },
  methods: {
    ohterText:function(text){
      var _this = this
      var newMessage = {"istype":"isOther","time":"","text":text}
      setTimeout(function(){
         _this.Chatrecord.push(newMessage)
           $(".v_a").scrollTop($(".v_a")[0].scrollHeight+160);
       },100)
    },
    sendText:function(text){
       var newMessage = {"istype":"isSelf","time":"","text":text}
       this.Chatrecord.push(newMessage)
       $(document).ready(function(){ 
         $(".v_a").scrollTop($(".v_a")[0].scrollHeight+160);
       })
    },
    enter:function(obj){ 
      var e = e || window.event, ec = e.keyCode || e.which;
      if (!e.ctrlKey && 13 == ec) {
        if($('.edContWarp').text() != '') {
          this.sendText($('.edContWarp').text())
          // this.ohterText($('.edContWarp').text())
        }
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
      this.placeholder = false
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
