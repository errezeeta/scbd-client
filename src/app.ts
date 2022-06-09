import express from 'express';
import cors from 'cors';
import rsaRouter from './routes/rsa.route';

const app= express();
app.set('PORT', process.env.PORT || 8080);
app.use(express.json());
app.use(cors());

//Rutas
app.use('/rsa', rsaRouter);

export default app;