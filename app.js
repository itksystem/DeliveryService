const express = require('express');
const bodyParser = require('body-parser');
const deliveryRoutes = require('./routes/delivery');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(function(request, response, next){
  console.log(request);  
  next();
});


app.use('/api/delivery', deliveryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`
    ******************************************
    * ${process.env.SERVICE_NAME} running on port ${process.env.PORT} *
    ******************************************`);
});

