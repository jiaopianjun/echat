export default {
    state: {
        connect: false,
        message: null,
        list:{}
    },
    mutations:{
        recordstate(state,data){
            state.connect = true;
            console.log(data)
        }
    },
    
}