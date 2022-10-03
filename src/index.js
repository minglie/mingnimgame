M=require("ming_node")
const SocketIoServerPlugin =require("./plugins/SocketIoServerPlugin.js");

app= M.server();

socketIoServerPlugin =new SocketIoServerPlugin({
    key:"SocketIoServerPlugin",
});

const server=app.listen(8888)

app.use(socketIoServerPlugin,server);

defaultDataList={
    oneDui:  [1,1,1,0,0,0,0],
    twoDui:  [1,1,1,1,1,0,0],
    threeDui:[1,1,1,1,1,1,1],
}

dataList={
        oneDui:  [1,1,1,0,0,0,0],
        twoDui:  [1,1,1,1,1,0,0],
        threeDui:[1,1,1,1,1,1,1],
}

app.get("/getDui",(req,res)=>{

    res.send(M.successResult(dataList))
})


app.post("/setDui",(req,res)=>{
    dataList=req.params.dataList;
    MIO.socketEmitCall("socketSetDui",req.params);
    res.send(M.successResult("ok"))
})

app.get("/gameReset",(req,res)=>{
    dataList=defaultDataList;
    MIO.socketEmitCall("socketSetDui",{
        clientId:11,
        dataList
    });
    res.send(M.successResult("ok"))
})