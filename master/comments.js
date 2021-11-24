const express =require("express");
const Router = express.Router();
var cors = require('cors');
const mysqlConnection = require("../connection");

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
Router.use(bodyParser.json());
Router.use(cors())



Router.get('/', (req, res) => {
  
     
    if(req.query.blog_id){
      var id =('and o.blog_id ='+req.query.blog_id);
    }else var id = ('')

  
      const query1 = "SELECT o.comment,o.id, o.date,o.blog_id,o.user_id, i.name FROM comments o INNER JOIN users i on o.user_id = i.id  "+id+" ";
      mysqlConnection.query(query1,  (error, results1)=>{
    
        if(!error){
            res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful GET Request"}, data: results1} );
           }
           else{
            res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
           }
        })
    
      })


      
      

      Router.post("/addcomment", (req, res) => {

          let data= [req.body.user_id,
              req.body.blog_id,
              req.body.comment,
              req.body.date
            ];
            const query = "INSERT INTO `comments` ( `user_id`, `blog_id`, `comment`, date) VALUES (?, ?,?,now() ) ";
                mysqlConnection.query(query, Object.values(data), (error)=>{
                    if(error){
                      res.json({success: "False",message: "failed", status: { code: 400, description: "Failed POST Request" , error: error}} );
                    } else{
                      res.json({success: "true",message: "OK", status: { code: 200, description: "Successful post Request"}} );
                    }
                })
      
        })

        Router.delete("/delete", (req, res) => {
          let data= req.query.id;
            const query = "DELETE FROM `comments` WHERE id = "+data+"";
            mysqlConnection.query(query,  (error, results1)=>{
              if(!error){
                res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful Deleted Request"}, data: results1} );
              }
              else{
                res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
              }
          })
        })



        Router.put('/putCommentData', (req,res)=> {
            const {comment, blog_id, user_id, date, id} = req.body
           mysqlConnection.query("UPDATE comments SET  comment = ?, blog_id = ?, user_id = ?, date = ?  WHERE id = ?",[ comment,blog_id,user_id,date,id], (err,rows)=>{
          
             if(!err){
              res.json({success: "true",message: "OK", status: { code: 200, description: "Successful PUT Request"}, data: rows} );
             }
             else{
              res.json({success: "False",message: "failed", status: { code: 400, description: "Failed PUT Request" , error: err}} );
             }
           });
        });
    
        module.exports= Router;