const mysql = require("mysql");



const pool  = mysql.createConnection({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'practice'
})


pool.connect((err)=>{
    if(!err){
        console.log("Connected")
    }
    else{
        console.log(err)
    }
});

// pool.query(`select * from users`, (err,result,fileds) =>{
//     if(!err){
//         return console.log("Connected")
//     }
//     else{
//        return console.log(result)
//     }
// })

module.exports = pool;