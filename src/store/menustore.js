export default {
    // namespaced: true,
    state:{
        cause:true,
        other:false,
        list:[],
        messageNum:0,
        applyNum:0
    },
    mutations:{
    	menustate(state,data){
            state.list = data.data
            state.messageNum = data.messageNum
            state.applyNum = data.applyNum
    		if(data.type === true && data.flag === false){
    			state.cause = true
    			state.other = false
    		}else if(data.type == false && data.flag == false){
    			state.cause = false
    			state.other = false
    		}else  if(data.type == false && data.flag == true){
    			state.cause = false
    			state.other = true
    		}
        }
    }
}