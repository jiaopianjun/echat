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
            <h3>{{LatelyGame.length > 0 ? '最近正在玩'+ LatelyGame.length : 'TA最近毫无动静'}}</h3>
            <ul>
               <li v-for="list in LatelyGame" :gameid="list.game_id">
                  <img :src="list.logo"/>
                  <p>{{list.name}}</p>
               </li>
            </ul>
         </div>
         <div class="box">
            <a href="javascript:;" class="isCurrent" @click="button(type,currentData[0].aid,currentData[0].id)">{{type == true ?'同意':'发消息'}}</a>
            <a href="javascript:;" class="default" v-if="type" @click="refuse(currentData[0].id)">拒绝</a>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import navBar from './navBar.vue'
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
        getfriendInfo:"http://stoneapi.snail.com/v2/user/friend/friend-info"
      },
      LatelyGame:[],
      userInfo_aid:''
    }
  },
  methods: {
    button:function(type,userAid,userId){
      // 发送消息
      if(type === false){
        this.$store.commit('menustate',{type:true,flag:false,data:this.currentData})
      }else{
        // 同意申请
        this.$post(this.data.agreeUrl,{id:userId}).then((response) => {
          if(response.code === 200){
             this.$store.commit('applystate',{type:'adopt',data:this.currentData})
          }
        })
      }
    },
    refuse:function(userId){
      // 拒绝申请
      this.$post(this.data.refuseUrl,{id:userId}).then((response) => {
        if(response.code === 200){
          this.$store.commit('applystate',{type:'refuse',data:this.currentData})
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
    $(window).resize(function(){
      $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    })
    $(function(){
      $('.ContactsView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont').height($(window).height()-237)
    })
  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/ContactsView.css'
</style>
