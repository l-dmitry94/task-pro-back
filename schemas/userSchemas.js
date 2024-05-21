import Joi from "joi";
import { emailRegepxp, passwordRegexp } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().pattern(emailRegepxp).message("Email is not valid"),
    password: Joi.string().required().pattern(passwordRegexp).message("Password is not valid"),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegepxp).message("Email is not valid"),
    password: Joi.string().required().pattern(passwordRegexp).message("Password is not valid"),
});
