const express =require("express");
const Router = express.Router();
var cors = require('cors');
var async = require('async');
const mysqlConnection = require("../connection");
const {hashSync, genSaltSync, compareSync} = require("bcrypt");
const{sign} = require("jsonwebtoken");

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
Router.use(bodyParser.json());



Router.use(cors())

Router.get('/', (req, res) => {
   
  const query1 = "select *  from  users";
  mysqlConnection.query(query1,  (error, results1)=>{

    if(!error){
        res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful GET Request"}, data: results1} );
       }
       else{
        res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
       }
    })

  })

  Router.post("/registration", async (req, res) => {

    
	  const errors = {};

    if (!String(req.body.name).trim()) {
      errors.name = ['Name is required'];
    }
    
    if (!(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(req.body.email))) {
      errors.email = ['Email is not valid.'];
    }
    
    if (Object.keys(errors).length) {
      return req.error(400, {errors});
    }
    

     data= [req.body.name,
        req.body.email,
        req.body.password
        // await bcrypt.hash(req.body.password, 10)
      ];
      const query = "INSERT INTO `users` ( `name`, `email`, `password`) VALUES (?, ?,SHA2(?, 256)); ";
          mysqlConnection.query(query, Object.values(data), (error)=>{
              if(error){
                res.json({success: "False",message: "failed", status: { code: 400, description: "Failed POST Request" , error: error}} );
              } else{
                res.json({success: "true",message: "OK", status: { code: 200, description: "Successful post Request"}} );
              }
          })

  })

  Router.post('/login', (req, res, next)=>{
    let data= [req.body.name, req.body.password ];
   
    const query = "select * from `users` where name = ? and password = SHA2(?, 256)";
        mysqlConnection.query(query, Object.values(data), (error , results, fields)=>{
         
          if(error){
              res.json({success: "true",message: "OK",status: { code: 401, }, reason: error.code });
          } if(results.length==0){
            res.json({success: "true",message: "OK",status: { code: 401, }, reason: "incorrect user id or password" });
          }
          else{
              const result = results.length>0;
              if(result){
                req.body.password = undefined;
                const jsontoken =sign({result: results}, "qwert",{
                  expiresIn: "5h"
                });
                return res.json({success: "true",message: "OK",status: { code: 200, }, data: results,  token: jsontoken });
              }
               
                
          }
      })

}); 


module.exports= Router;