module.exports = function (RED) {
    var axios = require('axios');
    const miDevicesUtils = require('./utils');

    function zinGuoLogin(config) {
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
        let hashPass = this.server.hashPass

        node.on('input', function (msg) {

            var payload = {}
            axios({
                method: 'post',
                url: `http://114.55.66.106:8002/api/v1/customer/login`,
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                },
                data: { "account": phone, "password":  hashPass}


            }).then(function (response) {
                console.log(response)
                var data = response.data
                if(data.result&& data.result == 'error') {
                    throw new Error("参数有误")
                }
                msg.headers = response.headers
                msg.request = response.request
                miDevicesUtils.set(node, data)
                payload.status = 1
                payload.data = data
                msg.payload = payload
                node.send([msg, null])

            }).catch(function (error) {
                miDevicesUtils.delete(node)
                payload.status = -1
                payload.data = error.message
                msg.payload = payload
                msg['error'] = error
                node.send([null, msg])
            })
        });

    }
    RED.nodes.registerType("zinguo-login", zinGuoLogin);

}