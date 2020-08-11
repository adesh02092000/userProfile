const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://<user>:<password>@cluster0.gwuum.mongodb.net/profileDB",{useNewUrlParser: true, useUnifiedTopology: true});

const profileSchema = {
    name : String,
    post : String
};

let Profile = mongoose.model("Profile", profileSchema);

app.get("/", function(req, res)
{
    res.render("index");
})

// GET all the users

app.get("/users", function(req, res){
    Profile.find({}, function(err, foundUsers){
        if(!err){
            res.send(foundUsers);
        }
        else{
            res.send(err);
        }
    })
})

// POST a new user

app.post("/users", function(req, res){
    const newUser = new Profile({
        name : req.body.name,
        post : req.body.post
    });
    newUser.save(function(err){
        if(!err)
            {
                res.send("Successfully added a new user");
            }
        else{
            res.send(err);
        }
    });
})

// DELETE all the users

app.delete("/users", function(req, res){
    Profile.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all the users");
        }
        else{
            res.send("err");
        }
    })
})

// GET a specific user
app.route("/users/:userName")

.get(function(req, res){
   // used findOne to get only one entry 
    Profile.findOne({name : req.params.userName}, function(err, foundProfile){
        if(foundProfile){
            res.send(foundProfile);
        }
        else{
            res.send("No such user in the database");
        }
    });
})

.patch(function(req, res){
    Profile.updateOne(
    {name : req.params.userName},
    {$set : req.body},
    function(err){
        if(!err)
            {
                res.send("Successfully updated the user");
            }
    }
    );
})

.delete(function(req, res){

    Profile.deleteOne(
        {name : req.params.userName},
        function(err){
            if(!err){
                res.send("Successfully deleted the user");
            }
            else{
                res.send(err);
            }
        }
    );
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}


app.listen(port, function(req, res){
    console.log("Server is up");
})