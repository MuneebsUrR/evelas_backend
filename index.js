const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(cors());


let port = 5000;
//connect to mongodb atlas database
mongoose.connect(process.env.DB_CONNECTION).then(() => { console.log("Connection established") }).catch((err) => { console.log(err) });



// Routes
app.use('/api/auth', authRoutes);



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})