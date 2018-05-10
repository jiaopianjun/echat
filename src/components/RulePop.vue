<template>
  <div class="RulePop"  id="RulePop">
     <div class="pop">
       <h3>提示<span class="close" @click="$store.commit('rulestate',{type:'',status:false,data:{}})"></span></h3>
       <div class="cont">
          <div :class="['contMessage',type]">
            <i></i>
            <span>{{type === 'del' ? '确定要移除 '+ delInfo.name +' 吗？' : message[type]}}</span>
          </div>
          <div class="box" v-show="type === 'del'">
            <a href="javascript:;" @click="delFriends()">确定</a>
            <a href="javascript:;" @click="$store.commit('rulestate',{type:'',status:false,data:{}})">取消</a>
          </div>
       </div>
     </div>
     <div class="divMask"></div>
  </div>
</template>
<script>
export default {
  name: 'RulePop',
  data () {
    return {
      message:{
        "toplimit":"好友数量已达上限(｀ﾟДﾟ´)ゞ",
        "timeout":"网络超时(Ｔ▽Ｔ)",
        "send":"好友申请已发送(～￣▽￣)～ ",
        "del":"确定要移除 Jaychou 吗？",
        "other":""
      },
      delInfo:{
        name:"default",
        chatObjectId:"default",
        data:[]
      },
      type:'',
      data:{
        delUrl:"http://stoneapi.snail.com/v2/user/friend/delete"
      }
    }
  },
  watch:{
    "$store.state.rule.list":function(){
      var newData = $.extend(true, [], this.$store.state.rule.list)
      if(newData){
         this.delInfo.chatObjectId = newData.aid
         this.delInfo.name = newData.nickname
         this.delInfo.data = newData
         this.type = this.$store.state.rule.type
         this.message.other = newData.message
      }
    }
  },
  methods: {
    delFriends:function(){
      this.$post(this.data.delUrl,{friend_aid:this.delInfo.chatObjectId}).then((response) => {
        if(response.code === 200){
          this.$store.commit('rulestate',{type:'delete',status:false,data:this.delInfo.data})
        }
      })
    }
  },
  mounted(){
  },
  created: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../sass/stylesheets/RulePop.css'
</style>
