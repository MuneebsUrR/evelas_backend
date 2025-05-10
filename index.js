const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes'); 
const venueProvider = require('./routes/venueProvider'); 
const bookingRoutes = require('./routes/bookingRoutes');
const organizerRoutes = require('./routes/organizerRoutes');



dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(cors());


let port = 3000;
//connect to mongodb atlas database
mongoose.connect(process.env.DB_CONNECTION).then(() => { console.log("Connection established") }).catch((err) => { console.log(err) });



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', venueProvider);
app.use('/api/bookings', bookingRoutes);
app.use('/organizer',organizerRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})