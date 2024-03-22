import express from 'express';
import { errorMiddleware } from './middlewares/errors';
import { validateEnv } from './utils/validateEnv';
import router from './routes/routes';

validateEnv();

const PORT = process.env.PORT || 3000;

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

const app = express();

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});

app.use(express.json());

app.use(router);
app.use(errorMiddleware);
