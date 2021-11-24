const express =require("express");
const Router = express.Router();
var cors = require('cors');
const mysqlConnection = require("../connection");

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
Router.use(bodyParser.json());

Router.use(cors())

Router.get('/', (req, res) => {

  if(req.query.search){
    var search =("and (o.title LIKE '%"+req.query.search+"%' or o.content LIKE '%"+req.query.search+"%')");
  }else var search = ('')

  // if(req.query.page && req.query.end_limit){
  //   var start_limit = (req.query.page-1) * req.query.end_limit
  //   var limit =('limit '+start_limit+ ", " +req.query.end_limit );
  // }else var limit = ('');     
   
  if(req.query.id){
    var id =('and o.id ='+req.query.id);
  }else var id = ('')
          
    const query1 = "SELECT o.title,o.id, o.content,o.date,o.user_id, i.name FROM blog_details o INNER JOIN users i on o.user_id = i.id  "+id+" "+search+" ";
    mysqlConnection.query(query1,  (error, results1)=>{
  
      if(!error){
          res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful GET Request"}, data: results1} );
         }
         else{
          res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
         }
      })
  
    })

    Router.post("/addblog", (req, res) => {

      if (!String(req.body.title).trim()) {
        error = ['Title is required'];
       return res.json({success: "False",message: "Title is requred", status: { code: 400, description: "Failed POST Request" , error: error}} );
      }

        let data= [req.body.title,
            req.body.content,
            req.body.user_id,
            req.body.date
          ];
          const query = "INSERT INTO `blog_details` ( `title`, `content`, `user_id`, `date`) VALUES (?, ?,?,now() ); ";
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
            const query = "DELETE FROM `blog_details` WHERE id = "+data+"";
            mysqlConnection.query(query,  (error, results1)=>{
              if(!error){
                res.json({success: "true",message: "OK", count:results1.length, status: { code: 200, description: "Successful Deleted Request"}, data: results1} );
              }
              else{
                res.json({success: "False",message: "failed", status: { code: 400, description: "Failed Request" , error: error}} );
              }
          })
    
      
        })

      


      Router.put('/putBlogdata', (req,res)=> {
        const {title, content, user_id, date, id} = req.body
       mysqlConnection.query("UPDATE blog_details SET  title = ?, content = ?, user_id = ?, date = ?  WHERE id = ?",[ title,content,user_id,date,id], (err,rows)=>{
      
         if(!err){
          res.json({success: "true",message: "OK", status: { code: 200, description: "Successful PUT Request"}, data: rows} );
         }
         else{
          res.json({success: "False",message: "failed", status: { code: 400, description: "Failed PUT Request" , error: err}} );
         }
       });
       console.log(mysqlConnection);
    });


    module.exports= Router;