import express from 'express';
import { errorMiddleware } from './middlewares/errors';
import { validateEnv } from './utils/validateEnv';
import router from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './docs/swagger_output.json';

validateEnv();

const PORT = process.env.PORT || 3000;

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(express.json());

app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});
