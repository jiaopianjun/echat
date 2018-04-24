export default {
    state: {
        list: []
    },
    mutations:{
        perinfo(state,data){
          state.list = data.data
        }
    }
}