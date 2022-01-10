// call all the required packages
const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const MultipartyMiddleware = multiparty({ uploadDir: './images' });
// const morgan = require('morgan');
// const multer = require('multer');
const cors = require('cors');

const path = require('path');
const fs = require('fs');
const app = express();

//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// config corsOptions
const corsOptions = {
    origin: 'http://localhost:8989'
};
app.use(cors());

//ROUTES WILL GO HERE
app.get('/', function (req, res) {
    res.json({ message: 'WELCOME' });
});

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));

// env config
const envConfig =require('./config/env.config');

// connect to db
const db = require('./models/index');
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to the database");
}).catch(err => {
    console.log("Cannot conect to the database! ", err);
    process.exit();
})

app.use(express.static("uploads"));
app.use("/images", express.static("images"));

app.post('/uploads', MultipartyMiddleware, function (req, res) {
    var TempFile = req.files.upload;
    var TemPathfile = TempFile.path;

    const targetPathUrl = path.join(__dirname, "./uploads/" + TempFile.name);
    let newTargetPath = targetPathUrl.split('\\');
    //targetPathUrl = "images/" + newTargetPath.slice(-1);
    // console.log(TemPathfile);
    // console.log("images\\" + newTargetPath.slice(-1));
    if (path.extname(TempFile.originalFilename).toLocaleLowerCase() === ".png" || ".jpg"){
        fs.rename(TemPathfile, "images\\" + newTargetPath.slice(-1), err => {
            // console.log(TempFile.name, path);
            let temUrl = `${envConfig.url}/images/${TempFile.originalFilename}`;
            res.status(200).json({
                uploaded: true,
                url: temUrl
            });
            if(err){
                console.log(err);
            }else{
                console.log(TemPathfile);
            }
        })
    }
});

//server listen route
require('./routes/tutorial.routes')(app);
require('./routes/user.routes')(app);

// set port number
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));