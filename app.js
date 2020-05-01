//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("Public"));


mongoose.connect("mongodb+srv://admin-div:25111994@cluster0-evnjg.mongodb.net/user", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret="this is encrypted";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const user = new mongoose.model("user", userSchema);


app.get("/", function(req, res) {
  res.sendFile(__dirname+"/index.html");
});
app.get("/login", function(req, res) {
  res.sendFile(__dirname+"/html/login.html");
});
app.get("/register", function(req, res) {
  res.sendFile(__dirname+"/index.html");
});
app.post("/register", function(req, res) {
      const newuser = new user({
        email: req.body.email,
        password: req.body.password
      });
      newuser.save(function(err){
        if(err){
          console.log(err);
        }
        else{
          res.sendFile(__dirname+"/html/sucess.html");
        }
      });

    });

    app.get("/login", function(req, res) {
      res.sendFile(__dirname+"/index.html");
    });
    app.post("/login",function(req,res){
      const email=req.body.email;
      const password=req.body.password;

      user.findOne({email:email},function(err,founduser){
        if(err){
          console.log(err);
        }else{
          if(founduser){
            if(founduser.password===password){
              res.sendFile(__dirname+"/html/loginsucess.html");
            }
          }
        }
      });
    });

let port=process.env.PORT;
if(port==null||port==""){
  port=3000;
}

app.listen(port,function()
{
  console.log("started");
});
