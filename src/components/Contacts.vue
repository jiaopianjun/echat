<template>
  <div class="Contacts" id="Contacts">
    <div class="ContactsBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="addContacts">
           <div class="title addContactsTitle titleB">
             好友申请&nbsp;[{{b.length}}]
           </div>
           <div class="addContactsList overflow">
              <div class="ulwrapper">
                <ul>
                   <li v-for="(list,index) in b" @click="mFadd(list,true)">
                      <div class="userHd">
                        <div class="userHdImg"><img src="../images/default.png"/></div>
                        <span class="onlineState online_game"></span>
                      </div>
                      <div class="userInfo">
                         <div class="userInfoA">
                            <span class="name textHidden">{{list.name}}</span>
                         </div>
                         <div class="userInfoB">
                            <span class="oneMessage textHidden">申请加我为好友</span>
                         </div>
                      </div>
                   </li>
                </ul>
              </div>
           </div>
        </div>
        <div class="myFriends">
           <div class="title myFriendsTitle titleB" >
             我的好友&nbsp;[2/{{a.length}}]
           </div>
           <div class="myFriendsList overflow">
              <div class="ulwrapper">
                <ul>
                   <li v-for="(list,index) in a" :key="index" :userpid="list.id" :class="['',{'offline':list.online == false}]" @contextmenu="showMenu(index)" :id="list.online" @click="mFadd(list,false)">
                      <vue-context-menu :contextMenuData="contextMenuData" :transferIndex="transferIndex" @savedata="savedata(list,index)" @newdata="newdata(list)"></vue-context-menu>
                      <div class="userHd">
                        <div class="userHdImg"><img src="../images/default.png"/></div>
                        <span class="onlineState online_game" v-if="list.state"></span>
                      </div>
                      <div class="userInfo">
                         <div class="userInfoA">
                            <span class="name textHidden">{{list.name}}</span>
                         </div>
                      </div>
                   </li>
                </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
    <ContactsView :myData.sync="myData" :type.sync="type" :isDefault.sync="isDefault"></ContactsView>
  </div>
</template>
<script>
import ContactsView from './ContactsView.vue'
export default {
  name: 'Contacts',
  components: {
    ContactsView: ContactsView
  },
  data () {
    return {
      a:[{"id":"4","name":"沙克尔","state":"NBA2k18","online":true,"newmessage":"你去死吧！","newtime":"10:00","messagenum":"13"},
         {"id":"5","name":"朱元璋","state":"王者荣耀","online":false,"newmessage":"我一会就来","newtime":"12:00","messagenum":"0"},
         {"id":"6","name":"毛尖的","state":"","online":true,"newmessage":"我要去说相声了","newtime":"16:00","messagenum":"133"}
      ],
      b:[{"id":"7","name":"奥尼尔","state":"NBA2k18","online":true,"newmessage":"你去死吧！","newtime":"10:00","messagenum":"13"},
         {"id":"8","name":"刘潇潇","state":"王者荣耀","online":false,"newmessage":"我一会就来","newtime":"12:00","messagenum":"0"},
         {"id":"9","name":"王大锤","state":"","online":true,"newmessage":"我要去说相声了","newtime":"16:00","messagenum":"133"}
      ],
      transferIndex: null,
      contextMenuData: {
        menuName: 'demo',
        axios: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: 'savedata',
            btnName: '发送消息'
          },
          {
            fnHandler: 'newdata',
            btnName: '移除好友'
          }
        ]
      },
      myData:[{
        "name":"default"
      }],
      type:false,
      isDefault: false
    }
  },
  watch:{
    "$store.state.contacts.applyList":function(){
      var publicData = $.extend(true, [], this.$store.state.contacts.applyList),
          applyList = $.extend(true, [], this.b),
          friendsList = $.extend(true, [], this.a),
          type = this.$store.state.contacts.type,
          ApplyData = [],
          storeData = [];
      if(publicData[0]){
        if(type === 'refuse'){
          this.updateApplyList(publicData,applyList,ApplyData)
        }else{
          this.updateFriendsList(publicData,friendsList,storeData)
          this.updateApplyList(publicData,applyList,ApplyData)
        }
        this.isDefault = false
      }
    }
  },
  methods:{
    showMenu:function(index) {
      this.transferIndex = index
      event.preventDefault()
      var x = event.clientX
      var y = event.clientY
      this.contextMenuData.axios = {
        x, y
      }
    },
    savedata:function (data,e) {
      this.$store.commit('menustate',{type:true,flag:false,data:[data]})
    },
    newdata:function (data) {
      this.$store.commit('rulestate',{type:'del',status:true,data:data})
    },
    clickList:function(e){
      $('body').on('click','.ChatList .title',function(event){
         var liShow = 'titleB',
             slideDiv = '.overflow';
         if($(this).hasClass(liShow)){
            $(this).removeClass(liShow).siblings(slideDiv).hide()
         }else{
            $(this).addClass(liShow).siblings(slideDiv).show()
         }
      })
    },
    mFadd:function(data,type){  //好友列表点击
      var dom = event.currentTarget,
          $ContactsCli = $('.Contacts .ChatList li');
      $ContactsCli.removeClass('current')
      $(dom).addClass('current')
      this.myData = [data]
      this.type = type
      this.isDefault = true
    },
    updateApplyList:function(publicData,applyList,ApplyData){
      for(var i in applyList){
        if(applyList[i].id !== publicData[0].id){
          ApplyData.push(applyList[i])
        }
      }
      this.b = $.extend(true, [], ApplyData)
    },
    updateFriendsList:function(publicData,friendsList,storeData){
      for(var i in friendsList){
        if(friendsList[i].id !== publicData[0].id){
          storeData.push(friendsList[i])
        }
      }
      storeData.unshift(publicData[0])
      this.a = $.extend(true, [], storeData)
    }
  },
  mounted(){
    this.clickList()
  },
  created: function () {
    $(window).resize(function(){
      $(".myFriendsList").height($(window).height()-252)
      $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    })
    $(function(){
      $(".myFriendsList").height($(window).height()-252)
      $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    })
  }
}
</script>
<style scoped>
  @import '../sass/stylesheets/Contacts.css'
</style>
