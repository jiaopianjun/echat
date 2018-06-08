<template>
  <div :class="['ContactsView clearfix',{'defaultState':isDefault == false}]">
    <navBar></navBar>
    <div class="ContactsViewCont">
      <div class="infoDetail" v-if="isDefault" :userAid="currentData[0].aid">
         <div class="userImg">
             <img :src="currentData[0].avatar"/>
         </div>
         <div class="userName">{{currentData[0].nickname}}</div>
         <div class="userAbout">{{currentData[0].nickname}}</div>
         <div class="inGame">
            <h3>{{LatelyGame.length > 0 ? '最近正在玩' : 'TA最近毫无动静'}}</h3>
            <ul>
               <li v-for="list in LatelyGame" :gameid="list.game_id">
                  <img :src="list.logo"/>
                  <p>{{list.name}}</p>
               </li>
            </ul>
         </div>
         <div class="box">
            <a href="javascript:;" class="isCurrent" @click="button(type,currentData[0].aid)">{{type == true ?'同意':'发消息'}}</a>
            <a href="javascript:;" class="default" v-if="type" @click="refuse(currentData[0].aid)">拒绝</a>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import navBar from './navBar.vue'
import { hybrid } from './../until/inside'  
export default {
  name: 'ContactsView',
  components:{
    navBar:navBar
  },
  props: ['currentData','type','isDefault'],
  watch:{
    currentData:{  
      handler:function(val,oldval){  
        this.LatelyGame = val[0].played_game_info
      },  
      deep:true
    },
  },
  data () {
    return {
      data:{
        agreeUrl:"http://stoneapi.snail.com/v2/user/friend/apply-agree",
        refuseUrl:"http://stoneapi.snail.com/v2/user/friend/apply-refuse",
        getfriendInfo:"http://stoneapi.snail.com/v2/user/friend/friend-info",
      },
      LatelyGame:[],
      userInfo_aid:'',
      cData:[]
    }
  },
  methods: {
    getUserInfo:function(aid,id){
      this.$fetch(this.data.getfriendInfo,{friend_aid:aid}).then((response) => {
        if(response.code === 200){
          var newData = response.result;
              newData.id = id
              newData.message_count = 0
              newData.last_message = ''
              newData.last_send_at = ''
              newData.current = 'current'
          this.cData = [newData]
        }
      })
    },
    button:function(type,userAid){
      // 发送消息
      if(type === false){
        this.$store.commit('menustate',{type:true,flag:false,data:this.currentData,messageNum:this.$store.state.menu.messageNum,applyNum:this.$store.state.menu.applyNum})
      }else{
        // 同意申请
        this.getUserInfo(userAid,'')
        this.$post(this.data.agreeUrl,{aid:userAid}).then((response) => {
          if(response.code === 200){
             this.$store.commit('applystate',{type:'adopt',data:this.cData})
             this.$store.commit('menustate',{messageNum:this.$store.state.menu.messageNum,applyNum:parseInt(this.$store.state.menu.applyNum) - parseInt(1)}) //  通过申请后 好友申请数量-1
          }else if(response.code === 403){
          var data = {"message":response.message}
          this.$store.commit('rulestate',{type:'other',status:true,data:data})
          }
        })
      }
    },
    refuse:function(userAid){
      // 拒绝申请
      this.getUserInfo(userAid,'')
      this.$post(this.data.refuseUrl,{aid:userAid}).then((response) => {
        if(response.code === 200){
          this.$store.commit('applystate',{type:'refuse',data:this.cData})
          this.$store.commit('menustate',{messageNum:this.$store.state.menu.messageNum,applyNum:parseInt(this.$store.state.menu.applyNum) - parseInt(1)}) // 通过申请后 好友申请数量-1
        }else if(response.code === 403){
          var data = {"message":response.message}
          this.$store.commit('rulestate',{type:'other',status:true,data:data})
        }
      })
    },
    postAjax:function(url,data){
      this.$fetch(url,data).then((response) => {
        this.currentData[0].is_online = response.result.is_online
        this.$store.commit('applystate',{type:'adopt',data:this.currentData})
      })
    }
  },
  mounted(){
    
  },
  created: function () {
    this.$hybrid.refuse = this.refuse
    this.$hybrid.button = this.button

    // $(window).resize(function(){
    //   $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
    //   $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    // })
    // $(function(){
    //   $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
    //   $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    // })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/ContactsView.css'
</style>
