module.exports = {

    set: function(node, data) {
        let global = node.context().global
        let db = node.server.db
        let key = `/${node.sid}`
        console.log(`phone: ${key}`)
        global.set(node.sid, data)
        db.push(key, data)
    },

    get: function(node) {
        let db = node.server.db
        let key = `/${node.sid}`
        console.log(`phone: ${key}`)
        return db.exists(key) ? db.getData(key) : {}
    },

    delete: function(node) {
        let db = node.server.db
        let key = `/${node.sid}`
        console.log(`phone: ${key}`)
        db.exists(key) ? db.delete(key) : {}
    }
}