var sha1 = require('node-sha1');
sha1('123', function(err, hash){
    console.log(hash)
})