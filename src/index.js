M=require("ming_node")
SocketIoServerPlugin =require("./plugins/SocketIoServerPlugin.js");

app= M.server();

socketIoServerPlugin =new SocketIoServerPlugin();

const server=app.listen(8888)

app.use(socketIoServerPlugin,server);