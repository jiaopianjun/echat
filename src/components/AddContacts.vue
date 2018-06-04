<template>
  <div class="AddContacts" id="AddContacts">
     <navBar></navBar>
     <div class="AddContactsBox">
        <h3>添加好友</h3>
        <div class="AddContactsSerchBox">
            <input type="text" placeholder="请输入用户名/好友昵称..." id="serchInput" @focus="delStatus" @keydown.13="enter($event)"/>
            <span @click="serchBtn">搜索</span>
            <p v-if="status">{{statusMessage}}</p>
        </div>

        <div class="AddContactsSerchListBox">
           <h4>搜索结果 <a href="javascript:;" v-if="false"> <查看推荐好友</a></h4>
           <ul>
               <li v-for="(list,index) in data.list" :id="list.aid" :ueraid="list.aid" v-if="(list.status != 2) && (list.aid != isselfAid)" :aa="isselfAid">
                   <div class="imgHd"><img :src="list.avatar"/></div>
                   <div class="userInfo">
                      <p>{{list.nickname}} <i :class="list.sex" v-if="false"></i></p>
                      <span :class="list.status === 0  ? 'addFriends':'addProving'" @click="addFriend(list.status,list.aid,index)"><img src="../images/addFriends.png" v-if="list.status === 0"/>{{list.status === 0 ? '好友':'待验证'}}</span>
                   </div>
               </li>
           </ul>
        </div>
     </div>
  </div>
</template>

<script>
import navBar from './navBar.vue'
export default {
  name: 'AddContacts',
  components:{
    navBar:navBar
  },
  watch:{
    "$store.state.peinfo.list":function(){
      if(this.$store.state.peinfo.list){
        this.isselfAid = this.$store.state.peinfo.list.aid
      }
    },
  },
  data () {
    return {
      data:{
        serchFriendsUrl:'http://stoneapi.snail.com/v2/user/friend/search',
        addFriendUrl:'http://stoneapi.snail.com/v2/user/friend/apply',
        list:[]
      },
      status:false,
      statusMessage:'',
      isselfAid:0
    }
  },
  methods: {
    enter:function(e){
      this.serchBtn()
      this.status = false
    },
    delStatus:function(){
      this.status = false
    },
    serchBtn:function(){
      if($("#serchInput").val()){
        this.post($("#serchInput").val().replace(/(^\s*)|(\s*$)/g, ""))
      }else{
        this.status = true
        this.statusMessage = '请输入好友昵称...'
      }
    },
    post:function(name){
      this.$fetch(this.data.serchFriendsUrl,{q:name,perPage:20}).then((response) => {
        if(response.code == 200){
          this.data.list = response.list
          if(response.list.length === 0){
            this.status = true
            this.statusMessage = '没有找到您要搜索的好友...'
          }
        }
      })
    },
    addFriend:function(status,aid,index){
      if(status === 0){
        this.$post(this.data.addFriendUrl,{friend_aid:aid}).then((response) => {
          if(response.code == 200){
            this.$store.commit('rulestate',{type:'send',status:true,data:''})
            this.data.list[index].status = 1
          }else{
            var data = {"message":response.message}
            this.$store.commit('rulestate',{type:'other',status:true,data:data})
          }
        })
      }
    }
  },
  mounted(){
  },
  created: function () {
    // $(window).resize(function(){
    //   $('.AddContactsSerchListBox ul').height($(window).height()-256)
    // })
    // $(function(){
    //   $('.AddContactsSerchListBox ul').height($(window).height()-256)
    // })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../sass/stylesheets/AddContacts.css'
</style>
