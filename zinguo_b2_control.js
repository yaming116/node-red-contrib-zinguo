module.exports = function (RED) {
    var axios = require('axios');
    const miDevicesUtils = require('./utils');

    function zinGuoNode(config) {
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
        console.log(config)

        node.on('input', function (msg) {
            var data = miDevicesUtils.get(node)
            var postData = {
                'mac': config.mac, 
                "warmingSwitch1": 0,
                "warmingSwitch2": 0,
                "windSwitch": 0,
                "lightSwitch": 0,
                "ventilationSwitch": 0,
                "turnOffAll": 0,
                "setParamter": false,
                "action": false,
                "masterUser": data.masterUser
              }

              var state = config;

              if (state.s1) {
                postData.warmingSwitch1 = 1
              }

              if (state.s2) {
                postData.warmingSwitch2 = 1
              }

              if (state.s3) {
                postData.windSwitch = 1
              }

              if (state.s4) {
                postData.lightSwitch = 1
              }

              if (state.s5) {
                postData.ventilationSwitch = 1
              }

              if (state.s6) {
                postData.turnOffAll = 1
              }

            getDataFromHttp(node, postData, msg, data.token)
        });
    }

    function getDataFromHttp(node , postData, msg, token){
        var payload = {}

        axios({
            method: 'put',
            url: `http://114.55.66.106:8002/api/v1/wifiyuba/yuBaControl`,
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'x-access-token': token
            },
            data: postData

        }).then(function (response) {
            
            var data = response.data
            if(data.result && data.result == 'error') {
                throw new Error("参数有误")
            }
            msg.headers = response.headers
            msg.request = response.request
            payload.status = 1
            payload.data = data
            msg.payload = payload
            node.send([msg, null])

        }).catch(function (error) {
            payload.status = -1
            payload.data = error.message
            msg.payload = payload
            msg['error'] = error
            node.send([null, msg])
        })
    }

    RED.nodes.registerType("zinguo-control", zinGuoNode);

}