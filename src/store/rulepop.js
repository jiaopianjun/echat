export default {
    state:{
        list:{},
        type:'',
        status:false
    },
    mutations:{
    	rulestate(state,data){
            state.list = data.data
            state.type = data.type
            state.status = data.status
        }
    }
}