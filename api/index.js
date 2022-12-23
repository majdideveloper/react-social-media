const express = require("express");
const app = express();
// more lib
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
//imoport router
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");


dotenv.config()
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//war mongoose fix with this line
mongoose.set("strictQuery", false);
//connect to mongoose 
mongoose.connect(process.env.URL_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));


//all route
app.use("/api/users",userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts",postRoute);












app.listen(8800,()=>{
    console.log("backend is running with majdouch ");

})
