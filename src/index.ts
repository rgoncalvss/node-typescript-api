import express from 'express';
import { errorMiddleware } from './middlewares/errors';
import { validateEnv } from './utils/validateEnv';
import router from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './docs/swagger_output.json';
import cors from 'cors';

validateEnv();

const PORT = Number(process.env.PORT) || 3030;

const HOSTNAME = process.env.HOSTNAME || 'localhost';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorMiddleware);

app.listen(PORT, HOSTNAME, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});
