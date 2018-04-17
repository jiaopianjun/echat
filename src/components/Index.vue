<template>
  <div class="Index clearfix"  id="Index">
    <div class="Menu" id="Menu">
      <div class="userImg">
        <img src="../images/default.png"/>
      </div>
      <ul class="menuList">
        <li :class="['message',{'current':$store.state.menu.cause === true && $store.state.menu.other === false}]" @click="$store.commit('menustate',{type:true,flag:false,messageNum:$store.state.menu.messageNum})">
           <div class="icon"></div>
           <span class="messageNum" v-show="$store.state.menu.messageNum > 0">{{$store.state.menu.messageNum > 99 ? '99+' : $store.state.menu.messageNum}}</span>
        </li>
        <li :class="['friends',{'current':$store.state.menu.cause === false && $store.state.menu.other === false}]" @click="$store.commit('menustate',{type:false,flag:false,messageNum:$store.state.menu.messageNum})">
           <div class="icon"></div>
        </li>
      </ul>
      <ul class="otherList">
         <li class="addFriends" @click="$store.commit('menustate',{type:false,flag:true,messageNum:$store.state.menu.messageNum})">
             <div class="icon"></div>
         </li>
      </ul>
    </div>
    <div class="Content" id="Content">
      <Chat v-show="$store.state.menu.cause === true && $store.state.menu.other === false"></Chat>
      <Contacts v-show="$store.state.menu.cause === false && $store.state.menu.other === false"></Contacts>
      <AddContacts v-show="$store.state.menu.other === true && $store.state.menu.cause === false "></AddContacts>
    </div>
    <RulePop v-show="$store.state.rule.status === true"></RulePop>
  </div>
</template>
<script>
// import Menu from './Menu.vue'
// import Content from './Content.vue'
import RulePop from './RulePop.vue'
import Chat from './Chat.vue'
import Contacts from './Contacts.vue'
import AddContacts from './AddContacts.vue'
import store from '@/store/index.js'
export default {
  name: 'Index',
  components: {
    // Menu: Menu,
    // Content: Content,
    RulePop:RulePop,
    Chat: Chat,
    Contacts: Contacts,
    AddContacts: AddContacts
  },
  data () {
    return {
      iscurrent:this.$store.state.menu.cause,
      AddContacts:this.$store.state.menu.other
    }
  },
  methods: {
  },
  mounted(){
    // this.$fetch('/api/v2/movie/top250',{'dd':'ddd'})
    //   .then((response) => {
    //     console.log(response)
    //   })
  },
  created: function () {
    $(window).resize(function(){
      $('.Content').width($(window).width()-54)
      $('.Menu').height($(window).height()-2)
      $('.ChatList').height($(window).height()-72)
      $(".myFriendsList").height($(window).height()-252)
      $('.ContactsView,.ChatView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont,.ChatViewContWarp').height($(window).height()-237)
    })
    $(function(){
      $('.Content').width($(window).width()-54)
      $('.ChatList').height($(window).height()-72)
      $('.Menu').height($(window).height()-2)
      $(".myFriendsList").height($(window).height()-252)
      $('.ContactsView,.ChatView').width($(window).width()-332).height($(window).height()-2)
      $('.ContactsViewWarp,.ContactsViewCont,.ChatViewContWarp').height($(window).height()-237)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../sass/stylesheets/Index.css'
</style>
