const express = require('express');
const bodyParser = require('body-parser');
const deliveryRoutes = require('./routes/delivery');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger'); // Импортируйте конфигурацию Swagger
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(function(request, response, next){
  console.log(request);  
  next();
});

// Маршрут для документации Swagger

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/delivery', deliveryRoutes);



app.listen(process.env.PORT, () => {
  console.log(`
    ******************************************
    * ${process.env.SERVICE_NAME} running on port ${process.env.PORT} *
    ******************************************`);
});

