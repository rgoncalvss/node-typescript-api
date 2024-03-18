import express from 'express';
import userRouter from './routes/userRoutes';
import bookRouter from './routes/bookRoutes';
import { errorMiddleware } from './middlewares/errors';

const PORT = process.env.PORT || 3000;

const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

const app = express();

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});

app.use(express.json());

app.use('/api', userRouter);
app.use('/api', bookRouter);
app.use(errorMiddleware);
