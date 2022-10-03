import SocketIoWebPlugin from "../lib/ming_mock/SocketIoWebClient/SocketIoWebPlugin.js"


let socketIoWebPlugin= new SocketIoWebPlugin({
    host:"",
    path:"",
    key:"SocketIoWebPlugin",
    clientId:"A"
});
MIO.socketIoWebPluginParam={
    async call(msg){

        console.log(msg,"AAAAAAAAA")
    }
}

app.use(socketIoWebPlugin,MIO.socketIoWebPluginParam)




const vueConstructorData={
    async mounted() {

        //MIO.socketConnect();
    },
    data() {
        return {
            oneDui:  [1,1,1,0,0,0,0],
            twoDui:  [1,1,1,1,1,0,0],
            threeDui:[1,1,1,1,1,1,1],
        }
    },
    methods:{
        changeVal(dui, value, index){
            switch (dui){
                case 1:{
                    this.oneDui[index] ^=1;
                    break;
                }
                case 2:{
                    this.twoDui[index] ^=1;
                    break;
                }
                case 3:{
                    this.threeDui[index] ^=1;
                    break;
                }
            }
        }
    }

}


const {createApp}=Vue;
const vueApp= createApp(vueConstructorData);
vueApp.mount('#main');