import express, { Express } from "express";
import { config } from "dotenv";
import * as swaggerDocumnet from '../swagger.json';
import swaggerUi  from 'swagger-ui-express'
import { authRoutes } from './auth'
import { errorHandler, verifyToken } from "./middleware";
import cors from 'cors';

import {
  comentaryRoutes,
  postRoutes,
  profileRoutes,
  userRoutes,
} from "./feature";
import morgan from "morgan";
import path from "path";

const app: Express = express();

config();

app.set("PORT", process.env.PORT || 4444);
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumnet));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comentary", comentaryRoutes); 
app.use("/api/v1/profile", profileRoutes);
app.all('*', (req, res) => {
 return res.redirect("/")
})
app.use(errorHandler);

export default app;