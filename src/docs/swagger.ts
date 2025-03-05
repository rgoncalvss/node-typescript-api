// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')();
import 'dotenv/config';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Library API Documentation',
    description: 'Loan/Return API',
  },
  host: 'localhost:3000',
  servers: [
    {
      url: 'http://localhost:3000',
      description: '',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
};

const outputFile = './swagger_output.json';
const routes = ['./src/routes/routes.ts'];

swaggerAutogen(outputFile, routes, doc);
