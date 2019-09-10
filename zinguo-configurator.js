module.exports = function (RED) {
    var sha1 = require('node-sha1');
    var fs = require("fs");
    var path = require("path");
    var JsonDB = require("node-json-db");
    var defaultPath = path.join(RED.settings.userDir, "zinzuo");

    function ZinguoConfiguratorNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.phone = n.phone;
        this.deviceList = n.deviceList || [];
        this.password = n.password;
        this.hashPass = ''
        var node = this;
        console.log(`password: ${n.password}`)
        if (n.password) {
            sha1(n.password, function(err, hash){
                console.log(`hass: ${hash}`)
                if(err){
                    node.status({fill:"red", shape:"ring", text: "密码转hash失败,请检查密码"});
                    return
                }
                node.hashPass = hash
            })
        }

        var collectionFilePath = path.join(defaultPath, n.phone + ".json");

        try {
            var oldFile = path.join(process.cwd(), "JsonDB_" + n.collection + ".json");
            var stats = fs.statSync(oldFile);
            try {
                stats = fs.statSync(defaultPath);
            }catch(error) {
                fs.mkdirSync(defaultPath);
            }
            
            fs.renameSync(oldFile, collectionFilePath);
            this.log("Moved old file from '" + oldFile + "' to '" + collectionFilePath + '"');
        } catch (error) {

        }
        this.db = new JsonDB(collectionFilePath, true, true);
    }
    RED.nodes.registerType("zinguo-configurator", ZinguoConfiguratorNode);

}