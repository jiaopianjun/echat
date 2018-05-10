export default {
    state:{
        list:[],
    },
    mutations:{
    	chatrecordstate(state,data){
            var oldlist = state.list,
                newdata = data.data,
                newlist = [],
                newchatlist=[];
            if(data.type === 'on'){
                for(var i in oldlist){
                    if(oldlist[i].session_id === newdata.session_id){
                        oldlist[i].messages.push(newdata.messages[0]) 
                    }
                } 
            }else{
               if(oldlist.length > 0){
                    for(var i in oldlist){
                        if(oldlist[i].session_id !== newdata.session_id){
                            newlist.push(oldlist[i])
                        }
                    } 
                    newlist.unshift(newdata)
                    state.list = $.extend(true, [], newlist)
                }else{
                    state.list.push(data.data)
                }  
            } 
        }
    }
}