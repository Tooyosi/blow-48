const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  // List of files to be processed.
  apis: ['./routes/**/*.js'],
  // You can also set globs for your apis
  // e.g. './routes/*.js'
  basePath: '/',
  host: `${process.env.IP}:${process.env.PORT}`,
  schemes: ['http', 'https'],
  swaggerDefinition: {
    info: {
      description: 'BLOW 48',
      swagger: '2.0',
      title: 'BLOW 48',
      version: '1.0.0',
    },
  },
};
const specs = swaggerJsdoc(options);
module.exports = specs;