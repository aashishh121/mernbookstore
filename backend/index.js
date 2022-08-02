const express = require("express");
const router = require("./routes/user-routes");
require("./db/config");
// const cookieParser = require('cookie-parser');
const cors = require("cors");
const Product = require("./db/Product");
// require('dotenv').config();

// const User = require("./db/User");
// const port = process.env.port || 5000;

const app = express();

// app.use(cookieParser());
app.use(express.json());
app.use(cors());

//{credentials:true,origin: "http://localhost:3000" }

app.use("/api",router);

const PORT = process.env.PORT || 5000;


// app.use(express.json());

// app.post("/register", async (req,resp)=>{
//     let user = await User.findOne({ email: req.body.email });
//     if(user){
//         return resp.status(404).send("User Already Exisits");
//     }else{
//         user = new User(req.body);
//         let result = await user.save();
//         result = result.toObject();
//         delete result.password
//         resp.send(result);
//     }
// })

// app.post("/login", async (req,resp)=>{
//     if(req.body.password && req.body.email){
//         let user = await User.find(req.body).select("-password");
//         if(user){
//             resp.send(user);
//         }else{
//             resp.send({result:"No User Found"});
//         }
//     }else{
//        resp.send({result:"No User Found"});
//     }

// })

app.post("/add-product",async (req,resp,next)=>{
    let product = new Product(req.body);
    let result = await product.save();

    resp.send(result); 
})

app.get("/products", async (req,resp)=>{
    const products = await Product.find();
    if(products.length > 0){
        resp.send(products);
    }else{
        resp.send({result:"No Product Found"})
    }
})

app.delete("/product/:id", async (req,resp)=>{
    let result = await Product.deleteOne({_id:req.params.id});
    resp.send(result);
})

app.get("/product/:id", async (req,resp)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result){
        resp.send(result);
    }else{
        resp.send({result:"No Record found"});
    }
})

app.put("/product/:id", async (req,resp)=>{
    let result = await Product.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    )

    resp.send(result);
})

app.get("/search/:key", async (req,resp)=>{
    let result = await Product.find({
        "$or":[
            {
                bookName: {$regex: req.params.key}
            },
            {
                authorName: {$regex: req.params.key}
            }
        ]
    });

    
    resp.send(result)
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*",(req,resp)=>{
        resp.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
    })
}

app.listen(PORT);