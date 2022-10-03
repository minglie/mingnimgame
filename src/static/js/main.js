import SocketIoWebPlugin from "../lib/ming_mock/SocketIoWebClient/SocketIoWebPlugin.js"


let socketIoWebPlugin= new SocketIoWebPlugin({
    host:"",
    path:"",
    key:"SocketIoWebPlugin",
    clientId: new Date().getTime()
});
MIO.socketIoWebPluginParam={
    async call(msg){
        if(msg.method=="call.socketSetDui" && msg.clientId !=socketIoWebPlugin.clientId){
            M.mainPage.dataList=msg.params.dataList;
        }
    }
}

app.use(socketIoWebPlugin,MIO.socketIoWebPluginParam)




const vueConstructorData={
    async mounted() {
        M.mainPage=this;
        let r= await M.request.get("/getDui");
         this.dataList=r.data;
         MIO.socketConnect();
    },
    data() {
        return {
            dataList:{
                oneDui:  [],
                twoDui:  [],
                threeDui:[],
            }
        }
    },
    methods:{
        changeVal(dui, value, index){
            switch (dui){
                case 1:{
                    this.dataList.oneDui[index] ^=1;
                    this.postSetDui();
                    break;
                }
                case 2:{
                    this.dataList.twoDui[index] ^=1;
                    this.postSetDui();
                    break;
                }
                case 3:{
                    this.dataList.threeDui[index] ^=1;
                    this.postSetDui();
                    break;
                }
            }
        },
        async postSetDui(){
            let r= await M.request.post("/setDui?clientId="+socketIoWebPlugin.clientId,
                {
                    dataList: this.dataList
                }
               );

        },
        async gameReset(){
             M.request.get("/gameReset");
        }
    }
}


const {createApp}=Vue;
const vueApp= createApp(vueConstructorData);
M.vueApp=vueApp;
vueApp.mount('#main');