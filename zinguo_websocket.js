module.exports = function (RED) {
    var axios = require('axios');
    const miDevicesUtils = require('./utils');

    function zinGuoWebsocket(config) {
        RED.nodes.createNode(this, config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);
        
        var node = this;
        if (this.server) {
            node.status({fill:"blue", shape:"ring", text: "ok"});
        } else {
            node.status({fill:"red", shape:"ring", text: "没有配置正确的峥果智能信息"});
            return
        }
        let phone = this.server.phone
        this.sid = phone;

        node.on('input', function (msg) {

            var payload = msg.payload
            var data = {
                "version": 4,
                "isEMUI": false,
                "isXiaoMi": false,
                "isGoogle": false,
                "lang": "zh_CN"
              }

            if (payload.status) {
                if (payload.status == -1) return;
                data['device'] = payload.data.token
                data['account'] = payload.data.telephone
                data['apnToken'] = payload.data.wifiList[0].token
                data['appName'] = payload.data.appName
                data['wifi'] = payload.data.wifiList[0].wifi
            }else {
                var store = miDevicesUtils.get(node)
                if(store){
                    data['device'] = store.token
                    data['account'] = store.telephone
                    data['apnToken'] = store.wifiList[0].token
                    data['appName'] = store.appName
                    data['wifi'] = store.wifiList[0].wifi
                }
            }

            if (data.device) {
                msg.payload = data
                node.send(msg)
            }
        });

    }
    RED.nodes.registerType("zinguo-websocket", zinGuoWebsocket);

}