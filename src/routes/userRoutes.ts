// userRoutes.ts
import express from "express";
import { UserController } from "./../controllers/users.controller";
//import { errorHandler } from "../utils/error-handler";

const userRouter = express.Router();

userRouter.get("/users/:id", UserController.findById);
userRouter.post("/users", UserController.create);

export default userRouter;
