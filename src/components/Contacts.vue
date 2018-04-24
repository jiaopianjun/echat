<template>
  <div class="Contacts" id="Contacts">
    <div class="ContactsBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="addContacts">
           <div class="title addContactsTitle titleB">
             好友申请&nbsp;[{{data[1].ApplyList.length}}]
           </div>
           <div class="addContactsList overflow">
              <div class="ulwrapper">
                <ul>
                   <li v-for="(list,index) in data[1].ApplyList" @click="mFadd(list.aid,list.id,true)" :useraid="list.aid" :userid="list.id">
                      <div class="userHd">
                        <div class="userHdImg"><img :src="list.avatar"/></div>
                      </div>
                      <div class="userInfo">
                         <div class="userInfoA">
                            <span class="name textHidden">{{list.nickname}}</span>
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
             我的好友&nbsp;[{{data[0].onlineNum}}/{{data[0].friendsList.length}}]
           </div>
           <div class="myFriendsList overflow">
              <div class="ulwrapper">
                <ul>
                   <li v-for="(list,index) in data[0].friendsList" :key="index" :useraid="list.aid" :class="['',{'offline':list.is_online == 0}]" @contextmenu="showMenu(index)" :state="list.is_online" @click="mFadd(list.aid,list.id,false)">
                      <vue-context-menu :contextMenuData="contextMenuData" :transferIndex="transferIndex" @savedata="savedata(list.aid,list.id,false)" @newdata="newdata(list)"></vue-context-menu>
                      <div class="userHd">
                        <div class="userHdImg"><img :src="list.avatar"/></div>
                        <span class="onlineState online_game" v-if="false"></span>
                      </div>
                      <div class="userInfo">
                         <div class="userInfoA">
                            <span class="name textHidden">{{list.nickname}}</span>
                         </div>
                      </div>
                   </li>
                </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
    <ContactsView :currentData.sync="currentData" :type.sync="type" :isDefault.sync="isDefault"></ContactsView>
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
      b:[{"id":"3","aid":"7","nickname":"奥尼尔","is_online":0,"avatar":"http://www.dgtle.com/uc_server/data/avatar/000/44/63/19_avatar_middle.jpg"},
         {"id":"2","aid":"8","nickname":"二傻子","is_online":1,"avatar":"http://www.dgtle.com/uc_server/data/avatar/000/33/89/35_avatar_big.jpg"},
         {"id":"4","aid":"9","nickname":"特朗普","is_online":0,"avatar":"http://www.dgtle.com/uc_server/data/avatar/000/88/27/42_avatar_middle.jpg"}
      ],
      data:[
        {
          friendsList:[],
          friendsUrl:'http://stoneapi.snail.com/v2/user/friend/list',
          onlineNum:0
        },
        {
          ApplyList:[],
          ApplyUrl:'http://stoneapi.snail.com/v2/user/friend/apply-list',
          ApplyNum:0
        },
        {
          getfriendInfo:"http://stoneapi.snail.com/v2/user/friend/friend-info"
        }
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
      currentData:[{
        "name":"default"
      }],
      type:false,
      isDefault: false
    }
  },
  watch:{
    "$store.state.contacts.applyList":function(){
      var publicData = $.extend(true, [], this.$store.state.contacts.applyList),
          applyList = $.extend(true, [], this.data[1].ApplyList),
          friendsList = $.extend(true, [], this.data[0].friendsList),
          type = this.$store.state.contacts.type,
          ApplyData = [],
          storeData = [];
      if(publicData[0]){
        if(type === 'refuse'){
          // 拒绝好友申请
          this.updateApplyList(publicData,applyList,ApplyData)
        }else if(type === 'adopt'){
          // 通过好友申请
          this.updateFriendsList(publicData,friendsList,storeData)
          this.updateApplyList(publicData,applyList,ApplyData)
        }
        this.isDefault = false
      }
    },
    "$store.state.rule.type":function(){
      if(this.$store.state.rule.type === 'delete'){
        var publicData = $.extend(true, [], this.$store.state.rule.list),
            friendsList = $.extend(true, [], this.data[0].friendsList),
            storeData = [];
        if(publicData){
          this.delAfterFriendsList(publicData,friendsList,storeData)
          this.isDefault = false
        }
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
    savedata:function (aid,id,type) {
      // 发送消息
      this.$fetch(this.data[2].getfriendInfo,{friend_aid:aid}).then((response) => {
        if(response.code === 200){
          var newData = response.result
              newData.id = id
          this.$store.commit('menustate',{type:true,flag:false,data:[newData]})
        }
      })
    },
    newdata:function (data) {
      // 删除好友
      this.$store.commit('rulestate',{type:'del',status:true,data:data})
    },
    clickList:function(e){
      // 列表点击效果
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
    mFadd:function(aid,id,type){  
      //好友列表点击
      var dom = event.currentTarget,
          $ContactsCli = $('.Contacts .ChatList li');
      $ContactsCli.removeClass('current')
      $(dom).addClass('current')
      this.type = type
      this.isDefault = true
      this.getUserInfo(aid,id)
    },
    getUserInfo:function(aid,id){
      this.$fetch(this.data[2].getfriendInfo,{friend_aid:aid}).then((response) => {
        if(response.code === 200){
          var newData = response.result
              newData.id = id
          this.currentData = [newData]
        }
      })
    },
    updateApplyList:function(publicData,applyList,ApplyData){
      // 更新申请列表
      for(var i in applyList){
        if(applyList[i].aid !== parseInt(publicData[0].aid)){
          ApplyData.push(applyList[i])
        }
      }
      this.data[1].ApplyList = $.extend(true, [], ApplyData)
    },
    updateFriendsList:function(publicData,friendsList,storeData){
      // 好友申请通过后 更新好友列表
      for(var i in friendsList){
        if(friendsList[i].aid !== parseInt(publicData[0].aid)){
          storeData.push(friendsList[i])
        }
      }
      // 加好友通过，如果在线则在好友列表最上面，如果离线则在列表最下面
      if(publicData[0].is_online === 1){ 
        storeData.unshift(publicData[0])
      }else{
        storeData.push(publicData[0])
      }
      
      this.data[0].friendsList = $.extend(true, [], storeData)
    },
    delAfterFriendsList:function(publicData,friendsList,storeData){
      // 删除好友后更新好友列表
      for(var i in friendsList){
        if(friendsList[i].aid !== publicData.aid){
          storeData.push(friendsList[i])
        }
        this.data[0].friendsList = $.extend(true, [], storeData)
      }
    }
  },
  mounted(){
   // 好友列表
   this.$fetch(this.data[0].friendsUrl).then((response) => {
      if(response.code == 200){
        this.data[0].friendsList = response.friend_list
        for(var i in response.friend_list){
          if(response.friend_list[i].is_online === 1){
            this.data[0].onlineNum += 1
          }
        }
      }
    })
    // 好友申请列表
    this.$fetch(this.data[1].ApplyUrl).then((response) => {
      if(response.code == 200){
        this.data[1].ApplyList = response.apply_list
        this.data[1].ApplyNum = response.apply_list.length
      }
    })
  },
  created: function () {
    this.clickList()
    $(window).resize(function(){
      $(".myFriendsList").height($(window).height()-252)
    })
    $(function(){
      $(".myFriendsList").height($(window).height()-252)
    })
  }
}
</script>
<style scoped>
  @import '../sass/stylesheets/Contacts.css'
</style>
