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
        alert(5)
        MIO.socketConnect();
    },
    data() {
        return {

        }
    },
    methods:{

    }

}


const {createApp}=Vue;
const vueApp= createApp(vueConstructorData);
vueApp.mount('#main');