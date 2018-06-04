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
             var browser={
                 versions:function(){
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {
                        StoneClient: u.indexOf('Stone Client') > -1, //客户端内核
                    }
                }(),
                language:(navigator.browserLanguage || navigator.language).toLowerCase()
              },
              _this = this;
            state.list = data.data
            state.messageNum = data.messageNum
            if(data.messageNum === 0 && data.applyNum === 0){
              if(browser.versions.StoneClient){
                stone.showMsgMark(false)
              }                   
            }else{
              if(browser.versions.StoneClient){
                stone.showMsgMark(true)
              }
            }
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