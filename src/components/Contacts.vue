<template>
  <div class="Contacts" id="Contacts">
    <div class="ContactsBox"> 
      <div class="ChatSerch">
          <input type="text" class="ChatSerchInput" placeholder="搜索..."/>
      </div>
      <div class="ChatList clearfix">
        <div class="addContacts">
           <div class="title addContactsTitle titleB" :data-num="data[1].ApplyList.length">
             好友申请&nbsp;[{{data[1].ApplyList.length}}]
           </div>
           <div class="addContactsList overflow" v-if="data[1].ApplyList.length">
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
                <ul id="ulwrapper">
                   <li v-for="(list,index) in data[0].friendsList" :key="index" :useraid="list.aid" :class="['',{'offline':list.is_online == 0}]" @contextmenu="showMenu(index)" :state="list.is_online" @click="mFadd(list.aid,list.id,false)" :userid="list.id">
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
    data:{
     handler:function(val,valold){
       var list = val[0].friendsList,onlineNum = 0,_this = this;
       for(var i in list){
          if(parseInt(list[i].is_online) !== 0){
            onlineNum += 1
          }
       }
       _this.data[0].onlineNum = onlineNum
       console.log(onlineNum,'zuixin')
     },  
      deep:true
    },
    "$store.state.contacts.applyList":function(){ // 监听好友列表
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
          // this.updateFriendsList(publicData,friendsList,storeData)
          this.updateApplyList(publicData,applyList,ApplyData)
        }
        this.isDefault = false
      }
    },
    "$store.state.rule.type":function(){ // 弹窗监听
      if(this.$store.state.rule.type === 'delete'){
        var publicData = $.extend(true, [], this.$store.state.rule.list),
            friendsList = $.extend(true, [], this.data[0].friendsList),
            storeData = [];
        if(publicData){
          this.delAfterFriendsList(publicData,friendsList,storeData)
          this.isDefault = false
        }
      }
    },
    "$store.state.realchat.friendonline":function(){ // 监听好友上线
      var onlineData = $.extend(true, {}, this.$store.state.realchat.friendonline),
          friendsList = $.extend(true, [], this.data[0].friendsList),
          storeData = [],
          storeData2 = [];
      if(onlineData){
        for(var i in friendsList){
          if(parseInt(friendsList[i].aid) === parseInt(onlineData.aid)){
            friendsList[i].is_online = parseInt(1)
            storeData = friendsList[i]
            // this.data[0].onlineNum += 1
            // this.isOnlineNum();
          }else{
            storeData2.push(friendsList[i])
          }
        }
        storeData2.unshift(storeData)
        this.data[0].friendsList = $.extend(true, [], storeData2)
      }
    },
    "$store.state.realchat.friendoffline":function(){ // 监听好友下线
      var offlineData = $.extend(true, [], this.$store.state.realchat.friendoffline),
          friendsList = $.extend(true, [], this.data[0].friendsList),
          storeData = [],
          storeData2 = [];
      if(offlineData){
        for(var i in friendsList){
          if(parseInt(friendsList[i].aid) === parseInt(offlineData.aid)){
            friendsList[i].is_online = parseInt(0)
            storeData = friendsList[i]
            // this.data[0].onlineNum -= 1
            // this.isOnlineNum()
          }else{
            storeData2.push(friendsList[i])
          }
        }
        storeData2.push(storeData)
        this.data[0].friendsList = $.extend(true, [], storeData2)
      }
    },
    "$store.state.realchat.friendapply":function(){ // 监听好友申请
      var applyData = $.extend(true, {}, this.$store.state.realchat.friendapply),
          applyList = $.extend(true, [], this.data[1].ApplyList),
          storeData = [],
          storeData2 = [];
      if(applyData){
        for(var i in applyList){
          storeData2.push(applyList[i])
        }
        storeData.push(applyData)
        storeData2.unshift(storeData[0])
        this.data[1].ApplyList = $.extend(true, [], storeData2)
        this.$store.commit('menustate',{messageNum:this.$store.state.menu.messageNum,applyNum:parseInt(this.$store.state.menu.applyNum) + parseInt(1)}) //有好友申请 好友申请数量+1
      }
    },
    "$store.state.realchat.friendadded":function(){ // 监听好友申请通过后
      var addedData = $.extend(true, {}, this.$store.state.realchat.friendadded),
          friendsList = $.extend(true, [], this.data[0].friendsList),
          storeData = [],
          storeData2 = [];
      if(addedData){
        for(var i in friendsList){
          storeData2.push(friendsList[i])
        }
        storeData.push(addedData)
        storeData2.push(storeData[0])
        this.data[0].friendsList = $.extend(true, [], storeData2)
        if(addedData.is_online === true){
          var obj = {
            type: "friend_online", // 好友上线
            aid: addedData.aid,
            nickname: addedData.nickname
          };
          obj = JSON.stringify(obj);
          this.$store.commit('realchat',{data:obj})
        }
      }
    },
    "$store.state.realchat.frienddeleted":function(){ // 监听好友被删除后 同步删除
      var deletedData = $.extend(true, [], this.$store.state.realchat.frienddeleted),
          friendsList = $.extend(true, [], this.data[0].friendsList),
          storeData = [],
          storeData2 = [];
      if(deletedData){
        for(var i in friendsList){
          if(parseInt(friendsList[i].aid) === parseInt(deletedData.aid)){
            if(friendsList[i].is_online !== parseInt(0)){
              // this.data[0].onlineNum -= 1
              // this.isOnlineNum()
            }
          }else{
            storeData2.push(friendsList[i])
          }
        }
        this.data[0].friendsList = $.extend(true, [], storeData2)
      }
    },
  },
  methods:{
    isOnlineNum:function(){
      var isonline = 0,
          $list = $("#ulwrapper li"),
          _this = this;
      setTimeout(function(){
        $("#ulwrapper li").each(function(){  
          if(parseInt($(this).attr('state')) === 1){
            isonline +=1
          }  
        })  
        _this.data[0].onlineNum = isonline
       },200)
    },
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
          var newData = response.result;
              newData.id = id
              newData.message_count = 0
              newData.last_message = newData.last_send_at = ''
              newData.current = 'current'
          this.$store.commit('menustate',{type:true,flag:false,data:[newData],messageNum:this.$store.state.menu.messageNum,applyNum:this.$store.state.menu.applyNum})
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
          var newData = response.result;
              newData.id = id
              newData.message_count = 0
              newData.last_message = ''
              newData.last_send_at = ''
              newData.current = 'current'
          this.currentData = [newData]
        }
      })
    },
    updateApplyList:function(publicData,applyList,ApplyData){
      // 更新申请列表
      for(var i in applyList){
        if(parseInt(applyList[i].aid) !== parseInt(publicData[0].aid)){
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
      if(publicData[0].is_online !== 0){ 
        storeData.unshift(publicData[0])
        // this.data[0].onlineNum += 1
        // this.isOnlineNum()
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
        }else{
          if(friendsList[i].is_online !== 0){
            // this.data[0].onlineNum -= 1
            // this.isOnlineNum()
          }
        }
        this.data[0].friendsList = $.extend(true, [], storeData)
      }
    }
  },
  mounted(){
   // 好友列表
    var vm = this
    vm.$http({
      url: this.data[0].friendsUrl,
      method: 'jsonp',
      params: {},
      jsonp: 'callback',
      emulateJSON: true,
      headers: {
        'Content-Type': 'x-www-from-urlencoded'
      }
    }).then(function (res) {
      if(res.body.code === 200){
        for(var i in res.body.friend_list){
          if(res.body.friend_list[i].is_online !== 0){
            this.data[0].onlineNum += 1
          }
        }
        this.data[0].friendsList = res.body.friend_list
      }
    })


   // this.$fetch(this.data[0].friendsUrl).then((response) => {
   //    if(response.code == 200){
   //      for(var i in response.friend_list){
   //        if(response.friend_list[i].is_online === 1){
   //          this.data[0].onlineNum += 1
   //        }
   //      }
   //      this.data[0].friendsList = response.friend_list
   //    }
   //  })

    // 好友申请列表
    var vm = this
    vm.$http({
      url: this.data[1].ApplyUrl,
      method: 'jsonp',
      params: {},
      jsonp: 'callback',
      emulateJSON: true,
      headers: {
        'Content-Type': 'x-www-from-urlencoded'
      }
    }).then(function (res) {
      if(res.body.code === 200){
        this.data[1].ApplyList = res.body.apply_list
        this.data[1].ApplyNum = res.body.apply_list.length
        if(res.body.apply_list){
          this.$store.commit('menustate',{messageNum:this.$store.state.menu.messageNum,applyNum:res.body.apply_list.length})
        }
      }
    })

    // this.$fetch(this.data[1].ApplyUrl).then((response) => {
    //   if(response.code == 200){
    //     this.data[1].ApplyList = response.apply_list
    //     this.data[1].ApplyNum = response.apply_list.length
    //     if(response.apply_list){
    //       this.$store.commit('menustate',{messageNum:this.$store.state.menu.messageNum,applyNum:response.apply_list.length})
    //     }
        
    //   }
    // })
  },
  created: function () {
    this.clickList()
    this.$hybrid.savedata = this.savedata
    // $(window).resize(function(){
    //   $(".myFriendsList").height($(window).height()-252)
    // })
    // $(function(){
    //   $(".myFriendsList").height($(window).height()-252)
    // })
  }
}
</script>
<style scoped>
  @import '../sass/stylesheets/Contacts.css'
</style>
