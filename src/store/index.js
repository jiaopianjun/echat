import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import menustore from './menustore.js'
import rulepop from './rulepop.js'
import contacts from './contacts.js'
export default new vuex.Store({
    modules:{
    	menu:menustore,
    	rule:rulepop,
    	contacts:contacts
    }
})