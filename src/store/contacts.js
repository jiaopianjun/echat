export default {
    state:{
        applyList:[],
        type:''
    },
    mutations:{
    	applystate(state,data){
            state.applyList = data.data
            state.type = data.type
        }
    }
}