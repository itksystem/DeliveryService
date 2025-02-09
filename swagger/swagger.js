const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Service API',
      version: '1.0.0',
      description: 'API documentation for delivery service',
    },
     servers: [
      {
        url: 'http://localhost:3004'        
      },
      {
        url: 'http://pickmax.ru'        
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  
  apis: ['./swagger/*.js','./routes/*.js'], // Укажите путь к вашим файлам с роутами
};

const specs = swaggerJsdoc(options);
module.exports = specs;

