var util= require('util');
var encoder = new util.TextEncoder('utf-8');
const mongodb = require('mongodb');
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
const parcel = require('./models/parcel');
const url = 'mongodb://localhost:27017/ParcelsDatabase';
const app = express();
app.listen(8080);
const path = require('path');
app.use(express.static('public'))
app.use(express.static('files'))

//Get is about fetching data with no side effects
//Post is about fetching data and can have side effects, you aren't really sending new data rather you are sneding data from the page
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(express.urlencoded({extended:true}));
app.use(express.static("imgs"));
app.use(express.static("views/css"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
let db;
mongoose.connect(url, function(err){
    if(err===null){
        console.log('Connected successfully'); 
        }});

// MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
//     if (err) {
//         console.log('Err  ', err);
//     } else {
//         console.log("Connected successfully to server");
//         db = client.db('ParcelsDatabase');
//        /* let obj={
//             sender: 'Ted',
//             address: '13 Lees',
//             weight:'145',
//             fragile: 'True',
//         }*/
//       //  db.collection('lib').insertOne(obj);
//     }
// });

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/addparcel", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/newparcel.html"));
});
app.get("/parcelbySender", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/parcelbySender.html"));
});
app.get("/parcelbyWeight", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/parcelbyWeight.html"));
});

app.post("/sortbySender", (req, res)=>{
    let aParcel = req.body;
    let sender = aParcel.Sender;
    // db.collection("parcels").find({}).toArray(function (err, data){
     parcel.find({sender: sender}, function(err, docs){
         res.render("results.html", {db:docs});
     })       
 });

 app.post("/sortbyWeight", (req, res)=>{
    let aParcel = req.body;
    let numb1 = aParcel.num1;
    let numb2 = aParcel.num2;
    let num1 = parseInt(numb1);
    let num2 = parseInt(numb2)
    // db.collection("parcels").find({}).toArray(function (err, data){
    parcel.where('weight').gte(num1).lte(num2).exec(function(err, docs){
         res.render("results.html", {db:docs});
     })      
 });


app.get("/listparcels", (req, res)=>{
   // db.collection("parcels").find({}).toArray(function (err, data){
    parcel.find({}, function(err, docs){
        res.render("results.html", {db:docs});
    })       
});
    
//do a simple if statement for the parcel.
app.post("/newadd", (req, res)=>{
   /* let obj = req.body;
    let sender = obj.sender;
    let address = obj.address;
    let weight = obj.Weight;
    let fragile = obj.Fragile;
    let cost = obj.cost;
    let ship = obj.ship;
    let desc = obj.desc;*/
 //   let size1 = sender.length();
   // let size2 = address.length();
   let aParcel=req.body; 
   let sender = aParcel.sender;
   let address = aParcel.address;
   let weight = aParcel.Weight;
   let fragile = aParcel.Fragile;
   let cost = aParcel.cost;
   let ship = aParcel.ship;
   let desc = aParcel.desc;
   let addressLength = aParcel.length;
   let senderLength = aParcel.length;


        let parcel1 = new parcel({
            _id: new mongoose.Types.ObjectId(),
            sender:sender,
            address:address,
            weight:weight,
            fragile:fragile,
            cost:cost,
            shipType: ship,
            desc: desc 

        });
        parcel1.save(function (err) {
            if (err) throw err;
            console.log('Addedparces successfully Added to DB');
        });
        res.sendFile(path.join(__dirname,"views/success.html"));
    });


//    db.collection('parcels').insertOne({
//     sender: sender,
//     address: address,
//     weight: weight,
//     fragile:fragile
//    });

   /* if(sender.length > 3 && address.length > 3 && parseInt(weight) > 0){
        db.push({
            sender:sender,
            address:address,
            weight:weight,
            fragile:fragile,
            cost:cost,
            ship:ship,
            desc:desc
        });
        
    }
    else{
        res.sendFile(path.join(__dirname,"views/wronglength.html"));
    }*/
     

    
    
   // const result = parseInt(n1) + parseInt(n2);
    


app.get("/deleteparcel", (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/deleteParcel.html'));
});

app.post("/delete", function(req, res){
    let details = req.body;
   // let senderName = {sender: details.deletebySender};
    //db.collection("parcels").deleteOne(senderName);
    parcel.deleteMany({sender: details.deletebySender}, function (err, doc) {
        console.log(doc);  
    });
    res.redirect("/listparcels");
});

app.get("/deletebyWeight", (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/deletebyWeight.html'));
});

app.post("/deleteParbyWeight", function(req, res){
    let details = req.body;
    let weighttoDel = details.weight;
    let num = parseInt(weighttoDel);
    db.collection("parcels").deleteMany({weight: {$lte: weighttoDel}});
    res.redirect("/listparcels");
})

app.get("/updateparcel", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/updateparcel.html"));
});

app.post("/updateparcels", function(req, res){
    let parcelDetails = req.body;
    let sender = parcelDetails.sender;
    let address = parcelDetails.address;
    let weight = parcelDetails.weight;
    let fragile = parcelDetails.fragile;
    let parcelID = parcelDetails.idtoUpdate;
    let realId = parseInt(parcelID);
    let filter = {_id:mongodb.ObjectId(parcelID)};

     let update= {$set: 
         {sender: sender,
         address: address,
         weight: weight,
         fragile: fragile
     },};
    // db.collection("parcels").updateOne(filter, update);
    parcel.findByIdAndUpdate({_id:mongodb.ObjectId(parcelID)}, {$set: 
        {sender: sender,
        address: address,
        weight: weight,
        fragile: fragile
    },}, function (err, doc) {
        console.log(doc);
    });
    res.redirect("/");
})

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "views/404.html"));
});
