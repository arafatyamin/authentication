require("dotenv").config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')

const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 4000;


// connecting to DB
const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://yamin:yamin631987@cluster0.o0lhbrs.mongodb.net/usersTestDB");
        console.log("db is connected");
    } catch (error) {
        console.log("db is not connected");
        console.log(error);
        process.exit(1)
    }
};

// creating schema and model
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "user name is required"]
    },
    image : {
        type : String,
        required : [true, "user image is required"]
    }
})

const User = mongoose.model("Users", userSchema);

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    }
  })
  
  const upload = multer({ storage: storage })


app.get('/users', async(req, res) => {
    const user = await User.findOne({})
  res.status(200).send(user)
})

app.get('/register', (req, res) => {
  res.status(200).sendFile(__dirname + "/index.html")
})

app.post('/register', upload.single("image"), 
 async(req, res) => {  
  try{
    const newUser = new User({
        name: req.body.name,
        image: req.file.filename,
    });
    await newUser.save();
    res.status(201).send(newUser)
  } catch(error){
    res.status(500).send(error.message)
  }
})


app.get('/test', (req, res) => {
  res.send('server running')
})


// route not found error
app.use((req, res, next) => {
    res.status(404).json({message:"route not found"});
});
// route not found error
app.use((err, req, res, next) => {
    res.status(500).json({message:"server is broken"});
});

app.listen(port, async ()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();
})