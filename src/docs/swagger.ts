import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Library API Documentation',
    description: 'Loan/Return API',
  },
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

swaggerAutogen()(outputFile, routes, doc).then(async () => {
  await import('../index');
});
