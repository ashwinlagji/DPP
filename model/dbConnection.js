var mysql = require('mysql');

var configuration= require ('../configs/config.js')();

console.log(configuration);

var connection = mysql.createConnection(
    {
        host     : configuration.mysql.host,
        user     : configuration.mysql.user,
        password : configuration.mysql.password,
        database : configuration.mysql.db_name,
        port     : configuration.mysql.port
    }
);
connection.connect();
connection.on("error",function(err){
    if (!err.fatal) {
        return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw err;
    }

    //console.log('Re-connecting lost connection: ' + err.stack);
    //connection=require('../configs/mysqlconfig.js');
    //connection.connect();

});



module.exports=connection;