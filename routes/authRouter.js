import express from "express";
import validateBody from "../decorators/validateBody.js";
import { userSignupSchema, userSigninSchema } from "../schemas/userSchemas.js";
import authControllers from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js"

const authRouter = express.Router();

authRouter.post(
    "/signup",
    validateBody(userSignupSchema),
    authControllers.signup
);

authRouter.post(
    "/signin",
    validateBody(userSigninSchema),
    authControllers.signin
);

authRouter.get('/current', authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
