<template>
  <div class="AddContacts" id="AddContacts">
     <navBar></navBar>
     <div class="AddContactsBox">
        <h3>添加好友</h3>
        <div class="AddContactsSerchBox">
            <input type="text" placeholder="请输入好友昵称..."/>
            <span>搜索</span>
        </div>
        <div class="AddContactsSerchListBox">
           <h4>搜索结果 <a href="javascript:;"> <查看推荐好友</a></h4>
           <ul>
               <li v-for="(list,index) in data">
                   <div class="imgHd"><img :src="list.img"/></div>
                   <div class="userInfo">
                      <p>{{list.name}} <i :class="list.sex"></i></p>
                      <span :class="list.state === false ? 'addFriends':'addProving'" @click="addFriend(list.state)"><img src="../images/addFriends.png" v-if="list.state === false"/>{{list.state === false ? '好友':'待验证'}}</span>
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
  data () {
    return {
      data:[
            {'img':"http://www.dgtle.com/uc_server/data/avatar/000/44/63/19_avatar_middle.jpg","id":"1","name":"杨幂","sex":"w","state":false},
            {'img':"http://www.dgtle.com/uc_server/data/avatar/000/33/89/35_avatar_big.jpg","id":"2","name":"鹿晗","sex":"m","state":true},
            {'img':"http://www.dgtle.com/uc_server/data/avatar/000/88/27/42_avatar_middle.jpg","id":"3","name":"刘诗诗","sex":"w","state":false}
          ]
    }
  },
  methods: {
    addFriend:function(state){
      if(state === false){
        this.$store.commit('rulestate',{type:'send',status:true,data:''})
      }
    }
  },
  mounted(){
  },
  created: function () {
    $(window).resize(function(){
      $('.AddContactsSerchListBox ul').height($(window).height()-256)
    })
    $(function(){
      $('.AddContactsSerchListBox ul').height($(window).height()-256)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../sass/stylesheets/AddContacts.css'
</style>
