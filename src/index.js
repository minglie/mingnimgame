M=require("ming_node")
const SocketIoServerPlugin =require("./plugins/SocketIoServerPlugin.js");

app= M.server();

socketIoServerPlugin =new SocketIoServerPlugin({
    key:"SocketIoServerPlugin",
});

const server=app.listen(8888)

app.use(socketIoServerPlugin,server);

app.get("/a",(req,res)=>{

    MIO.socketEmitCall("call1",{
        hello:"aaa"
    })
    res.send(M.successResult("ok"))
})