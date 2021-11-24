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
      var id = req.query.blog_id;
    }else var id = ('')

      const query1 = "SELECT * FROM `comment_reply` a  where  a.comment_id = "+id+" ";
     console.log(req.query.blog_id)
      mysqlConnection.query(query1,  (error, results1)=>{
    
        if(!error){
            res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful GET Request"}, data: results1} );
           }
           else{
            res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
           }
        })
    
      })


      Router.post("/addcommentreplypost", (req, res) => {

        let data= [req.body.blog_id,
            req.body.comment_id,
            req.body.reply_data,
            req.body.user_id
          ];
          
          const query = "INSERT INTO `comment_reply` ( `blog_id`, `comment_id`, `reply_data`, `user_id`) VALUES (?, ?, ?, ?);";
          console.log(req)
              mysqlConnection.query(query, Object.values(data), (error)=>{
                  if(error){
                    res.json({success: "False",message: "failed", status: { code: 400, description: "Failed POST Request" , error: error}} );
                  } else{
                    res.json({success: "true",message: "OK", status: { code: 200, description: "Successful post Request"}} );
                  }
              })
    
      })


      module.exports= Router;