// import store from './../store'

exports.install = function (Vue, options) {
    Vue.prototype.socket = function (){
        var ws = new WebSocket("wss://stone.snail.com:4433/");
        ws.onmessage = function (evt) { 
          var received_msg = evt.data;
          console.log(evt,'evt');
          console.log(this.$store)
          this.$store.commit('realchat',{data:'asdg'})
        };
        ws.onopen = function (evt) {
            ws.send('{"type":"auth", "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NDAyNzU2MjUsInVzZXJfaWQiOjEwMDAxNTAyNDYzODk5LCJ0b2tlbiI6InBxT29qZGdsMmNuT1hvSTBhQkJScGQ3RGlXbjhaZGFJIn0.Q4MwhNC-HBCX2_xN1P6J5WFzW5E3v0CkT4dhBHwBI4LkpmXTcrVkuj8RReP5q1tfwaYsHpgdSfVHKXxgNUsy9jNqZb1TI0P1LBMgtq_cpeuzHAiAxYeea67dsiuU_TH8gjQFjO3mN9w_jgTTnYVxEDFoHN5M5JxSsrvVsZI3SpI"}');
        };
    };
};