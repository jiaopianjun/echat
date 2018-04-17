<template>
  <div :class="['ContactsView clearfix',{'defaultState':isDefault == false}]">
    <navBar></navBar>
    <div class="ContactsViewCont ">
      <div class="infoDetail" v-if="isDefault">
         <div class="userImg">
             <img src="../images/default.png"/>
         </div>
         <div class="userName">{{myData[0].name}}</div>
         <div class="userAbout">{{myData[0].newmessage}}</div>
         <div class="inGame">
            <h3>最近正在玩 9</h3>
            <ul>
               <li>
                  <img src="../images/default2.jpg"/>
                  <p>部门离开</p>
               </li>
            </ul>
         </div>
         <div class="box">
            <a href="javascript:;" class="isCurrent" @click="button(type)">{{type == true ?'同意':'发消息'}}</a>
            <a href="javascript:;" class="default" v-if="type" @click="refuse(myData[0].id)">拒绝</a>
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
  props: ['myData','type','isDefault'],
  data () {
    return {
      data:this.myData
    }
  },
  methods: {
    button:function(type){
      if(type === false){
        this.$store.commit('menustate',{type:true,flag:false,data:this.myData})
      }else{
        this.$store.commit('applystate',{type:'adopt',data:this.myData})
      }
    },
    refuse:function(infoId){
        this.$store.commit('applystate',{type:'refuse',data:this.myData})
    }
  },
  mounted(){
  },
  created: function () {

  }
}
</script>
<style scoped>
 @import '../sass/stylesheets/ContactsView.css'
</style>
