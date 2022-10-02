var M=require("ming_node");

class SocketIoServerPlugin {
    socketClientList=[];

    install(app,server){
        let that=this;
        var io = require('socket.io')(server, {
            allowEIO3: true,
            cors: {
                origin: "*", // from the screenshot you provided
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', function(socket){
            console.log("connected")
            that.socketClientList.push(socket);
            socket.on('event', function(msg){
                console.log('event被触发:',  msg );
            });
            //移除离线的人
            socket.on('disconnect', function(){
                let n = that.socketClientList.indexOf(socket);
                if(n !=-1) {
                    that.socketClientList.splice(n,1);
                }
                console.log("disconnect")
            });
        });
        MIO.socketEmitCall=async (method,params)=>{
            let reqBody={
                "method": method,
                "params": params
            };
            io.emit("event",reqBody);
        }

    }
}

module.exports =  SocketIoServerPlugin;