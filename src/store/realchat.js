export default {
    state: {
        chatinfolist:{},
        friendonline:{},
        friendoffline:{},
        friendapply:{},
        friendadded:{},
        frienddeleted:{},
        chatview:{}
    },
    mutations:{
        realchat(state,data){
          if(data.data.type == 'chatview'){
            var list = data.data
          }else{
            var list = JSON.parse(data.data)
          }
           if(list.type === 'text_message'){ // 收到新消息
              state.chatinfolist = list
           }else if(list.type === 'friend_online'){ // 好友上线
              state.friendonline = list
           }else if(list.type === 'friend_offline'){ // 好友下线
              state.friendoffline = list
           }else if(list.type === 'friend_apply'){ // 好友申请
              state.friendapply = list
           }else if(list.type === 'friend_added'){ // 好友已添加在通知其上线
              state.friendadded = list
           }else if(list.type === 'friend_deleted'){ // 好友删除后通知对方 列表删除
              state.frienddeleted = list
           }else if(list.type === 'chatview'){
              state.chatview = list.list
           }
        }
    },
    
}